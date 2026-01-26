import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getCurrentUserRole } from '~/middleware/rbac'
import { 
  useCurrentUserRole, 
  useIsAdmin,
  useCanAccessDormitory,
  useCanAccessEvents,
  useCanAccessPT,
  useCanAccessReligious,
  useCanAccessOverview,
  useIsEventCoordinator,
  useIsPTCoordinator,
  useIsRACoordinator,
  useIsDormitoryCoordinator,
} from '~/hooks/useRBAC'

// Test server function (unchanged)
const testRBAC = createServerFn({ method: 'GET' }).handler(async () => {
  const userData = await getCurrentUserRole()
  
  if (!userData) {
    return { error: 'Not authenticated' }
  }

  return {
    success: true,
    user: userData
  }
})

export const Route = createFileRoute('/_authed/test-rbac')({
  loader: async () => await testRBAC(),
  component: TestRBACPage,
})

function TestRBACPage() {
  const loaderData = Route.useLoaderData()
  const { data: userData, isLoading } = useCurrentUserRole()
  
  // Original hooks
  const isAdmin = useIsAdmin()
  
  // NEW: Module access hooks
  const canAccessDormitory = useCanAccessDormitory()
  const canAccessEvents = useCanAccessEvents()
  const canAccessPT = useCanAccessPT()
  const canAccessReligious = useCanAccessReligious()
  const canAccessOverview = useCanAccessOverview()
  
  // NEW: Specialized coordinator hooks
  const isEventCoord = useIsEventCoordinator()
  const isPTCoord = useIsPTCoordinator()
  const isRACoord = useIsRACoordinator()
  const isDormCoord = useIsDormitoryCoordinator()

  if (isLoading) {
    return <div className="p-6">Loading...</div>
  }

  // Helper function for access indicator
  const AccessIndicator = ({ allowed, label }: { allowed: boolean; label: string }) => (
    <div className={`flex items-center space-x-2 p-2 rounded ${
      allowed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    }`}>
      <span className="text-xl">{allowed ? '✅' : '❌'}</span>
      <span className="font-medium">{label}</span>
    </div>
  )

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-2">🧪 RBAC Test Page</h1>
        <p className="text-gray-600">Testing Role-Based Access Control for Specialized Coordinators</p>
      </div>

      {/* User Role Badge */}
      {userData && (
        <div className="bg-gradient-to-r from-orange-600 to-red-700 text-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1">{userData.name}</h2>
              <p className="text-orange-100">{userData.email}</p>
            </div>
            <div className={`px-6 py-3 rounded-lg font-bold text-lg ${
              userData.role === 'ADMIN' ? 'bg-red-900' :
              userData.role === 'COORDINATOR' ? 'bg-blue-600' :
              userData.role === 'EVENT COORDINATOR' ? 'bg-orange-500' :
              userData.role === 'PT COORDINATOR' ? 'bg-green-600' :
              userData.role === 'RA COORDINATOR' ? 'bg-teal-600' :
              userData.role === 'DORMITORY COORDINATOR' ? 'bg-blue-700' :
              'bg-gray-600'
            }`}>
              {userData.role}
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
            <div className="bg-white/10 rounded p-3">
              <p className="text-orange-200">Level</p>
              <p className="text-xl font-bold">{userData.roleLevel}</p>
            </div>
            <div className="bg-white/10 rounded p-3">
              <p className="text-orange-200">Permissions</p>
              <p className="text-xl font-bold">{userData.permissions.length}</p>
            </div>
            <div className="bg-white/10 rounded p-3">
              <p className="text-orange-200">Rank</p>
              <p className="text-xl font-bold">{userData.rank || 'N/A'}</p>
            </div>
          </div>
        </div>
      )}

      {/* NEW: Module Access Test */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">🔐 Module Access Test</h2>
        <div className="grid grid-cols-2 gap-3">
          <AccessIndicator allowed={canAccessEvents} label="Events Module" />
          <AccessIndicator allowed={canAccessPT} label="Physical Training Module" />
          <AccessIndicator allowed={canAccessReligious} label="Religious Activities Module" />
          <AccessIndicator allowed={canAccessDormitory} label="Dormitory Module (CRITICAL)" />
          <AccessIndicator allowed={canAccessOverview} label="Trainer Overview" />
        </div>
        
        {/* CRITICAL: Dormitory Access Warning */}
        {!canAccessDormitory && userData?.role !== 'TRAINER' && (
          <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-500 p-4">
            <div className="flex items-start">
              <span className="text-2xl mr-3">⚠️</span>
              <div>
                <p className="font-bold text-yellow-800">Dormitory Access Restricted</p>
                <p className="text-sm text-yellow-700">
                  As a <strong>{userData?.role}</strong>, you do not have access to the Dormitory module.
                  Only ADMIN, COORDINATOR, and DORMITORY COORDINATOR can access this module.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {canAccessDormitory && userData?.role === 'DORMITORY COORDINATOR' && (
          <div className="mt-4 bg-green-50 border-l-4 border-green-500 p-4">
            <div className="flex items-start">
              <span className="text-2xl mr-3">✅</span>
              <div>
                <p className="font-bold text-green-800">Dormitory Access Granted</p>
                <p className="text-sm text-green-700">
                  As a DORMITORY COORDINATOR, you have full access to manage dormitory assignments.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* NEW: Coordinator Type Test */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">👤 Coordinator Type Check</h2>
        <div className="grid grid-cols-2 gap-3">
          <AccessIndicator allowed={isAdmin} label="Is Admin" />
          <AccessIndicator allowed={isEventCoord} label="Is Event Coordinator" />
          <AccessIndicator allowed={isPTCoord} label="Is PT Coordinator" />
          <AccessIndicator allowed={isRACoord} label="Is RA Coordinator" />
          <AccessIndicator allowed={isDormCoord} label="Is Dormitory Coordinator" />
        </div>
      </div>

      {/* Server-side data (original) */}
      <div className="bg-green-50 border border-green-200 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">✅ Server Function Test</h2>
        <pre className="text-xs bg-white p-4 rounded overflow-auto max-h-64">
          {JSON.stringify(loaderData, null, 2)}
        </pre>
      </div>

      {/* Permission list (enhanced) */}
      <div className="bg-white border rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">🔑 Permissions Detail</h2>
        {userData?.permissions && userData.permissions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {userData.permissions.map((p, i) => (
              <div key={i} className="bg-gradient-to-r from-gray-50 to-gray-100 p-3 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">{p.resource}</span>
                  <span className={`px-2 py-1 text-xs font-bold rounded ${
                    p.action === 'create' ? 'bg-green-100 text-green-800' :
                    p.action === 'read' ? 'bg-blue-100 text-blue-800' :
                    p.action === 'update' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {p.action.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No permissions assigned</p>
        )}
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">📊 Access Summary</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="font-medium">Total Modules Available:</span>
            <span className="font-bold">{
              [canAccessEvents, canAccessPT, canAccessReligious, canAccessDormitory, canAccessOverview]
                .filter(Boolean).length
            } / 5</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Role Level:</span>
            <span className="font-bold">{userData?.roleLevel}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Total Permissions:</span>
            <span className="font-bold">{userData?.permissions.length}</span>
          </div>
        </div>
      </div>
    </div>
  )
}