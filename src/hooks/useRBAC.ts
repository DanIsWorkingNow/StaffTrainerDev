import { useEffect, useState } from 'react'
import { 
  getCurrentUserRole, 
  type UserRoleData, 
  type Permission,
  type UserRole,
  // Import client-side helper functions from rbac
  canAccessDormitoryClient,
  canAccessEventsClient,
  canAccessPTClient,
  canAccessReligiousClient,
  canAccessOverviewClient,
  canManageModuleClient,
} from '~/middleware/rbac'

// ============================================================================
// ORIGINAL HOOKS (Unchanged)
// ============================================================================

/**
 * Hook to get current user's role and permissions
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
        // Call the server function
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
 * UPDATED: Hook to check if user has required role
 * Now supports all 7 role types including specialized coordinators
 */
export function useHasRole(allowedRoles: UserRole[]): boolean {
  const { data: userData } = useCurrentUserRole()
  if (!userData) return false
  return allowedRoles.includes(userData.role)
}

// ============================================================================
// NEW: MODULE ACCESS HOOKS (for UI visibility)
// ============================================================================

/**
 * CRITICAL: Hook to check if user can access dormitory module
 * Returns true only for: ADMIN, COORDINATOR, DORMITORY COORDINATOR
 * Returns false for: EVENT, PT, RA coordinators, TRAINER
 */
export function useCanAccessDormitory(): boolean {
  const { data: userData } = useCurrentUserRole()
  if (!userData) return false
  return canAccessDormitoryClient(userData.role)
}

/**
 * Hook to check if user can access events module
 * Returns true for: ADMIN, COORDINATOR, EVENT COORDINATOR
 */
export function useCanAccessEvents(): boolean {
  const { data: userData } = useCurrentUserRole()
  if (!userData) return false
  return canAccessEventsClient(userData.role)
}

/**
 * Hook to check if user can access physical training module
 * Returns true for: ADMIN, COORDINATOR, PT COORDINATOR
 */
export function useCanAccessPT(): boolean {
  const { data: userData } = useCurrentUserRole()
  if (!userData) return false
  return canAccessPTClient(userData.role)
}

/**
 * Hook to check if user can access religious activities module
 * Returns true for: ADMIN, COORDINATOR, RA COORDINATOR
 */
export function useCanAccessReligious(): boolean {
  const { data: userData } = useCurrentUserRole()
  if (!userData) return false
  return canAccessReligiousClient(userData.role)
}

/**
 * Hook to check if user can access trainer overview
 * Returns true for: ADMIN, COORDINATOR (not specialized coordinators)
 */
export function useCanAccessOverview(): boolean {
  const { data: userData } = useCurrentUserRole()
  if (!userData) return false
  return canAccessOverviewClient(userData.role)
}

/**
 * Generic hook to check module access
 * @param module - Module name ('events', 'pt', 'religious', 'dormitory')
 */
export function useCanManageModule(module: string): boolean {
  const { data: userData } = useCurrentUserRole()
  if (!userData) return false
  return canManageModuleClient(userData.role, module)
}

// ============================================================================
// NEW: SPECIALIZED COORDINATOR CHECK HOOKS
// ============================================================================

/**
 * Hook to check if user is EVENT COORDINATOR or above
 * Returns true for: ADMIN, COORDINATOR, EVENT COORDINATOR
 */
export function useIsEventCoordinator(): boolean {
  const { data: userData } = useCurrentUserRole()
  if (!userData) return false
  return ['ADMIN', 'COORDINATOR', 'EVENT COORDINATOR'].includes(userData.role)
}

/**
 * Hook to check if user is PT COORDINATOR or above
 * Returns true for: ADMIN, COORDINATOR, PT COORDINATOR
 */
export function useIsPTCoordinator(): boolean {
  const { data: userData } = useCurrentUserRole()
  if (!userData) return false
  return ['ADMIN', 'COORDINATOR', 'PT COORDINATOR'].includes(userData.role)
}

/**
 * Hook to check if user is RA COORDINATOR or above
 * Returns true for: ADMIN, COORDINATOR, RA COORDINATOR
 */
export function useIsRACoordinator(): boolean {
  const { data: userData } = useCurrentUserRole()
  if (!userData) return false
  return ['ADMIN', 'COORDINATOR', 'RA COORDINATOR'].includes(userData.role)
}

/**
 * Hook to check if user is DORMITORY COORDINATOR or above
 * Returns true for: ADMIN, COORDINATOR, DORMITORY COORDINATOR
 */
export function useIsDormitoryCoordinator(): boolean {
  const { data: userData } = useCurrentUserRole()
  if (!userData) return false
  return ['ADMIN', 'COORDINATOR', 'DORMITORY COORDINATOR'].includes(userData.role)
}

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/*
// In a React component:

import { 
  useCurrentUserRole, 
  useCanAccessDormitory, 
  useCanAccessEvents 
} from '~/hooks/useRBAC'

function MyComponent() {
  const { data: user } = useCurrentUserRole()
  const canSeeDormitory = useCanAccessDormitory()
  const canSeeEvents = useCanAccessEvents()
  
  return (
    <nav>
      {canSeeEvents && <NavLink to="/events">Events</NavLink>}
      {canSeeDormitory && <NavLink to="/dormitory">Dormitory</NavLink>}
    </nav>
  )
}

// Conditional rendering in components:

function DormitoryButton() {
  const canAccess = useCanAccessDormitory()
  
  if (!canAccess) return null
  
  return <button>Manage Dormitory</button>
}

// Using with role checks:

function AdminPanel() {
  const isAdmin = useIsAdmin()
  const isEventCoord = useIsEventCoordinator()
  
  return (
    <div>
      {isAdmin && <AdminControls />}
      {isEventCoord && <EventManagement />}
    </div>
  )
}
*/

// ============================================================================
// EXPORTS SUMMARY
// ============================================================================
// Original Hooks (unchanged):
// - useCurrentUserRole() - Main hook for user data
// - useHasPermission() - Check specific permission
// - useIsAdmin() - Check if ADMIN
// - useIsCoordinatorOrAbove() - Check if COORDINATOR or ADMIN
// - useIsTrainer() - Check if TRAINER
// - useHasRole() - Check if has required role (UPDATED type)
//
// New Module Access Hooks:
// - useCanAccessDormitory() - CRITICAL for dormitory menu
// - useCanAccessEvents() - For events menu
// - useCanAccessPT() - For PT menu
// - useCanAccessReligious() - For religious menu
// - useCanAccessOverview() - For overview menu
// - useCanManageModule() - Generic module check
//
// New Specialized Coordinator Hooks:
// - useIsEventCoordinator() - EVENT COORDINATOR check
// - useIsPTCoordinator() - PT COORDINATOR check
// - useIsRACoordinator() - RA COORDINATOR check
// - useIsDormitoryCoordinator() - DORMITORY COORDINATOR check
// ============================================================================