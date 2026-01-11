import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient } from '~/utils/supabase'
import { useState } from 'react'

// Server function to get all trainer overview data
const getTrainerOverviewData = createServerFn({ method: 'GET' })
  .inputValidator((data: { trainerId?: number; month: number; year: number }) => data)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()

    // Get all trainers with role info
    const { data: trainers } = await supabase
      .from('trainers')
      .select('*, roles (id, name, level)')
      .eq('status', 'active')
      .order('name')

    // Get all roles for the dropdown
    const { data: roles } = await supabase
      .from('roles')
      .select('*')
      .order('level', { ascending: true })

    // Get religious activities for the month
    const startDate = `${data.year}-${String(data.month + 1).padStart(2, '0')}-01`
    const endDate = new Date(data.year, data.month + 1, 0)
    const endDateStr = `${data.year}-${String(data.month + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`

    const { data: religiousActivities } = await supabase
      .from('religious_activities')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDateStr)

    // Get physical training for the month
    const { data: physicalTraining } = await supabase
      .from('physical_training')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDateStr)

    // Get events for the month
    const { data: events } = await supabase
      .from('events')
      .select('*')
      .or(`start_date.lte.${endDateStr},end_date.gte.${startDate}`)

    // Get schedules for the trainer if selected
    let schedules = []
    if (data.trainerId) {
      const { data: trainerSchedules } = await supabase
        .from('schedules')
        .select('*')
        .eq('trainer_id', data.trainerId)
        .gte('date', startDate)
        .lte('date', endDateStr)
      schedules = trainerSchedules || []
    }

    return {
      trainers: trainers || [],
      roles: roles || [],
      religiousActivities: religiousActivities || [],
      physicalTraining: physicalTraining || [],
      events: events || [],
      schedules: schedules || []
    }
  })

// Server function to create a new trainer
const createTrainer = createServerFn({ method: 'POST' })
  .inputValidator((data: {
    name: string
    rank: string
    role_id: string
    status: string
    email?: string
    password?: string
  }) => data)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()
    const { getSupabaseAdminClient } = await import('~/utils/supabase')
    let userId = null
    let warning = null

    // Try to create auth user if email/password provided
    if (data.email && data.password && data.email.trim() !== '') {
      const supabaseAdmin = getSupabaseAdminClient()
      if (supabaseAdmin) {
        const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
          email: data.email,
          password: data.password,
          email_confirm: true
        })

        if (userError) {
          return { error: `User creation failed: ${userError.message}` }
        }
        userId = userData.user?.id
      } else {
        warning = 'Trainer created without login access (Missing Server Key)'
      }
    }

    const { data: newTrainer, error } = await supabase
      .from('trainers')
      .insert([{
        name: data.name,
        rank: data.rank,
        role_id: data.role_id,
        status: data.status,
        ...(userId ? { user_id: userId } : {})
      }])
      .select()
      .single()

    if (error) {
      return { error: error.message }
    }

    return { success: true, trainer: newTrainer, warning }
  })

export const Route = createFileRoute('/_authed/trainer-overview/')({
  beforeLoad: ({ context }) => {
    // Check if user exists and has TRAINER role
    if (context.user?.role === 'TRAINER') {
      throw new Error('Unauthorized Access: Trainers cannot access overview')
    }
  },
  loader: async () => {
    const now = new Date()
    return await getTrainerOverviewData({
      data: {
        month: now.getMonth(),
        year: now.getFullYear()
      }
    })
  },
  component: TrainerOverviewPage,
})

function TrainerOverviewPage() {
  const initialData = Route.useLoaderData()
  const { user } = Route.useRouteContext()
  const [trainers, setTrainers] = useState(initialData.trainers)
  const [roles] = useState(initialData.roles || [])
  const [selectedTrainer, setSelectedTrainer] = useState<number | null>(null)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [viewMode, setViewMode] = useState<'directory' | 'dashboard'>('directory')
  const [showAddModal, setShowAddModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // State for fetched data
  const [religiousActivities, setReligiousActivities] = useState(initialData.religiousActivities)
  const [physicalTraining, setPhysicalTraining] = useState(initialData.physicalTraining)
  const [events, setEvents] = useState(initialData.events)
  const [schedules, setSchedules] = useState(initialData.schedules)

  // Reload data when trainer or month changes
  const reloadData = async (trainerId: number | null, month: number, year: number) => {
    const data = await getTrainerOverviewData({
      data: { trainerId: trainerId || undefined, month, year }
    })
    setTrainers(data.trainers) // Update trainers list in case status changed
    setReligiousActivities(data.religiousActivities)
    setPhysicalTraining(data.physicalTraining)
    setEvents(data.events)
    setSchedules(data.schedules)
  }

  // Handle trainer selection
  const handleTrainerChange = async (trainerId: string) => {
    const id = trainerId ? parseInt(trainerId) : null
    setSelectedTrainer(id)
    setSelectedDate(null)
    if (id) {
      setViewMode('dashboard')
      await reloadData(id, currentDate.getMonth(), currentDate.getFullYear())
    }
  }

  const handleViewTrainer = async (trainerId: number) => {
    setSelectedTrainer(trainerId)
    setViewMode('dashboard')
    await reloadData(trainerId, currentDate.getMonth(), currentDate.getFullYear())
  }

  // Handle month change
  const handleMonthChange = async (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (direction === 'prev') {
      newDate.setMonth(currentDate.getMonth() - 1)
    } else {
      newDate.setMonth(currentDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
    setSelectedDate(null)
    if (selectedTrainer) {
      await reloadData(selectedTrainer, newDate.getMonth(), newDate.getFullYear())
    }
  }

  // Get selected trainer object
  const trainer = trainers.find(t => t.id === selectedTrainer)

  // Calculate monthly summary
  const getMonthlySummary = () => {
    if (!selectedTrainer) {
      return { religious: 0, events: 0, physical: 0, leadership: 0 }
    }

    // Count religious activities
    const religious = religiousActivities.filter((activity: any) =>
      activity.in_charge === trainer?.name ||
      activity.participants.includes(selectedTrainer)
    ).length

    // Count events (check if trainer has schedule during event period)
    const eventCount = events.filter((event: any) => {
      const eventStart = new Date(event.start_date)
      const eventEnd = new Date(event.end_date)
      // Check if trainer has any schedule entries during this event
      return schedules.some((schedule: any) => {
        const scheduleDate = new Date(schedule.date)
        return scheduleDate >= eventStart && scheduleDate <= eventEnd
      })
    }).length

    // Count physical training
    const physical = physicalTraining.filter((training: any) =>
      training.in_charge === trainer?.name ||
      training.participants.includes(selectedTrainer)
    ).length

    // Count leadership roles (where trainer is in_charge)
    const leadership =
      religiousActivities.filter((a: any) => a.in_charge === trainer?.name).length +
      physicalTraining.filter((t: any) => t.in_charge === trainer?.name).length

    return { religious, events: eventCount, physical, leadership }
  }

  // Get activities for a specific date
  const getActivitiesForDate = (day: number) => {
    if (!selectedTrainer) return []

    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const activities: any[] = []

    // Check religious activities
    religiousActivities.forEach((activity: any) => {
      if (activity.date === dateStr) {
        if (activity.in_charge === trainer?.name) {
          activities.push({
            type: 'Religious Activity',
            time: 'Morning',
            activity: activity.activity,
            role: 'Leader/Imam',
            color: '#22c55e'
          })
        } else if (activity.participants.includes(selectedTrainer)) {
          activities.push({
            type: 'Religious Activity',
            time: 'Morning',
            activity: activity.activity,
            role: 'Participant',
            color: '#86efac'
          })
        }
      }
    })

    // Check events
    events.forEach((event: any) => {
      const eventStart = new Date(event.start_date)
      const eventEnd = new Date(event.end_date)
      const checkDate = new Date(dateStr)

      if (checkDate >= eventStart && checkDate <= eventEnd) {
        activities.push({
          type: 'Event',
          time: 'Full Day',
          activity: event.name,
          role: 'Participant',
          color: event.color || '#3b82f6'
        })
      }
    })

    // Check physical training
    physicalTraining.forEach((training: any) => {
      if (training.date === dateStr) {
        if (training.in_charge === trainer?.name) {
          activities.push({
            type: 'Physical Training',
            time: training.time_slot || '5:00 PM - 7:00 PM',
            activity: training.training_type,
            role: 'In Charge',
            color: '#f97316'
          })
        } else if (training.participants.includes(selectedTrainer)) {
          activities.push({
            type: 'Physical Training',
            time: training.time_slot || '5:00 PM - 7:00 PM',
            activity: training.training_type,
            role: 'Participant',
            color: '#fdba74'
          })
        }
      }
    })

    return activities
  }

  // Get days in current month
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startDay = firstDay.getDay()

    const days = []

    for (let i = 0; i < startDay; i++) {
      days.push(null)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  const summary = getMonthlySummary()

  const filteredTrainers = trainers.filter((t: any) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.rank.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.roles?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Trainer Overview & Management</h1>
          <p className="text-gray-600">Monitor trainer activities and manage staff</p>
        </div>

        {/* View Toggle */}
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setViewMode('directory')}
            className={`px-4 py-2 rounded-md font-medium transition ${viewMode === 'directory' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-900'
              }`}
          >
            Directory
          </button>
          <button
            onClick={() => setViewMode('dashboard')}
            className={`px-4 py-2 rounded-md font-medium transition ${viewMode === 'dashboard' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-900'
              }`}
          >
            Dashboard
          </button>
        </div>
      </div>

      {viewMode === 'directory' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-800">Trainer Directory</h2>
            <div className="flex items-center space-x-3 w-full md:w-auto">
              <input
                type="text"
                placeholder="Search by name, rank, or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 w-full md:w-64"
              />
              {['ADMIN', 'COORDINATOR'].includes(user?.role || '') && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 whitespace-nowrap"
                >
                  <span>+ Add New</span>
                </button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trainer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTrainers.map((t: any) => (
                  <tr key={t.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                          {t.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{t.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{t.rank}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                          ${t.roles?.name === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                          t.roles?.name === 'COORDINATOR' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                        {t.roles?.name || 'TRAINER'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${t.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleViewTrainer(t.id)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View Schedule
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {viewMode === 'dashboard' && (
        <>
          {/* Control Panel */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Trainer Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Selected Trainer
                </label>
                <select
                  value={selectedTrainer || ''}
                  onChange={(e) => handleTrainerChange(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a Trainer</option>
                  {trainers.map((t: any) => (
                    <option key={t.id} value={t.id}>
                      {t.rank} {t.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Month/Year Navigation */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Month & Year
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleMonthChange('prev')}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
                  >
                    ◀
                  </button>
                  <div className="flex-1 text-center font-semibold text-lg">
                    {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </div>
                  <button
                    onClick={() => handleMonthChange('next')}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
                  >
                    ▶
                  </button>
                </div>
              </div>
            </div>
          </div>

          {selectedTrainer && trainer ? (
            <>
              {/* Monthly Summary */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                  Monthly Summary for {trainer.rank} {trainer.name}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <SummaryCard
                    title="Religious Activities"
                    value={summary.religious}
                    icon="🕌"
                    color="bg-teal-500"
                  />
                  <SummaryCard
                    title="Event Details"
                    value={summary.events}
                    icon="📅"
                    color="bg-blue-500"
                  />
                  <SummaryCard
                    title="Physical Training"
                    value={summary.physical}
                    icon="💪"
                    color="bg-orange-500"
                  />
                  <SummaryCard
                    title="Leadership Roles"
                    value={summary.leadership}
                    icon="⭐"
                    color="bg-yellow-500"
                  />
                </div>
              </div>

              {/* Calendar View */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Calendar</h3>

                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
                    <div
                      key={day}
                      className={`text-center font-semibold py-2 ${idx === 5 ? 'text-teal-700' : 'text-gray-700'
                        }`}
                    >
                      {day}
                      {idx === 5 && <span className="ml-1">🕌</span>}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2">
                  {getDaysInMonth().map((day, idx) => {
                    if (!day) {
                      return <div key={`empty-${idx}`} className="aspect-square" />
                    }

                    const dayActivities = getActivitiesForDate(day)
                    const isToday =
                      day === new Date().getDate() &&
                      currentDate.getMonth() === new Date().getMonth() &&
                      currentDate.getFullYear() === new Date().getFullYear()

                    const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
                    const isFriday = dateObj.getDay() === 5
                    const isSelectedDate = selectedDate?.getDate() === day &&
                      selectedDate?.getMonth() === currentDate.getMonth() &&
                      selectedDate?.getFullYear() === currentDate.getFullYear()

                    return (
                      <div
                        key={day}
                        onClick={() => {
                          const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
                          setSelectedDate(date)
                        }}
                        className={`
                            aspect-square border-2 rounded-lg p-2 cursor-pointer transition-all
                            hover:shadow-lg hover:scale-105
                            ${isToday ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-300' :
                            isFriday ? 'border-teal-400 bg-teal-50' :
                              isSelectedDate ? 'border-purple-600 bg-purple-50' :
                                'border-gray-200 bg-white'}
                            `}
                      >
                        <div className={`font-semibold mb-1 text-sm ${isToday ? 'text-blue-700' :
                          isFriday ? 'text-teal-700' :
                            isSelectedDate ? 'text-purple-700' :
                              'text-gray-900'
                          }`}>
                          {day}
                        </div>

                        <div className="space-y-1">
                          {dayActivities.slice(0, 2).map((activity: any, idx: number) => (
                            <div
                              key={idx}
                              className="text-xs px-1 py-0.5 rounded truncate"
                              style={{ backgroundColor: activity.color + '20', color: activity.color }}
                              title={`${activity.activity} (${activity.role})`}
                            >
                              {activity.type === 'Religious Activity' ? '🕌' :
                                activity.type === 'Physical Training' ? '💪' : '📅'}
                            </div>
                          ))}
                          {dayActivities.length > 2 && (
                            <div className="text-xs text-gray-600 font-medium">
                              +{dayActivities.length - 2}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Legend */}
                <div className="mt-6 pt-4 border-t">
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 border-2 border-blue-600 bg-blue-50 rounded"></div>
                      <span>Today</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 border-2 border-purple-600 bg-purple-50 rounded"></div>
                      <span>Selected</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 border-2 border-teal-400 bg-teal-50 rounded"></div>
                      <span>Friday 🕌</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Daily Schedule Details */}
              {selectedDate && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Daily Schedule for {trainer.rank} {trainer.name} - {' '}
                    {selectedDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </h3>

                  {(() => {
                    const activities = getActivitiesForDate(selectedDate.getDate())

                    if (activities.length === 0) {
                      return (
                        <div className="text-center py-8 text-gray-500">
                          <p className="text-lg">No activities scheduled for this day</p>
                          <p className="text-sm mt-2">This trainer is free on this date</p>
                        </div>
                      )
                    }

                    return (
                      <div className="space-y-3">
                        {activities.map((activity: any, idx: number) => (
                          <div
                            key={idx}
                            className="border-l-4 p-4 rounded-r-lg"
                            style={{
                              borderLeftColor: activity.color,
                              backgroundColor: activity.color + '10'
                            }}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-2xl">
                                    {activity.type === 'Religious Activity' ? '🕌' :
                                      activity.type === 'Physical Training' ? '💪' : '📅'}
                                  </span>
                                  <h4 className="font-semibold text-gray-900 text-lg">
                                    {activity.activity}
                                  </h4>
                                </div>
                                <div className="space-y-1 text-sm text-gray-700">
                                  <p><strong>Type:</strong> {activity.type}</p>
                                  <p><strong>Time:</strong> {activity.time}</p>
                                  <p><strong>Role:</strong> {activity.role}</p>
                                </div>
                              </div>
                              <div
                                className="text-xs px-3 py-1 rounded-full text-white font-semibold"
                                style={{ backgroundColor: activity.color }}
                              >
                                {activity.role}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  })()}

                  {/* Daily Summary */}
                  <div className="mt-6 pt-4 border-t">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">
                          {getActivitiesForDate(selectedDate.getDate()).length}
                        </div>
                        <div className="text-sm text-gray-600">Total Activities</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">
                          {getActivitiesForDate(selectedDate.getDate()).filter(a => a.role.includes('In Charge') || a.role.includes('Leader')).length}
                        </div>
                        <div className="text-sm text-gray-600">Leadership Roles</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">
                          {getActivitiesForDate(selectedDate.getDate()).filter(a => a.role === 'Participant').length}
                        </div>
                        <div className="text-sm text-gray-600">Participations</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <div className="text-6xl mb-4">👥</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                Select a Trainer
              </h3>
              <p className="text-gray-600">
                Choose a trainer from the dropdown above to view their activity overview and schedule
              </p>
            </div>
          )}
        </>
      )}

      {/* Add Trainer Modal */}
      {showAddModal && (
        <AddTrainerModal
          roles={roles}
          onClose={() => setShowAddModal(false)}
          onSubmit={createTrainer}
        />
      )}
    </div>
  )
}

function AddTrainerModal({
  roles,
  onClose,
  onSubmit
}: {
  roles: any[]
  onClose: () => void
  onSubmit: any
}) {
  const [formData, setFormData] = useState({
    name: '',
    rank: '',
    email: '',
    password: '',
    role_id: roles.find(r => r.name === 'TRAINER')?.id || '',
    status: 'active'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const result = await onSubmit({ data: formData })

      if (result.error) {
        setError(result.error)
      } else {
        if (result.warning) {
          alert(result.warning)
        }
        window.location.reload()
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create trainer')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">Add New Trainer</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">×</button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Ahmad Tarmizi"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rank</label>
            <input
              type="text"
              required
              value={formData.rank}
              onChange={e => setFormData({ ...formData, rank: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. KB41"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-gray-400 font-normal">(Optional)</span></label>
            <input
              type="email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="For login access"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password <span className="text-gray-400 font-normal">(Optional)</span></label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 pr-10"
                placeholder="Min. 6 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <span className="text-xl">👁️</span>
                ) : (
                  <span className="text-xl">🔒</span>
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={formData.role_id}
              onChange={e => setFormData({ ...formData, role_id: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Role</option>
              {roles.map((role: any) => (
                <option key={role.id} value={role.id}>{role.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="active">Active</option>
              <option value="lead">Lead</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Trainer'}
            </button>
          </div>
        </form>

        <p className="mt-4 text-xs text-gray-500 text-center">
          Email and Password are required to create a login capability for the trainer.
          Requires server configuration.
        </p>
      </div>
    </div>
  )
}

// Summary Card Component
function SummaryCard({
  title,
  value,
  icon,
  color
}: {
  title: string
  value: number
  icon: string
  color: string
}) {
  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:shadow-lg transition">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`${color} text-white p-3 rounded-lg text-2xl`}>
          {icon}
        </div>
      </div>
    </div>
  )
}