import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient } from '~/utils/supabase'

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

// UPDATED: Added 4 new specialized coordinator roles
export type UserRole = 
  | 'ADMIN' 
  | 'COORDINATOR' 
  | 'EVENT COORDINATOR'      // New: Events module admin
  | 'PT COORDINATOR'         // New: Physical Training module admin
  | 'RA COORDINATOR'         // New: Religious Activities module admin
  | 'DORMITORY COORDINATOR'  // New: Dormitory module admin
  | 'TRAINER'

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

// ============================================================================
// SERVER-SIDE FUNCTIONS (Original functions - unchanged)
// ============================================================================

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

// ============================================================================
// NEW: CLIENT-SIDE HELPER FUNCTIONS FOR UI RENDERING
// These functions are used in components to show/hide UI elements
// ============================================================================

/**
 * CRITICAL: Check if user can access dormitory module
 * Only ADMIN, COORDINATOR, and DORMITORY COORDINATOR should have access
 * EVENT, PT, and RA coordinators must NOT have access
 */
export function canAccessDormitoryClient(role: UserRole): boolean {
  return ['ADMIN', 'COORDINATOR', 'DORMITORY COORDINATOR'].includes(role)
}

/**
 * Check if user can access events module
 * Available to: ADMIN, COORDINATOR, EVENT COORDINATOR
 */
export function canAccessEventsClient(role: UserRole): boolean {
  return ['ADMIN', 'COORDINATOR', 'EVENT COORDINATOR'].includes(role)
}

/**
 * Check if user can access physical training module
 * Available to: ADMIN, COORDINATOR, PT COORDINATOR
 */
export function canAccessPTClient(role: UserRole): boolean {
  return ['ADMIN', 'COORDINATOR', 'PT COORDINATOR'].includes(role)
}

/**
 * Check if user can access religious activities module
 * Available to: ADMIN, COORDINATOR, RA COORDINATOR
 */
export function canAccessReligiousClient(role: UserRole): boolean {
  return ['ADMIN', 'COORDINATOR', 'RA COORDINATOR'].includes(role)
}

/**
 * Generic function to check module access
 * Used for dynamic role checking
 */
export function canManageModuleClient(role: UserRole, module: string): boolean {
  switch (module) {
    case 'events':
      return canAccessEventsClient(role)
    case 'pt':
    case 'physical-training':
      return canAccessPTClient(role)
    case 'religious':
    case 'religious-activity':
      return canAccessReligiousClient(role)
    case 'dormitory':
      return canAccessDormitoryClient(role)
    default:
      return false
  }
}

/**
 * Check if user can access trainer overview
 * Typically only ADMIN and COORDINATOR (not specialized coordinators)
 */
export function canAccessOverviewClient(role: UserRole): boolean {
  return ['ADMIN', 'COORDINATOR'].includes(role)
}

// ============================================================================
// NEW: SERVER-SIDE SECURITY FUNCTIONS FOR API PROTECTION
// These functions are used in API routes to verify access
// ============================================================================

/**
 * Server-side: Check if user can access dormitory module
 * CRITICAL: This enforces dormitory access at the API level
 */
export const canAccessDormitory = createServerFn({ method: 'GET' }).handler(
  async (): Promise<boolean> => {
    const userData = await getCurrentUserRole()
    if (!userData) return false
    return canAccessDormitoryClient(userData.role)
  }
)

/**
 * Server-side: Check if user can access events module
 */
export const canAccessEvents = createServerFn({ method: 'GET' }).handler(
  async (): Promise<boolean> => {
    const userData = await getCurrentUserRole()
    if (!userData) return false
    return canAccessEventsClient(userData.role)
  }
)

/**
 * Server-side: Check if user can access PT module
 */
export const canAccessPT = createServerFn({ method: 'GET' }).handler(
  async (): Promise<boolean> => {
    const userData = await getCurrentUserRole()
    if (!userData) return false
    return canAccessPTClient(userData.role)
  }
)

/**
 * Server-side: Check if user can access Religious Activities module
 */
export const canAccessReligious = createServerFn({ method: 'GET' }).handler(
  async (): Promise<boolean> => {
    const userData = await getCurrentUserRole()
    if (!userData) return false
    return canAccessReligiousClient(userData.role)
  }
)

/**
 * Server-side: Check if user can access trainer overview
 */
export const canAccessOverview = createServerFn({ method: 'GET' }).handler(
  async (): Promise<boolean> => {
    const userData = await getCurrentUserRole()
    if (!userData) return false
    return canAccessOverviewClient(userData.role)
  }
)

/**
 * Server-side: Generic module access check
 */
export const canManageModule = createServerFn({ method: 'GET' })
  .inputValidator((module: string) => module)
  .handler(async ({ data: module }): Promise<boolean> => {
    const userData = await getCurrentUserRole()
    if (!userData) return false
    return canManageModuleClient(userData.role, module)
  })

// ============================================================================
// NEW: SPECIALIZED COORDINATOR CHECK FUNCTIONS
// ============================================================================

/**
 * Check if current user is EVENT COORDINATOR or above
 */
export const isEventCoordinator = createServerFn({ method: 'GET' }).handler(
  async (): Promise<boolean> => {
    const userData = await getCurrentUserRole()
    if (!userData) return false
    return ['ADMIN', 'COORDINATOR', 'EVENT COORDINATOR'].includes(userData.role)
  }
)

/**
 * Check if current user is PT COORDINATOR or above
 */
export const isPTCoordinator = createServerFn({ method: 'GET' }).handler(
  async (): Promise<boolean> => {
    const userData = await getCurrentUserRole()
    if (!userData) return false
    return ['ADMIN', 'COORDINATOR', 'PT COORDINATOR'].includes(userData.role)
  }
)

/**
 * Check if current user is RA COORDINATOR or above
 */
export const isRACoordinator = createServerFn({ method: 'GET' }).handler(
  async (): Promise<boolean> => {
    const userData = await getCurrentUserRole()
    if (!userData) return false
    return ['ADMIN', 'COORDINATOR', 'RA COORDINATOR'].includes(userData.role)
  }
)

/**
 * Check if current user is DORMITORY COORDINATOR or above
 */
export const isDormitoryCoordinator = createServerFn({ method: 'GET' }).handler(
  async (): Promise<boolean> => {
    const userData = await getCurrentUserRole()
    if (!userData) return false
    return ['ADMIN', 'COORDINATOR', 'DORMITORY COORDINATOR'].includes(userData.role)
  }
)

// ============================================================================
// EXPORTS SUMMARY
// ============================================================================
// Types: UserRole, Permission, UserRoleData
//
// Original Server Functions:
// - getCurrentUserRole() - Get user role and permissions
// - requireRole() - Require specific role (throws error)
// - hasPermission() - Check specific permission
// - requirePermission() - Require specific permission (throws error)
// - isAdmin() - Check if ADMIN
// - isCoordinatorOrAbove() - Check if COORDINATOR or ADMIN
// - isTrainer() - Check if TRAINER
//
// New Client-Side Functions (for UI):
// - canAccessDormitoryClient() - Check dormitory access
// - canAccessEventsClient() - Check events access
// - canAccessPTClient() - Check PT access
// - canAccessReligiousClient() - Check religious access
// - canManageModuleClient() - Generic module check
// - canAccessOverviewClient() - Check overview access
//
// New Server Functions (for API):
// - canAccessDormitory() - Server: Check dormitory access
// - canAccessEvents() - Server: Check events access
// - canAccessPT() - Server: Check PT access
// - canAccessReligious() - Server: Check religious access
// - canAccessOverview() - Server: Check overview access
// - canManageModule() - Server: Generic module check
// - isEventCoordinator() - Check if EVENT COORDINATOR
// - isPTCoordinator() - Check if PT COORDINATOR
// - isRACoordinator() - Check if RA COORDINATOR
// - isDormitoryCoordinator() - Check if DORMITORY COORDINATOR
// ============================================================================