import { createFileRoute, Link } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient } from '~/utils/supabase'

// Server function to fetch ONLY safe, non-sensitive user data
const getUserProfile = createServerFn({ method: 'GET' }).handler(async () => {
  const supabase = getSupabaseServerClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    throw new Error('Not authenticated')
  }

  // Fetch ONLY non-sensitive user data
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select(`
      id,
      email,
      name,
      role,
      rank,
      region,
      status,
      created_at,
      updated_at
    `)
    .eq('email', user.email)  // Match by email instead!
    .single()

  if (userError) {
    console.error('Error fetching user data:', userError)
    throw new Error('Failed to fetch user profile')
  }

  // Check if user is a trainer
  const { data: trainerData } = await supabase
    .from('trainers')
    .select(`
      id,
      name,
      rank,
      specialization,
      status,
      created_at
    `)
    .eq('email', userData.email)
    .single()

  // Fetch activity statistics for trainers only
  let activityStats = null
  if (trainerData) {
    const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString().split('T')[0]

    const { data: religiousActivities } = await supabase
      .from('religious_activities')
      .select('id')
      .contains('participants', [trainerData.id])

    const { data: physicalTraining } = await supabase
      .from('physical_training')
      .select('id')
      .contains('participants', [trainerData.id])

    const { data: events } = await supabase
      .from('events')
      .select('id')
      .contains('trainer_ids', [trainerData.id])

    const { data: monthlyReligious } = await supabase
      .from('religious_activities')
      .select('id')
      .contains('participants', [trainerData.id])
      .gte('date', firstDayOfMonth)

    const { data: monthlyPT } = await supabase
      .from('physical_training')
      .select('id')
      .contains('participants', [trainerData.id])
      .gte('date', firstDayOfMonth)

    activityStats = {
      totalReligious: religiousActivities?.length || 0,
      totalPhysicalTraining: physicalTraining?.length || 0,
      totalEvents: events?.length || 0,
      monthlyReligious: monthlyReligious?.length || 0,
      monthlyPhysicalTraining: monthlyPT?.length || 0,
    }
  }

  return {
    user: userData,
    trainer: trainerData,
    activityStats,
  }
})

export const Route = createFileRoute('/_authed/profile/')({
  loader: async () => await getUserProfile(),
  component: ProfilePage,
})

function ProfilePage() {
  const { user, trainer, activityStats } = Route.useLoaderData()

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-orange-600 to-red-700 rounded-lg shadow-lg p-8 text-white">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30">
            <span className="text-5xl font-bold text-white">
              {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
            </span>
          </div>
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{user.name || 'User Profile'}</h1>
            <p className="text-orange-100 text-lg">{user.email}</p>
            <div className="flex items-center space-x-4 mt-3">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                user.status === 'active' 
                  ? 'bg-green-500/30 text-green-100 border border-green-300/50' 
                  : 'bg-gray-500/30 text-gray-100 border border-gray-300/50'
              }`}>
                {user.status === 'active' ? '✓ Active' : 'Inactive'}
              </span>
              {trainer && (
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-500/30 text-blue-100 border border-blue-300/50">
                  👨‍🏫 Trainer
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Personal Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Details Card - NO SENSITIVE DATA */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="text-3xl mr-3">👤</span>
              Personal Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoField label="Full Name" value={user.name || 'Not set'} />
              <InfoField label="Email Address" value={user.email} />
              <InfoField label="Role" value={user.role || 'Not set'} />
              <InfoField label="Rank" value={user.rank || 'Not set'} />
              <InfoField label="Region" value={user.region || 'Not set'} />
              <InfoField 
                label="Account Created" 
                value={new Date(user.created_at).toLocaleDateString('en-MY', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })} 
              />
              <InfoField 
                label="Last Updated" 
                value={new Date(user.updated_at).toLocaleDateString('en-MY', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })} 
              />
            </div>
          </div>

          {/* Trainer Details Card */}
          {trainer && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="text-3xl mr-3">🏅</span>
                Trainer Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoField label="Rank" value={trainer.rank || 'Not set'} />
                <InfoField label="Specialization" value={trainer.specialization || 'Not set'} />
                <InfoField label="Trainer Status" value={trainer.status || 'Not set'} />
                <InfoField 
                  label="Joined as Trainer" 
                  value={new Date(trainer.created_at).toLocaleDateString('en-MY', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })} 
                />
              </div>
            </div>
          )}

          {/* Account Security Card */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="text-3xl mr-3">🔒</span>
              Account Security
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-blue-400 transition">
                <div>
                  <h3 className="font-semibold text-gray-900">Password</h3>
                  <p className="text-sm text-gray-600">Change your password</p>
                </div>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition">
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Activity Stats */}
        <div className="space-y-6">
          {trainer && activityStats && (
            <>
              {/* Quick Stats Card */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">📊</span>
                  Activity Overview
                </h2>
                
                <div className="space-y-3">
                  <StatItem 
                    icon="📖" 
                    label="Religious Activities" 
                    count={activityStats.totalReligious}
                    color="bg-green-100 text-green-800"
                  />
                  <StatItem 
                    icon="💪" 
                    label="Physical Training" 
                    count={activityStats.totalPhysicalTraining}
                    color="bg-orange-100 text-orange-800"
                  />
                  <StatItem 
                    icon="📅" 
                    label="Events Assigned" 
                    count={activityStats.totalEvents}
                    color="bg-blue-100 text-blue-800"
                  />
                </div>
              </div>

              {/* Monthly Stats Card */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <span className="text-2xl mr-2">📅</span>
                  This Month
                </h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-white/20">
                    <span className="text-blue-100">Religious Activities</span>
                    <span className="text-2xl font-bold">{activityStats.monthlyReligious}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/20">
                    <span className="text-blue-100">PT Sessions</span>
                    <span className="text-2xl font-bold">{activityStats.monthlyPhysicalTraining}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-blue-100">Total Activities</span>
                    <span className="text-2xl font-bold">
                      {activityStats.monthlyReligious + activityStats.monthlyPhysicalTraining}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Quick Actions Card */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="text-2xl mr-2">⚡</span>
              Quick Actions
            </h2>
            
            <div className="space-y-2">
              <QuickActionButton to="/schedule" label="View Schedule" icon="📅" />
              {trainer && (
                <>
                  <QuickActionButton to="/physical-training" label="PT Sessions" icon="💪" />
                  <QuickActionButton to="/religious-activity" label="Religious Activities" icon="📖" />
                  <QuickActionButton to="/trainer-overview" label="My Activities" icon="👨‍🏫" />
                </>
              )}
              <QuickActionButton to="/logout" label="Logout" icon="🚪" color="text-red-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper Components
function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-600 mb-1">{label}</label>
      <p className="text-base font-medium text-gray-900 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
        {value}
      </p>
    </div>
  )
}

function StatItem({ icon, label, count, color }: { icon: string; label: string; count: number; color: string }) {
  return (
    <div className={`flex items-center justify-between p-3 rounded-lg ${color}`}>
      <div className="flex items-center space-x-2">
        <span className="text-xl">{icon}</span>
        <span className="font-semibold">{label}</span>
      </div>
      <span className="text-2xl font-bold">{count}</span>
    </div>
  )
}

function QuickActionButton({ to, label, icon, color = 'text-gray-700' }: { to: string; label: string; icon: string; color?: string }) {
  return (
    <Link
      to={to}
      className={`flex items-center space-x-3 p-3 rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition ${color}`}
    >
      <span className="text-xl">{icon}</span>
      <span className="font-semibold">{label}</span>
    </Link>
  )
}