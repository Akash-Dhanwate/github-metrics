"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, GitBranch, GitFork, Loader2, Search, Star, Users } from "lucide-react"

import Achievements from "@/components/dashboard/Achievements"
import ContributionGraph from "@/components/dashboard/ContributionGraph"
import ExportStats from "@/components/dashboard/ExportStats"
import ProfileSidebar from "@/components/dashboard/ProfileSidebar"
import PopularUsers from "@/components/home/PopularUsers"
import TrendingRepos from "@/components/home/TrendingRepos"
import RepoCard from "@/components/ui/RepoCard"
import RepoInsights from "@/components/ui/RepoInsights"
import StatsCard from "@/components/ui/StatsCard"
import type { GithubProfile, Repository } from "@/lib/types"

export default function DashboardPage() {
  const params = useParams<{ username: string }>()
  const router = useRouter()
  const [data, setData] = useState<GithubProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchUsername, setSearchUsername] = useState("")
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/github_analytics/${params.username}`)

        if (!response.ok) throw new Error("User not found")

        const result = await response.json()
        setData(result)
        setSearchUsername(result.username)
        setError(null)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load profile")
        setData(null)
      } finally {
        setLoading(false)
      }
    }

    if (params.username) fetchData()
  }, [params.username])

  const handleSearch = async () => {
    const nextUsername = searchUsername.trim().replace(/^@/, "")
    if (!nextUsername) return

    setSearching(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/github/${nextUsername}`)
      if (!response.ok) {
        setError("User not found")
        return
      }

      router.push(`/dashboard/${nextUsername}`)
    } catch {
      setError("API is not reachable")
    } finally {
      setSearching(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0d1117] px-4 text-[#8b949e]">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-[#3fb950]" />
          <p>Loading profile analytics...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#0d1117] px-4 py-8">
        <div className="mx-auto max-w-2xl rounded-lg border border-[#f85149]/30 bg-[#f85149]/10 p-6 text-center">
          <h1 className="text-xl font-semibold text-[#ff7b72]">Profile unavailable</h1>
          <p className="mt-2 text-[#ffb3ad]">{error || "No data returned."}</p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-[#238636] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2ea043]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back home
          </Link>
        </div>
      </div>
    )
  }

  const topLanguage = Object.keys(data.languages || {})[0] || "N/A"

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3]">
      <header className="sticky top-0 z-30 border-b border-[#30363d] bg-[#010409]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:px-8">
          <div className="flex items-center justify-between gap-3">
            <Link href="/" className="flex items-center gap-2 text-sm font-semibold">
              <GitBranch className="h-5 w-5" />
              GitHub Metrics
            </Link>
            <Link href="/compare" className="rounded-md px-3 py-2 text-sm text-[#8b949e] transition hover:bg-[#21262d] hover:text-[#e6edf3]">
              Compare
            </Link>
          </div>

          <div className="flex flex-1 flex-col gap-2 sm:flex-row lg:ml-auto lg:max-w-xl">
            <label className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8b949e]" />
              <input
                type="text"
                placeholder="Search another user"
                value={searchUsername}
                onChange={(event) => setSearchUsername(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && handleSearch()}
                className="h-10 w-full rounded-md border border-[#30363d] bg-[#0d1117] pl-10 pr-3 text-sm text-[#e6edf3] placeholder:text-[#8b949e] focus:border-[#3fb950] focus:ring-2 focus:ring-[#3fb950]/30"
              />
            </label>
            <button
              onClick={handleSearch}
              disabled={searching}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#238636] px-4 text-sm font-semibold text-white transition hover:bg-[#2ea043] disabled:opacity-60"
            >
              {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              Search
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:px-8 xl:grid-cols-[300px_1fr]">
        <ProfileSidebar data={data} />

        <div className="space-y-6">
          <section>
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm text-[#8b949e]">Dashboard</p>
                <h1 className="text-2xl font-semibold text-[#e6edf3] sm:text-3xl">{data.name || data.username}</h1>
              </div>
              <ExportStats data={data} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <StatsCard title="Repositories" value={data.public_repos} icon={GitBranch} />
              <StatsCard title="Total stars" value={data.total_stars ?? 0} icon={Star} />
              <StatsCard title="Total forks" value={data.total_forks ?? 0} icon={GitFork} />
              <StatsCard title="Top language" value={topLanguage} icon={Users} />
            </div>
          </section>

          <Achievements username={data.username} />
          <ContributionGraph username={data.username} />
          <RepoInsights username={data.username} repositories={data.top_repositories || []} />

          <section className="rounded-lg border border-[#30363d] bg-[#161b22] p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-[#e6edf3]">Popular Repositories</h2>
                <p className="mt-1 text-sm text-[#8b949e]">Ranked by stars and forks from the profile analytics endpoint.</p>
              </div>
            </div>
            <div className="grid gap-3">
              {(data.top_repositories || []).map((repo: Repository) => (
                <RepoCard key={repo.name} repo={repo} />
              ))}
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-2">
            <PopularUsers />
            <TrendingRepos />
          </div>
        </div>
      </main>
    </div>
  )
}
