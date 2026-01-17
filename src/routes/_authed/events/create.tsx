import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient } from '~/utils/supabase'
import { useState } from 'react'

// Server function to fetch trainers
const getTrainers = createServerFn({ method: 'GET' }).handler(async () => {
  const supabase = getSupabaseServerClient()

  const { data: trainers } = await supabase
    .from('trainers')
    .select('*')
    .eq('status', 'active')
    .order('name', { ascending: true })

  return { trainers: trainers || [] }
})

// Server function to create event with trainer assignments
const createEventWithTrainers = createServerFn({ method: 'POST' })
  .inputValidator((data: {
    name: string
    category: string
    start_date: string
    end_date: string
    description?: string
    color: string
    trainer_ids: number[]
  }) => data)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()

    // Create the event
    const { data: event, error: eventError } = await supabase
      .from('events')
      .insert([{
        name: data.name,
        category: data.category,
        start_date: data.start_date,
        end_date: data.end_date,
        description: data.description,
        color: data.color
      }])
      .select()
      .single()

    if (eventError) {
      return { error: eventError.message }
    }

    // Create schedule entries for each selected trainer for each day of the event
    if (data.trainer_ids.length > 0) {
      const scheduleEntries = []
      const start = new Date(data.start_date)
      const end = new Date(data.end_date)

      // Calculate number of days
      const diffTime = Math.abs(end.getTime() - start.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      // Loop through each day
      for (let i = 0; i <= diffDays; i++) {
        const currentDate = new Date(start)
        currentDate.setDate(start.getDate() + i)

        // Strict YYYY-MM-DD formatting using local components since input is YYYY-MM-DD
        const year = currentDate.getFullYear()
        const month = String(currentDate.getMonth() + 1).padStart(2, '0')
        const day = String(currentDate.getDate()).padStart(2, '0')
        const dateStr = `${year}-${month}-${day}` // Consistent with input

        // Double check we haven't gone past end date (safety)
        if (dateStr > data.end_date) break;

        // Create schedule entry for each trainer
        for (const trainerId of data.trainer_ids) {
          scheduleEntries.push({
            trainer_id: trainerId,
            date: dateStr,
            status: 'scheduled',
            availability: [],
            notes: `Assigned to: ${data.name}`
          })
        }
      }

      // Use Admin Client if available to bypass RLS, otherwise standard client
      // Try to import dynamically to avoid top-level issues if any
      const { getSupabaseAdminClient } = await import('~/utils/supabase')
      const adminClient = getSupabaseAdminClient()
      const clientToUse = adminClient || supabase

      // Insert all schedule entries
      const { error: scheduleError } = await clientToUse
        .from('schedules')
        .insert(scheduleEntries)

      if (scheduleError) {
        console.error('Error creating schedules:', scheduleError)
        // If admin client failed (or wasn't avail), we try standard client just in case
        if (adminClient && scheduleError) {
          console.log('Retrying with standard client...')
          const { error: retryError } = await supabase
            .from('schedules')
            .insert(scheduleEntries)
          if (retryError) console.error('Retry failed:', retryError)
        }
      }
    }

    return { success: true, event }
  })

const EVENT_CATEGORIES = [
  { name: 'Physical Training', color: '#3b82f6' },
  { name: 'Safety Training', color: '#8b5cf6' },
  { name: 'Emergency Response', color: '#ef4444' },
  { name: 'Equipment Inspection', color: '#f59e0b' },
  { name: 'Leadership Training', color: '#eab308' },
  { name: 'Team Building', color: '#10b981' },
  { name: 'Religious Activity', color: '#14b8a6' },
  { name: 'Community Service', color: '#06b6d4' },
  { name: 'Routine Maintenance', color: '#92400e' },
  { name: 'Special Event', color: '#ec4899' },
  { name: 'Development Program', color: '#6366f1' },
  { name: 'Collaboration Activity', color: '#a855f7' },
]

// Available color palette
const COLOR_PALETTE = [
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Orange', value: '#f59e0b' },
  { name: 'Yellow', value: '#eab308' },
  { name: 'Green', value: '#10b981' },
  { name: 'Teal', value: '#14b8a6' },
  { name: 'Cyan', value: '#06b6d4' },
  { name: 'Brown', value: '#92400e' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Violet', value: '#a855f7' },
  { name: 'Emerald', value: '#059669' },
  { name: 'Lime', value: '#84cc16' },
  { name: 'Rose', value: '#f43f5e' },
  { name: 'Sky', value: '#0ea5e9' },
]

export const Route = createFileRoute('/_authed/events/create')({
  beforeLoad: ({ context }) => {
    // Check if user exists and has TRAINER role
    if (context.user?.role === 'TRAINER') {
      throw new Error('Unauthorized Access: Trainers cannot create events')
    }
  },
  loader: async () => await getTrainers(),
  component: CreateEventPage,
})

function CreateEventPage() {
  const navigate = useNavigate()
  const { trainers } = Route.useLoaderData()

  const [formData, setFormData] = useState({
    name: '',
    category: EVENT_CATEGORIES[0].name,
    start_date: '',
    end_date: '',
    description: '',
    color: EVENT_CATEGORIES[0].color,
    trainer_ids: [] as number[],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Handle category change and update color
  const handleCategoryChange = (category: string) => {
    const selectedCategory = EVENT_CATEGORIES.find(c => c.name === category)
    setFormData({
      ...formData,
      category,
      color: selectedCategory?.color || EVENT_CATEGORIES[0].color
    })
  }

  // Handle color selection
  const handleColorSelect = (color: string) => {
    setFormData({
      ...formData,
      color
    })
  }

  // Handle trainer selection
  const handleTrainerToggle = (trainerId: number) => {
    setFormData(prev => ({
      ...prev,
      trainer_ids: prev.trainer_ids.includes(trainerId)
        ? prev.trainer_ids.filter(id => id !== trainerId)
        : [...prev.trainer_ids, trainerId]
    }))
  }

  // Select all trainers
  const handleSelectAll = () => {
    setFormData(prev => ({
      ...prev,
      trainer_ids: trainers.map((t: any) => t.id)
    }))
  }

  // Deselect all trainers
  const handleDeselectAll = () => {
    setFormData(prev => ({
      ...prev,
      trainer_ids: []
    }))
  }

  // Get selected trainers details
  const getSelectedTrainers = () => {
    return trainers.filter((t: any) => formData.trainer_ids.includes(t.id))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      // Validate dates
      if (new Date(formData.end_date) < new Date(formData.start_date)) {
        setError('End date must be after start date')
        setIsSubmitting(false)
        return
      }

      const result = await createEventWithTrainers({ data: formData })

      if (result.error) {
        setError(result.error)
        setIsSubmitting(false)
        return
      }

      // Success - navigate back to events list
      navigate({ to: '/events' })
    } catch (err: any) {
      setError(err.message || 'Failed to create event')
      setIsSubmitting(false)
    }
  }

  const selectedTrainers = getSelectedTrainers()

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Event</h1>
        <p className="text-gray-600">Fill in the details to create a training event and assign trainers</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow">
        <div className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Event Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Event Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter event name"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category *
            </label>
            <select
              required
              value={formData.category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {EVENT_CATEGORIES.map(cat => (
                <option key={cat.name} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Color Selection with Palette */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Event Color *
            </label>
            <div className="space-y-3">
              {/* Current Selected Color Display */}
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border">
                <span className="text-sm text-gray-600">Selected Color:</span>
                <div
                  className="w-10 h-10 rounded-lg border-2 border-gray-300 shadow-sm"
                  style={{ backgroundColor: formData.color }}
                />
                <span className="text-sm font-medium text-gray-700">
                  {COLOR_PALETTE.find(c => c.value === formData.color)?.name || 'Custom'}
                </span>
              </div>

              {/* Color Palette Grid */}
              <div className="border rounded-lg p-4 bg-white">
                <p className="text-xs text-gray-600 mb-3">Choose a color for your event:</p>
                <div className="grid grid-cols-8 gap-2">
                  {COLOR_PALETTE.map((colorOption) => (
                    <button
                      key={colorOption.value}
                      type="button"
                      onClick={() => handleColorSelect(colorOption.value)}
                      className={`w-10 h-10 rounded-lg transition-all hover:scale-110 ${formData.color === colorOption.value
                        ? 'ring-2 ring-offset-2 ring-gray-900 shadow-lg'
                        : 'hover:shadow-md'
                        }`}
                      style={{ backgroundColor: colorOption.value }}
                      title={colorOption.name}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                required
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                End Date *
              </label>
              <input
                type="date"
                required
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter event description (optional)"
            />
          </div>

          {/* Trainer Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-semibold text-gray-700">
                Assign Trainers
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Select All
                </button>
                <span className="text-gray-300">|</span>
                <button
                  type="button"
                  onClick={handleDeselectAll}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Deselect All
                </button>
              </div>
            </div>

            {/* Selected Trainers Summary */}
            {selectedTrainers.length > 0 && (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <h3 className="font-semibold text-blue-900">
                      Selected Trainers ({selectedTrainers.length})
                    </h3>
                  </div>
                </div>
                <div className="space-y-2">
                  {selectedTrainers.map((trainer: any) => (
                    <div
                      key={trainer.id}
                      className="flex items-center justify-between bg-white px-3 py-2 rounded border border-blue-200"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-blue-700">
                            {trainer.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-sm text-gray-900">
                            {trainer.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            {trainer.specialization || trainer.rank}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleTrainerToggle(trainer.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="border rounded-lg p-4 bg-gray-50">
              <p className="text-sm text-gray-600 mb-3">
                Select trainers who will be assigned to this event
                {formData.trainer_ids.length === 0 && ' (none selected)'}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-80 overflow-y-auto">
                {trainers.map((trainer: any) => (
                  <label
                    key={trainer.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition ${formData.trainer_ids.includes(trainer.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.trainer_ids.includes(trainer.id)}
                      onChange={() => handleTrainerToggle(trainer.id)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 truncate">
                        {trainer.name}
                      </p>
                      <p className="text-xs text-gray-600 truncate">
                        {trainer.specialization || trainer.rank}
                      </p>
                    </div>
                  </label>
                ))}
              </div>

              {trainers.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No active trainers available
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
          <button
            type="button"
            onClick={() => navigate({ to: '/events' })}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating...' : 'Create Event'}
          </button>
        </div>
      </form>
    </div>
  )
}
