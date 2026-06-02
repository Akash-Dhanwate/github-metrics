"use client"

import { useEffect, useState } from "react"
import { Award } from "lucide-react"
import type { Badge } from "@/lib/types"

export default function Achievements({ username }: { username: string }) {
  const [badges, setBadges] = useState<Badge[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBadges() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/github/${username}/contributions`)
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

  if (loading) {
    return (
      <section className="rounded-lg border border-[#30363d] bg-[#161b22] p-5">
        <div className="h-16 animate-pulse rounded bg-[#21262d]" />
      </section>
    )
  }

  if (badges.length === 0) return null

  return (
    <section className="rounded-lg border border-[#30363d] bg-[#161b22] p-5">
      <div className="mb-4 flex items-center gap-2">
        <Award className="h-5 w-5 text-[#d29922]" />
        <h2 className="text-lg font-semibold text-[#e6edf3]">Achievements</h2>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {badges.map((badge, idx) => (
          <div key={`${badge.name}-${idx}`} className="rounded-lg border border-[#30363d] bg-[#0d1117] p-4">
            <div className="text-2xl">{badge.icon}</div>
            <p className="mt-2 text-sm font-semibold text-[#e6edf3]">{badge.name}</p>
            {badge.desc && <p className="mt-1 text-xs leading-5 text-[#8b949e]">{badge.desc}</p>}
          </div>
        ))}
      </div>
    </section>
  )
}
