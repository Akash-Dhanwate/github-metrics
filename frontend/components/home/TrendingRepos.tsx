"use client"

import { useEffect, useState } from "react"
import { GitFork, Flame, Star } from "lucide-react"
import { apiGet } from "@/lib/api"
import type { Repository } from "@/lib/types"

export default function TrendingRepos() {
  const [repos, setRepos] = useState<Repository[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function fetchTrending() {
      try {
        const data = await apiGet<{ repositories?: Repository[] }>("/trending/repositories", 5 * 60_000)
        if (!cancelled) setRepos(data.repositories || [])
      } catch (err) {
        console.error(err)
        if (!cancelled) setRepos([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchTrending()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="rounded-lg border border-[#30363d] bg-[#161b22] p-5">
      <div className="mb-4 flex items-center gap-2">
        <Flame className="h-5 w-5 text-[#f78166]" />
        <h2 className="text-lg font-semibold text-[#e6edf3]">Trending Repositories</h2>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="h-24 animate-pulse rounded-lg bg-[#21262d]" />
          ))}
        </div>
      ) : repos.length > 0 ? (
        <div className="space-y-3">
          {repos.map((repo) => (
            <a
              key={`${repo.owner}/${repo.name}`}
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg border border-[#30363d] bg-[#0d1117] p-4 transition hover:border-[#58a6ff] hover:bg-[#161b22]"
            >
              <div className="flex items-start gap-3">
                {repo.avatar && <img src={repo.avatar} alt={repo.owner} className="h-9 w-9 rounded-full border border-[#30363d] object-cover" />}
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-semibold text-[#58a6ff]">
                    {repo.owner}/{repo.name}
                  </h3>
                  {repo.description && <p className="mt-1 line-clamp-2 text-sm leading-6 text-[#8b949e]">{repo.description}</p>}
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-4 text-sm text-[#8b949e]">
                {repo.language && (
                  <span className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-[#3fb950]" />
                    {repo.language}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Star className="h-4 w-4" />
                  {Number(repo.stars || 0).toLocaleString()}
                </span>
                <span className="flex items-center gap-1.5">
                  <GitFork className="h-4 w-4" />
                  {Number(repo.forks || 0).toLocaleString()}
                </span>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <p className="text-sm text-[#8b949e]">Trending repositories are unavailable right now.</p>
      )}
    </section>
  )
}
