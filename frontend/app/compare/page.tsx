"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, GitBranch, GitCompare, GitFork, Loader2, Search, Star } from "lucide-react"
import ProfileCard from "@/components/ui/ProfileCard"
import StatsCard from "@/components/ui/StatsCard"
import { apiGet } from "@/lib/api"
import type { GithubProfile } from "@/lib/types"

export default function ComparePage() {
  const [user1, setUser1] = useState<GithubProfile | null>(null)
  const [user2, setUser2] = useState<GithubProfile | null>(null)
  const [firstUsername, setFirstUsername] = useState("")
  const [secondUsername, setSecondUsername] = useState("")
  const [loadingSlot, setLoadingSlot] = useState<"first" | "second" | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (username: string, setUser: (value: GithubProfile | null) => void, slot: "first" | "second") => {
    const nextUsername = username.trim().replace(/^@/, "")
    if (!nextUsername) return

    setLoadingSlot(slot)
    setError(null)
    try {
      const data = await apiGet<GithubProfile>(`/github_analytics/${nextUsername}`)
      setUser(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not load user")
      setUser(null)
    } finally {
      setLoadingSlot(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3]">
      <header className="border-b border-[#30363d] bg-[#010409]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold">
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>
          <div className="flex items-center gap-2 text-sm text-[#8b949e]">
            <GitCompare className="h-4 w-4 text-[#3fb950]" />
            User comparison
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-3xl">
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">Compare GitHub users</h1>
          <p className="mt-3 text-[#8b949e]">Load two profiles to compare repositories, stars, forks, followers, and language focus.</p>
        </div>

        {error && <div className="mb-6 rounded-lg border border-[#f85149]/30 bg-[#f85149]/10 p-4 text-sm text-[#ff7b72]">{error}</div>}

        <div className="grid gap-6 lg:grid-cols-2">
          <CompareSlot
            label="First user"
            value={firstUsername}
            setValue={setFirstUsername}
            loading={loadingSlot === "first"}
            onSearch={() => handleSearch(firstUsername, setUser1, "first")}
            user={user1}
          />
          <CompareSlot
            label="Second user"
            value={secondUsername}
            setValue={setSecondUsername}
            loading={loadingSlot === "second"}
            onSearch={() => handleSearch(secondUsername, setUser2, "second")}
            user={user2}
          />
        </div>
      </main>
    </div>
  )
}

function CompareSlot({
  label,
  value,
  setValue,
  loading,
  onSearch,
  user,
}: {
  label: string
  value: string
  setValue: (value: string) => void
  loading: boolean
  onSearch: () => void
  user: GithubProfile | null
}) {
  return (
    <section className="rounded-lg border border-[#30363d] bg-[#161b22] p-5">
      <label className="text-sm font-medium text-[#8b949e]">{label}</label>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8b949e]" />
          <input
            type="text"
            placeholder="GitHub username"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && onSearch()}
            className="h-11 w-full rounded-md border border-[#30363d] bg-[#0d1117] pl-10 pr-3 text-sm text-[#e6edf3] placeholder:text-[#8b949e] focus:border-[#3fb950] focus:ring-2 focus:ring-[#3fb950]/30"
          />
        </div>
        <button
          onClick={onSearch}
          disabled={loading}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#238636] px-4 text-sm font-semibold text-white transition hover:bg-[#2ea043] disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          Load
        </button>
      </div>

      {user ? (
        <div className="mt-5 space-y-4">
          <ProfileCard
            avatar={user.avatar_url}
            name={user.name}
            username={user.username}
            followers={user.followers}
            following={user.following}
            public_repos={user.public_repos}
            profile_url={user.profile_url}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <StatsCard title="Repositories" value={user.public_repos} icon={GitBranch} />
            <StatsCard title="Stars" value={user.total_stars ?? 0} icon={Star} />
            <StatsCard title="Forks" value={user.total_forks ?? 0} icon={GitFork} />
            <StatsCard title="Top language" value={Object.keys(user.languages || {})[0] || "N/A"} />
          </div>
        </div>
      ) : (
        <div className="mt-5 rounded-lg border border-dashed border-[#30363d] bg-[#0d1117] p-8 text-center text-sm text-[#8b949e]">
          Search a username to fill this side.
        </div>
      )}
    </section>
  )
}
