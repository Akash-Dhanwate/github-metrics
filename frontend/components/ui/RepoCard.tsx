import { GitFork, Star } from "lucide-react"
import type { Repository } from "@/lib/types"

interface RepoCardProps {
  repo: Repository
}

export default function RepoCard({ repo }: RepoCardProps) {
  return (
    <a
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-lg border border-[#30363d] bg-[#0d1117] p-4 transition hover:border-[#58a6ff] hover:bg-[#161b22]"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-[#58a6ff]">{repo.name}</h3>
          {repo.description && <p className="mt-1 line-clamp-2 text-sm leading-6 text-[#8b949e]">{repo.description}</p>}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-[#8b949e]">
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
  )
}
