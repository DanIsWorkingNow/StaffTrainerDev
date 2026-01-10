import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getCurrentUserRole, requireRole } from '~/middleware/rbac'
import { useCurrentUserRole, useIsAdmin } from '~/hooks/useRBAC'

// Test server function
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
  const isAdmin = useIsAdmin()

  if (isLoading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">RBAC Test Page</h1>

      {/* Server-side data */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
        <h2 className="font-bold mb-2">✅ Server Function Test:</h2>
        <pre className="text-sm bg-white p-3 rounded overflow-auto">
          {JSON.stringify(loaderData, null, 2)}
        </pre>
      </div>

      {/* Client-side hook data */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <h2 className="font-bold mb-2">✅ Client Hook Test:</h2>
        {userData && (
          <div className="space-y-2 text-sm">
            <p><strong>Name:</strong> {userData.name}</p>
            <p><strong>Role:</strong> {userData.role}</p>
            <p><strong>Level:</strong> {userData.roleLevel}</p>
            <p><strong>Is Admin:</strong> {isAdmin ? 'Yes' : 'No'}</p>
            <p><strong>Permissions:</strong> {userData.permissions.length}</p>
          </div>
        )}
      </div>

      {/* Permission list */}
      <div className="bg-white border rounded-lg p-4">
        <h2 className="font-bold mb-2">Permissions:</h2>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {userData?.permissions.map((p, i) => (
            <div key={i} className="bg-gray-50 p-2 rounded">
              {p.resource}: {p.action}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}