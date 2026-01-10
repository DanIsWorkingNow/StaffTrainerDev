import { useQuery } from '@tanstack/react-query'
import { getCurrentUserRole, type UserRoleData } from '~/middleware/rbac'

/**
 * Hook to get current user's role and permissions
 * Use this in React components to access user role data
 */
export function useCurrentUserRole() {
  return useQuery({
    queryKey: ['currentUserRole'],
    queryFn: () => getCurrentUserRole(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook to check if user has a specific permission
 * @param resource - Resource name (e.g., 'schedules')
 * @param action - Action type ('create', 'read', 'update', 'delete')
 */
export function useHasPermission(
  resource: string,
  action: 'create' | 'read' | 'update' | 'delete'
) {
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
    (p) => p.resource === resource && p.action === action
  )
}

/**
 * Hook to check if user is ADMIN
 */
export function useIsAdmin() {
  const { data: userData } = useCurrentUserRole()
  return userData?.role === 'ADMIN' || false
}

/**
 * Hook to check if user is COORDINATOR or above
 */
export function useIsCoordinatorOrAbove() {
  const { data: userData } = useCurrentUserRole()
  if (!userData) return false
  return userData.role === 'ADMIN' || userData.role === 'COORDINATOR'
}

/**
 * Hook to check if user is TRAINER
 */
export function useIsTrainer() {
  const { data: userData } = useCurrentUserRole()
  return userData?.role === 'TRAINER' || false
}

/**
 * Hook to check if user has required role
 * @param allowedRoles - Array of allowed roles
 */
export function useHasRole(allowedRoles: Array<'ADMIN' | 'COORDINATOR' | 'TRAINER'>) {
  const { data: userData } = useCurrentUserRole()
  if (!userData) return false
  return allowedRoles.includes(userData.role)
}