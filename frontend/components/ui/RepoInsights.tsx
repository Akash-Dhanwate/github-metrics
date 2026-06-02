"use client"

import { useState } from "react"
import { ExternalLink, GitPullRequest, HardDrive, Scale, Star, type LucideIcon } from "lucide-react"
import { apiGet } from "@/lib/api"
import type { Repository } from "@/lib/types"

interface RepoInsightsProps {
  username: string
  repositories?: Repository[]
}

export default function RepoInsights({ username, repositories = [] }: RepoInsightsProps) {
  const [selectedRepo, setSelectedRepo] = useState<string>(repositories[0]?.name || "")
  const [insights, setInsights] = useState<Repository | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSelectRepo = async (repoName: string) => {
    setSelectedRepo(repoName)
    setLoading(true)
    setInsights(null)

    try {
      const data = await apiGet<Repository>(`/repo/${username}/${repoName}`, 5 * 60_000)
      setInsights(data)
    } catch (err) {
      console.error(err)
      const fallback = repositories.find((repo) => repo.name === repoName)
      setInsights(fallback || null)
    } finally {
      setLoading(false)
    }
  }

  const current = insights || repositories.find((repo) => repo.name === selectedRepo)

  if (repositories.length === 0) {
    return (
      <section className="rounded-lg border border-[#30363d] bg-[#161b22] p-5">
        <h2 className="text-lg font-semibold text-[#e6edf3]">Repository Insights</h2>
        <p className="mt-2 text-sm text-[#8b949e]">No repositories found for detailed inspection.</p>
      </section>
    )
  }

  return (
    <section className="rounded-lg border border-[#30363d] bg-[#161b22] p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <div className="lg:w-64">
          <h2 className="text-lg font-semibold text-[#e6edf3]">Repository Insights</h2>
          <p className="mt-1 text-sm text-[#8b949e]">Select a repository for deeper API details.</p>
          <div className="mt-4 flex gap-2 overflow-x-auto lg:block lg:space-y-2 lg:overflow-visible">
            {repositories.slice(0, 6).map((repo) => (
              <button
                key={repo.name}
                onClick={() => handleSelectRepo(repo.name)}
                className={`whitespace-nowrap rounded-md border px-3 py-2 text-left text-sm transition lg:w-full lg:whitespace-normal ${
                  selectedRepo === repo.name
                    ? "border-[#58a6ff] bg-[#1f6feb]/15 text-[#e6edf3]"
                    : "border-[#30363d] bg-[#0d1117] text-[#8b949e] hover:border-[#8b949e] hover:text-[#e6edf3]"
                }`}
              >
                {repo.name}
              </button>
            ))}
          </div>
        </div>

        <div className="min-w-0 flex-1 rounded-lg border border-[#30363d] bg-[#0d1117] p-4">
          {loading ? (
            <div className="h-40 animate-pulse rounded bg-[#21262d]" />
          ) : current ? (
            <div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h3 className="truncate text-xl font-semibold text-[#58a6ff]">{current.name}</h3>
                  {current.description && <p className="mt-2 text-sm leading-6 text-[#8b949e]">{current.description}</p>}
                </div>
                {current.url && (
                  <a href={current.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-[#58a6ff] hover:underline">
                    Open
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Metric icon={Star} label="Stars" value={current.stars ?? 0} />
                <Metric icon={GitPullRequest} label="Forks" value={current.forks ?? 0} />
                <Metric icon={HardDrive} label="Size" value={current.size ? `${(current.size / 1024).toFixed(1)} MB` : "N/A"} />
                <Metric icon={Scale} label="License" value={current.license || "None"} />
              </div>
              <p className="mt-4 text-sm text-[#8b949e]">
                Language: <span className="font-medium text-[#e6edf3]">{current.language || "Not specified"}</span>
              </p>
            </div>
          ) : (
            <p className="text-sm text-[#8b949e]">Choose a repository to inspect.</p>
          )}
        </div>
      </div>
    </section>
  )
}

function Metric({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string | number }) {
  return (
    <div className="rounded-md border border-[#30363d] bg-[#161b22] p-3">
      <div className="flex items-center gap-2 text-xs text-[#8b949e]">
        <Icon className="h-4 w-4 text-[#3fb950]" />
        {label}
      </div>
      <p className="mt-2 truncate text-lg font-semibold text-[#e6edf3]">{value ?? "N/A"}</p>
    </div>
  )
}
