import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient } from '~/utils/supabase'
import { useState } from 'react'

// Server function to load activity for editing
const getActivityForEdit = createServerFn({ method: 'GET' })
    .inputValidator((id: string) => id)
    .handler(async ({ data: id }) => {
        const supabase = getSupabaseServerClient()

        const { data: activity, error } = await supabase
            .from('religious_activities')
            .select('*')
            .eq('id', id)
            .single()

        if (error || !activity) {
            throw new Error('Activity not found')
        }

        // Also fetch trainers for participant selection
        const { data: trainers } = await supabase
            .from('trainers')
            .select('id, name, rank, status')
            .eq('status', 'active')
            .order('name', { ascending: true })

        return {
            activity,
            trainers: trainers || []
        }
    })

// Server function to update activity
const updateActivity = createServerFn({ method: 'POST' })
    .inputValidator((data: {
        id: number
        date: string
        activity: string
        in_charge: string
        participants: number[]
    }) => data)
    .handler(async ({ data }) => {
        const supabase = getSupabaseServerClient()

        const { id, ...updateData } = data

        const { error } = await supabase
            .from('religious_activities')
            .update(updateData)
            .eq('id', id)

        if (error) {
            throw new Error(`Failed to update: ${error.message}`)
        }

        return { success: true }
    })

// Route configuration
export const Route = createFileRoute('/_authed/religious-activity/edit/$id')({
    beforeLoad: ({ context }) => {
        // Only ADMIN and COORDINATOR can edit
        if (context.user?.role === 'TRAINER') {
            throw new Error('Unauthorized: Only administrators can edit activities')
        }
    },
    loader: async ({ params }) => await getActivityForEdit({ data: params.id }),
    component: EditActivityPage,
})

// Main component
function EditActivityPage() {
    const { activity, trainers } = Route.useLoaderData()
    const navigate = useNavigate()
    const [isSaving, setIsSaving] = useState(false)

    const [formData, setFormData] = useState({
        date: activity.date,
        activity: activity.activity,
        in_charge: activity.in_charge,
        participants: activity.participants || []
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            setIsSaving(true)
            await updateActivity({
                data: {
                    id: activity.id,
                    ...formData
                }
            })

            alert('Activity updated successfully!')
            navigate({ to: '/religious-activity/$id', params: { id: activity.id.toString() } })
        } catch (error) {
            console.error('Update error:', error)
            alert('Failed to update activity. Please try again.')
            setIsSaving(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Edit Religious Activity</h1>
                    <p className="text-gray-600 mt-1">Update activity information</p>
                </div>
                <Link
                    to="/religious-activity/$id"
                    params={{ id: activity.id.toString() }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                    ← Cancel
                </Link>
            </div>

            {/* Edit Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
                {/* Date Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date
                    </label>
                    <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        required
                    />
                </div>

                {/* Activity Type Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Activity Type
                    </label>
                    <select
                        value={formData.activity}
                        onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        required
                    >
                        <option value="">Select activity type</option>
                        <option value="Fajr Prayer">Fajr Prayer</option>
                        <option value="Dhuhr Prayer">Dhuhr Prayer</option>
                        <option value="Asr Prayer">Asr Prayer</option>
                        <option value="Maghrib Prayer">Maghrib Prayer</option>
                        <option value="Isha Prayer">Isha Prayer</option>
                        <option value="Friday Prayer">Friday Prayer</option>
                        <option value="Tarawih Prayer">Tarawih Prayer</option>
                        <option value="Quran Reading">Quran Reading</option>
                        <option value="Religious Talk">Religious Talk</option>
                    </select>
                </div>

                {/* Leader/Imam Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Leader/Imam
                    </label>
                    <input
                        type="text"
                        value={formData.in_charge}
                        onChange={(e) => setFormData({ ...formData, in_charge: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        placeholder="Enter leader/imam name"
                        required
                    />
                </div>

                {/* Participants Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Participants ({formData.participants.length} selected)
                    </label>
                    <div className="border border-gray-300 rounded-lg p-4 max-h-64 overflow-y-auto">
                        {trainers.map((trainer: any) => (
                            <label
                                key={trainer.id}
                                className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                            >
                                <input
                                    type="checkbox"
                                    checked={formData.participants.includes(trainer.id)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setFormData({
                                                ...formData,
                                                participants: [...formData.participants, trainer.id]
                                            })
                                        } else {
                                            setFormData({
                                                ...formData,
                                                participants: formData.participants.filter((id: number) => id !== trainer.id)
                                            })
                                        }
                                    }}
                                    className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                                />
                                <div>
                                    <p className="font-medium text-gray-900">{trainer.name}</p>
                                    <p className="text-sm text-gray-600">{trainer.rank}</p>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-3 pt-4 border-t">
                    <Link
                        to="/religious-activity/$id"
                        params={{ id: activity.id.toString() }}
                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    )
}