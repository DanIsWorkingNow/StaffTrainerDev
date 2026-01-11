import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient } from '~/utils/supabase'

// Type definitions
export type UserRole = 'ADMIN' | 'COORDINATOR' | 'TRAINER'

export type Permission = {
  resource: string
  action: 'create' | 'read' | 'update' | 'delete'
}

export type UserRoleData = {
  userId: string
  trainerId: string
  email: string
  name: string
  role: UserRole
  roleLevel: number
  rank?: string
  permissions: Permission[]
}

/**
 * Get current user's role and permissions
 */
export const getCurrentUserRole = createServerFn({ method: 'GET' }).handler(
  async (): Promise<UserRoleData | null> => {
    const supabase = getSupabaseServerClient()

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return null
    }

    // Get trainer profile with role
    const { data: trainerData, error: trainerError } = await supabase
      .from('trainers')
      .select('id, name, role_id, rank')
      .eq('user_id', user.id)
      .single()

    if (trainerError || !trainerData) {
      console.error('Error fetching trainer data:', trainerError)
      return null
    }

    // Get role data separately
    const { data: roleData, error: roleError } = await supabase
      .from('roles')
      .select('id, name, level')
      .eq('id', trainerData.role_id)
      .single()

    if (roleError || !roleData) {
      console.error('Error fetching role data:', roleError)
      return null
    }

    // Get permissions for this role
    const { data: permissionsData } = await supabase
      .from('role_permissions')
      .select(
        `
        permission:permissions (
          resource,
          action
        )
      `
      )
      .eq('role_id', roleData.id)

    const permissions: Permission[] =
      permissionsData?.map((rp: any) => ({
        resource: rp.permission.resource,
        action: rp.permission.action,
      })) || []

    return {
      userId: user.id,
      trainerId: trainerData.id,
      email: user.email || '',
      name: trainerData.name,
      role: roleData.name as UserRole,
      roleLevel: roleData.level,
      rank: trainerData.rank,
      permissions,
    }
  }
)

/**
 * Check if current user has required role
 */
export const requireRole = createServerFn({ method: 'GET' })
  .inputValidator((allowedRoles: UserRole[]) => allowedRoles)
  .handler(async ({ data: allowedRoles }): Promise<boolean> => {
    const userData = await getCurrentUserRole()

    if (!userData) {
      throw new Error('Not authenticated')
    }

    if (!allowedRoles.includes(userData.role)) {
      throw new Error(`Insufficient permissions. Required role: ${allowedRoles.join(' or ')}`)
    }

    return true
  })

/**
 * Check if current user has specific permission
 */
export const hasPermission = createServerFn({ method: 'GET' })
  .inputValidator((data: { resource: string; action: Permission['action'] }) => data)
  .handler(async ({ data }): Promise<boolean> => {
    const userData = await getCurrentUserRole()

    if (!userData) {
      return false
    }

    // ADMIN has all permissions
    if (userData.role === 'ADMIN') {
      return true
    }

    // Check specific permission
    return userData.permissions.some(
      (p) => p.resource === data.resource && p.action === data.action
    )
  })

/**
 * Require specific permission (throws error if not allowed)
 */
export const requirePermission = createServerFn({ method: 'GET' })
  .inputValidator((data: { resource: string; action: Permission['action'] }) => data)
  .handler(async ({ data }): Promise<boolean> => {
    const allowed = await hasPermission({ data })

    if (!allowed) {
      throw new Error(`Insufficient permissions to ${data.action} ${data.resource}`)
    }

    return true
  })

/**
 * Check if current user is ADMIN
 */
export const isAdmin = createServerFn({ method: 'GET' }).handler(
  async (): Promise<boolean> => {
    const userData = await getCurrentUserRole()
    return userData?.role === 'ADMIN' || false
  }
)

/**
 * Check if current user is COORDINATOR or above
 */
export const isCoordinatorOrAbove = createServerFn({ method: 'GET' }).handler(
  async (): Promise<boolean> => {
    const userData = await getCurrentUserRole()
    if (!userData) return false
    return userData.role === 'ADMIN' || userData.role === 'COORDINATOR'
  }
)

/**
 * Check if current user is TRAINER
 */
export const isTrainer = createServerFn({ method: 'GET' }).handler(
  async (): Promise<boolean> => {
    const userData = await getCurrentUserRole()
    return userData?.role === 'TRAINER' || false
  }
)