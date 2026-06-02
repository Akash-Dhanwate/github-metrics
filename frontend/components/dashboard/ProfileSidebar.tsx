"use client"

import { Building2, ExternalLink, Link as LinkIcon, MapPin, Users } from "lucide-react"
import type { GithubProfile } from "@/lib/types"

interface ProfileSidebarProps {
  data: GithubProfile
}

const languageColors = ["#3fb950", "#58a6ff", "#d29922", "#f85149", "#bc8cff", "#39c5cf", "#ff7b72"]

export default function ProfileSidebar({ data }: ProfileSidebarProps) {
  const languageData = Object.entries(data.languages || {})
    .map(([name, value]) => ({ name, value: Number(value) || 0 }))
    .sort((a, b) => b.value - a.value)
  const totalLanguageValue = languageData.reduce((sum, item) => sum + item.value, 0)

  return (
    <aside className="space-y-4 xl:sticky xl:top-24">
      <section className="rounded-lg border border-[#30363d] bg-[#161b22] p-5">
        <img
          src={data.avatar_url}
          alt={data.name || data.username}
          className="h-28 w-28 rounded-full border border-[#30363d] object-cover"
        />

        <div className="mt-4">
          <h1 className="break-words text-2xl font-semibold text-[#e6edf3]">{data.name || data.username}</h1>
          <p className="text-lg text-[#8b949e]">@{data.username}</p>
          {data.bio && <p className="mt-4 text-sm leading-6 text-[#c9d1d9]">{data.bio}</p>}
        </div>

        <a
          href={data.profile_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md border border-[#30363d] bg-[#21262d] px-4 py-2 text-sm font-medium text-[#e6edf3] transition hover:border-[#8b949e] hover:bg-[#30363d]"
        >
          Open on GitHub
          <ExternalLink className="h-4 w-4" />
        </a>

        <div className="mt-5 space-y-3 border-t border-[#30363d] pt-5 text-sm text-[#8b949e]">
          <p className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <strong className="text-[#e6edf3]">{data.followers}</strong> followers · <strong className="text-[#e6edf3]">{data.following}</strong> following
          </p>
          {data.company && (
            <p className="flex items-center gap-2 break-words">
              <Building2 className="h-4 w-4 shrink-0" />
              {data.company}
            </p>
          )}
          {data.location && (
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {data.location}
            </p>
          )}
          {data.blog && (
            <a href={data.blog} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 truncate text-[#58a6ff] hover:underline">
              <LinkIcon className="h-4 w-4 shrink-0" />
              {data.blog}
            </a>
          )}
        </div>
      </section>

      <section className="rounded-lg border border-[#30363d] bg-[#161b22] p-5">
        <h2 className="text-sm font-semibold text-[#e6edf3]">Languages</h2>
        {languageData.length > 0 ? (
          <div className="mt-4 space-y-3">
            <div className="flex h-2 overflow-hidden rounded-full bg-[#21262d]">
              {languageData.slice(0, 7).map((item, index) => (
                <span
                  key={item.name}
                  style={{
                    width: `${totalLanguageValue ? (item.value / totalLanguageValue) * 100 : 0}%`,
                    backgroundColor: languageColors[index % languageColors.length],
                  }}
                />
              ))}
            </div>
            <div className="grid gap-2">
              {languageData.slice(0, 7).map((item, index) => {
                const percent = totalLanguageValue ? Math.round((item.value / totalLanguageValue) * 100) : 0
                return (
                  <div key={item.name} className="flex items-center justify-between gap-3 text-sm">
                    <span className="flex min-w-0 items-center gap-2 text-[#c9d1d9]">
                      <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: languageColors[index % languageColors.length] }} />
                      <span className="truncate">{item.name}</span>
                    </span>
                    <span className="text-[#8b949e]">{percent}%</span>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <p className="mt-3 text-sm text-[#8b949e]">No language data found.</p>
        )}
      </section>
    </aside>
  )
}
