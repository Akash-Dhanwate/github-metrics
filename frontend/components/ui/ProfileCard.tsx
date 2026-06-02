import { ExternalLink, GitFork, Users } from "lucide-react"

interface ProfileCardProps {
  avatar: string
  name?: string
  username: string
  followers: number
  following: number
  public_repos: number
  profile_url: string
}

export default function ProfileCard(props: ProfileCardProps) {
  return (
    <div className="rounded-lg border border-[#30363d] bg-[#161b22] p-5">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <img src={props.avatar} alt={props.name || props.username} className="h-24 w-24 rounded-full border border-[#30363d] object-cover" />
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-2xl font-semibold text-[#e6edf3]">{props.name || props.username}</h2>
          <p className="text-[#8b949e]">@{props.username}</p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-[#8b949e]">
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              <strong className="text-[#e6edf3]">{props.followers}</strong> followers
            </span>
            <span>
              <strong className="text-[#e6edf3]">{props.following}</strong> following
            </span>
            <span className="inline-flex items-center gap-1.5">
              <GitFork className="h-4 w-4" />
              <strong className="text-[#e6edf3]">{props.public_repos}</strong> repos
            </span>
          </div>
        </div>
        <a
          href={props.profile_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-md border border-[#30363d] bg-[#21262d] px-4 py-2 text-sm font-medium text-[#e6edf3] transition hover:border-[#8b949e] hover:bg-[#30363d]"
        >
          View profile
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  )
}
