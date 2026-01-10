import { useEffect, useState } from 'react'
import { getCurrentUserRole, type UserRoleData, type Permission } from '~/middleware/rbac'

/**
 * Hook to get current user's role and permissions
 * Uses useState and useEffect instead of react-query
 */
export function useCurrentUserRole() {
  const [data, setData] = useState<UserRoleData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let mounted = true

    const fetchUserRole = async () => {
      try {
        setIsLoading(true)
        const result = await getCurrentUserRole()
        if (mounted) {
          setData(result)
          setError(null)
        }
      } catch (err) {
        if (mounted) {
          setError(err as Error)
        }
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    fetchUserRole()

    return () => {
      mounted = false
    }
  }, [])

  return { data, isLoading, error }
}

/**
 * Hook to check if user has a specific permission
 */
export function useHasPermission(
  resource: string,
  action: 'create' | 'read' | 'update' | 'delete'
): boolean {
  const { data: userData } = useCurrentUserRole()

  if (!userData) {
    return false
  }

  // ADMIN has all permissions
  if (userData.role === 'ADMIN') {
    return true
  }

  // Check specific permission
  return userData.permissions.some(
    (p: Permission) => p.resource === resource && p.action === action
  )
}

/**
 * Hook to check if user is ADMIN
 */
export function useIsAdmin(): boolean {
  const { data: userData } = useCurrentUserRole()
  return userData?.role === 'ADMIN' || false
}

/**
 * Hook to check if user is COORDINATOR or above
 */
export function useIsCoordinatorOrAbove(): boolean {
  const { data: userData } = useCurrentUserRole()
  if (!userData) return false
  return userData.role === 'ADMIN' || userData.role === 'COORDINATOR'
}

/**
 * Hook to check if user is TRAINER
 */
export function useIsTrainer(): boolean {
  const { data: userData } = useCurrentUserRole()
  return userData?.role === 'TRAINER' || false
}

/**
 * Hook to check if user has required role
 */
export function useHasRole(allowedRoles: Array<'ADMIN' | 'COORDINATOR' | 'TRAINER'>): boolean {
  const { data: userData } = useCurrentUserRole()
  if (!userData) return false
  return allowedRoles.includes(userData.role)
}