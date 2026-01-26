import { useEffect, useState } from 'react'
import { 
  getCurrentUserRole, 
  type UserRoleData, 
  type Permission,
  type UserRole,
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
export function useHasRole(allowedRoles: UserRole[]): boolean {
  const { data: userData } = useCurrentUserRole()
  if (!userData) return false
  return allowedRoles.includes(userData.role)
}

// ============================================================================
// CORRECTED: TAB ACCESS HOOKS
// Only Dormitory and Overview tabs are restricted
// All other tabs are visible to everyone (content is filtered inside pages)
// ============================================================================

/**
 * CRITICAL: Hook to check if user can ACCESS Dormitory TAB
 * Returns true only for: ADMIN, COORDINATOR, DORMITORY COORDINATOR
 * This controls TAB VISIBILITY, not content access
 */
export function useCanAccessDormitoryTab(): boolean {
  const { data: userData } = useCurrentUserRole()
  if (!userData) return false
  return ['ADMIN', 'COORDINATOR', 'DORMITORY COORDINATOR'].includes(userData.role)
}

/**
 * Hook to check if user can ACCESS Overview TAB
 * Returns true only for: ADMIN, COORDINATOR
 * Specialized coordinators cannot see Overview tab
 */
export function useCanAccessOverviewTab(): boolean {
  const { data: userData } = useCurrentUserRole()
  if (!userData) return false
  return ['ADMIN', 'COORDINATOR'].includes(userData.role)
}

// ============================================================================
// NEW: MANAGEMENT PERMISSION HOOKS
// These control who can CREATE/EDIT/DELETE in each module
// ============================================================================

/**
 * Hook to check if user can MANAGE Events module
 * Can create/edit/delete events and assign trainers
 * Returns true for: ADMIN, COORDINATOR, EVENT COORDINATOR
 */
export function useCanManageEvents(): boolean {
  const { data: userData } = useCurrentUserRole()
  if (!userData) return false
  return ['ADMIN', 'COORDINATOR', 'EVENT COORDINATOR'].includes(userData.role)
}

/**
 * Hook to check if user can MANAGE Physical Training module
 * Can create/edit/delete PT sessions and assign trainers
 * Returns true for: ADMIN, COORDINATOR, PT COORDINATOR
 */
export function useCanManagePT(): boolean {
  const { data: userData } = useCurrentUserRole()
  if (!userData) return false
  return ['ADMIN', 'COORDINATOR', 'PT COORDINATOR'].includes(userData.role)
}

/**
 * Hook to check if user can MANAGE Religious Activities module
 * Can create/edit/delete activities and assign trainers
 * Returns true for: ADMIN, COORDINATOR, RA COORDINATOR
 */
export function useCanManageReligious(): boolean {
  const { data: userData } = useCurrentUserRole()
  if (!userData) return false
  return ['ADMIN', 'COORDINATOR', 'RA COORDINATOR'].includes(userData.role)
}

/**
 * Hook to check if user can MANAGE Dormitory module
 * Can create/edit/delete dormitory assignments
 * Returns true for: ADMIN, COORDINATOR, DORMITORY COORDINATOR
 */
export function useCanManageDormitory(): boolean {
  const { data: userData } = useCurrentUserRole()
  if (!userData) return false
  return ['ADMIN', 'COORDINATOR', 'DORMITORY COORDINATOR'].includes(userData.role)
}

/**
 * Generic hook to check if user can manage a specific module
 * @param module - Module name ('events', 'pt', 'religious', 'dormitory')
 */
export function useCanManageModule(module: string): boolean {
  const { data: userData } = useCurrentUserRole()
  if (!userData) return false
  
  switch (module) {
    case 'events':
      return ['ADMIN', 'COORDINATOR', 'EVENT COORDINATOR'].includes(userData.role)
    case 'pt':
    case 'physical-training':
      return ['ADMIN', 'COORDINATOR', 'PT COORDINATOR'].includes(userData.role)
    case 'religious':
    case 'religious-activity':
      return ['ADMIN', 'COORDINATOR', 'RA COORDINATOR'].includes(userData.role)
    case 'dormitory':
      return ['ADMIN', 'COORDINATOR', 'DORMITORY COORDINATOR'].includes(userData.role)
    default:
      return false
  }
}

// ============================================================================
// SPECIALIZED COORDINATOR CHECK HOOKS
// ============================================================================

/**
 * Hook to check if user is EVENT COORDINATOR (or above)
 */
export function useIsEventCoordinator(): boolean {
  const { data: userData } = useCurrentUserRole()
  if (!userData) return false
  return ['ADMIN', 'COORDINATOR', 'EVENT COORDINATOR'].includes(userData.role)
}

/**
 * Hook to check if user is PT COORDINATOR (or above)
 */
export function useIsPTCoordinator(): boolean {
  const { data: userData } = useCurrentUserRole()
  if (!userData) return false
  return ['ADMIN', 'COORDINATOR', 'PT COORDINATOR'].includes(userData.role)
}

/**
 * Hook to check if user is RA COORDINATOR (or above)
 */
export function useIsRACoordinator(): boolean {
  const { data: userData } = useCurrentUserRole()
  if (!userData) return false
  return ['ADMIN', 'COORDINATOR', 'RA COORDINATOR'].includes(userData.role)
}

/**
 * Hook to check if user is DORMITORY COORDINATOR (or above)
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
// EXAMPLE 1: In Events Page Component
import { useCanManageEvents, useCurrentUserRole } from '~/hooks/useRBAC'

function EventsPage() {
  const { data: user } = useCurrentUserRole()
  const canManage = useCanManageEvents()  // Can create/edit/delete?
  
  // Fetch data based on role
  const { data: events } = useQuery({
    queryFn: async () => {
      if (canManage) {
        // Show ALL events
        return supabase.from('events').select('*')
      } else {
        // Show only events assigned to this user
        return supabase.from('events')
          .select('*')
          .eq('assigned_trainer_id', user.trainerId)
      }
    }
  })
  
  return (
    <div>
      <h1>Events</h1>
      
      {// Show create button only if can manage
      {canManage && (
        <button onClick={openCreateDialog}>Create Event</button>
      )}
      
      <EventsList 
        events={events} 
        canEdit={canManage}
        canDelete={canManage}
      />
    </div>
  )
}

// EXAMPLE 2: In Navigation (checking TAB visibility)
import { useCanAccessDormitoryTab } from '~/hooks/useRBAC'

function Navigation() {
  const canSeeDormitoryTab = useCanAccessDormitoryTab()
  
  return (
    <nav>
      <NavLink to="/events">Events</NavLink>  {// Visible to all
      <NavLink to="/physical-training">PT</NavLink>  {// Visible to all
      
      {// Only show Dormitory tab to authorized roles
      {canSeeDormitoryTab && (
        <NavLink to="/dormitory">Dormitory</NavLink>
      )}
    </nav>
  )
}

// EXAMPLE 3: In Event Card Component
import { useCanManageEvents } from '~/hooks/useRBAC'

function EventCard({ event }) {
  const canManage = useCanManageEvents()
  
  return (
    <div className="event-card">
      <h3>{event.title}</h3>
      <p>{event.description}</p>
      
      {// Show edit/delete buttons only if can manage
      {canManage && (
        <div className="actions">
          <button onClick={() => editEvent(event)}>Edit</button>
          <button onClick={() => deleteEvent(event)}>Delete</button>
        </div>
      )}
    </div>
  )
}
*/

// ============================================================================
// EXPORTS SUMMARY
// ============================================================================
// Original Hooks:
// - useCurrentUserRole() - Get user data
// - useHasPermission() - Check specific permission
// - useIsAdmin() - Check if ADMIN
// - useIsCoordinatorOrAbove() - Check if COORDINATOR or ADMIN
// - useIsTrainer() - Check if TRAINER
// - useHasRole() - Check if has required role
//
// Tab Access Hooks (CORRECTED - only 2 tabs restricted):
// - useCanAccessDormitoryTab() - Can see Dormitory TAB
// - useCanAccessOverviewTab() - Can see Overview TAB
//
// Management Permission Hooks (NEW - control create/edit/delete):
// - useCanManageEvents() - Can manage Events module
// - useCanManagePT() - Can manage PT module
// - useCanManageReligious() - Can manage Religious module
// - useCanManageDormitory() - Can manage Dormitory module
// - useCanManageModule() - Generic management check
//
// Coordinator Type Hooks:
// - useIsEventCoordinator() - Is EVENT COORDINATOR
// - useIsPTCoordinator() - Is PT COORDINATOR
// - useIsRACoordinator() - Is RA COORDINATOR
// - useIsDormitoryCoordinator() - Is DORMITORY COORDINATOR
// ============================================================================