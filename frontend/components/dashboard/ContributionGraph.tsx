"use client"

import { useEffect, useState } from "react"
import { Activity, CalendarDays } from "lucide-react"
import StatsCard from "@/components/ui/StatsCard"
import type { ContributionCalendar, ContributionWeek } from "@/lib/types"

export default function ContributionGraph({ username }: { username: string }) {
  const [data, setData] = useState<{
    contributions?: {
      data?: {
        user?: {
          contributionsCollection?: {
            contributionCalendar?: ContributionCalendar
          }
        }
      }
    }
  } | null>(null)
  const [loading, setLoading] = useState(true)

  const year = new Date().getFullYear()

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/github/${username}/contributions`)
        const result = await response.json()
        setData(result)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [username])

  if (loading) {
    return (
      <section className="rounded-lg border border-[#30363d] bg-[#161b22] p-5">
        <div className="animate-pulse space-y-5">
          <div className="h-5 w-44 rounded bg-[#21262d]" />
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="h-24 rounded bg-[#21262d]" />
            <div className="h-24 rounded bg-[#21262d]" />
          </div>
          <div className="h-36 rounded bg-[#21262d]" />
        </div>
      </section>
    )
  }

  const contributionData = data?.contributions?.data?.user?.contributionsCollection?.contributionCalendar

  if (!contributionData) {
    return (
      <section className="rounded-lg border border-[#30363d] bg-[#161b22] p-5">
        <h2 className="font-semibold text-[#e6edf3]">Contribution Activity</h2>
        <p className="mt-2 text-sm text-[#8b949e]">No contribution data found.</p>
      </section>
    )
  }

  const days = ["", "Mon", "", "Wed", "", "Fri", ""]

  return (
    <section className="rounded-lg border border-[#30363d] bg-[#161b22] p-5">
      <div className="flex flex-col gap-5">
        <div>
          <h2 className="text-lg font-semibold text-[#e6edf3]">Contribution Activity</h2>
          <p className="mt-1 text-sm text-[#8b949e]">GitHub contribution calendar for the current year.</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <StatsCard title="Total contributions" value={contributionData.totalContributions} icon={Activity} />
          <StatsCard title="Year" value={year} icon={CalendarDays} />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-[#8b949e]">
          <span>Less</span>
          <span className="h-3.5 w-3.5 rounded-sm bg-[#21262d]" />
          <span className="h-3.5 w-3.5 rounded-sm bg-[#0e4429]" />
          <span className="h-3.5 w-3.5 rounded-sm bg-[#006d32]" />
          <span className="h-3.5 w-3.5 rounded-sm bg-[#26a641]" />
          <span className="h-3.5 w-3.5 rounded-sm bg-[#39d353]" />
          <span>More</span>
        </div>

        <div className="overflow-x-auto pb-2">
          <div className="inline-flex gap-1">
            <div className="mr-2 flex flex-col gap-1 pt-0.5">
              {days.map((day, index) => (
                <div key={`${day}-${index}`} className="h-3.5 text-[10px] leading-none text-[#8b949e]">
                  {day}
                </div>
              ))}
            </div>

            {contributionData.weeks.map((week: ContributionWeek, index: number) => (
              <div key={index} className="flex flex-col gap-1">
                {week.contributionDays.map((day) => {
                  const count = day.contributionCount
                  let color = "bg-[#21262d]"
                  if (count > 0) color = "bg-[#0e4429]"
                  if (count > 5) color = "bg-[#006d32]"
                  if (count > 10) color = "bg-[#26a641]"
                  if (count > 20) color = "bg-[#39d353]"

                  return (
                    <div
                      key={day.date}
                      title={`${count} contributions on ${day.date}`}
                      className={`h-3.5 w-3.5 rounded-sm ${color} transition hover:ring-2 hover:ring-[#58a6ff]`}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
