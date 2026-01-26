import { useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useCurrentUserRole } from '~/hooks/useRBAC'
import { type UserRole } from '~/middleware/rbac'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles: UserRole[]
  fallbackPath?: string
}

/**
 * Component to protect routes based on user role
 */
export function ProtectedRoute({
  children,
  allowedRoles,
  fallbackPath = '/auth/login',
}: ProtectedRouteProps) {
  const { data: userData, isLoading } = useCurrentUserRole()
  const navigate = useNavigate()

  useEffect(() => {
    // Wait for data to load
    if (isLoading) return

    // Not authenticated - redirect to login
    if (!userData) {
      navigate({ to: fallbackPath as any })
      return
    }

    // Check if user has required role
    if (!allowedRoles.includes(userData.role)) {
      // Redirect based on user role
      if (userData.role === 'TRAINER') {
        navigate({ to: '/schedule' as any })
      } else {
        navigate({ to: '/overview' as any })
      }
    }
  }, [userData, isLoading, allowedRoles, navigate, fallbackPath])

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Not authenticated
  if (!userData) {
    return null
  }

  // Not authorized
  if (!allowedRoles.includes(userData.role)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center bg-red-50 border border-red-200 rounded-lg p-8 max-w-md">
          <div className="text-red-600 text-5xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            You don't have permission to access this page.
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Required role: {allowedRoles.join(' or ')}
          </p>
          <button
            onClick={() => navigate({ to: '/overview' as any })}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  // Authorized - render children
  return <>{children}</>
}

/**
 * Convenience component for ADMIN-only routes
 */
export function AdminOnly({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute allowedRoles={['ADMIN']}>{children}</ProtectedRoute>
}

/**
 * Convenience component for COORDINATOR and ADMIN routes
 */
export function CoordinatorOrAbove({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['ADMIN', 'COORDINATOR']}>
      {children}
    </ProtectedRoute>
  )
}

/**
 * Convenience component for all authenticated users
 */
export function AuthenticatedOnly({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['ADMIN', 'COORDINATOR', 'TRAINER']}>
      {children}
    </ProtectedRoute>
  )
}