"use client"
import { useEffect, useState } from "react"
import type { Badge } from "@/lib/types"

interface BadgesDisplayProps {
    username: string
}

export default function BadgesDisplay({ username }: BadgesDisplayProps) {
    const [badges, setBadges] = useState<Badge[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchBadges() {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/github/${username}/contributions`
                )
                const result = await response.json()
                setBadges(result.badges || [])
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchBadges()
    }, [username])

    if (loading) return <div>Loading badges...</div>

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">🏅 Achievements</h2>
            
            {badges.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400">Keep coding to earn badges!</p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {badges.map((badge, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-2 p-3 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-700 dark:to-gray-800 rounded-lg">
                            <div className="text-3xl">{badge.icon}</div>
                            <h3 className="font-bold text-center text-sm text-gray-900 dark:text-white">{badge.name}</h3>
                            <p className="text-xs text-gray-600 dark:text-gray-400 text-center">{badge.desc}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
