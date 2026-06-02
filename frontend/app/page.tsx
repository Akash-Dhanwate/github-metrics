"use client"

import Link from "next/link"
import { ArrowRight, BarChart3, GitBranch, GitCompare, Search, ShieldCheck, Sparkles } from "lucide-react"
import SearchBar from "@/components/ui/SearchBar"
import PopularUsers from "@/components/home/PopularUsers"
import TrendingRepos from "@/components/home/TrendingRepos"

const featureRows = [
  {
    icon: BarChart3,
    title: "Profile analytics",
    description: "Followers, repositories, stars, forks, language mix, and top repositories in one view.",
  },
  {
    icon: ShieldCheck,
    title: "Contribution signal",
    description: "Activity heatmap, total contributions, and achievement badges when the API returns them.",
  },
  {
    icon: GitCompare,
    title: "User comparison",
    description: "Compare two GitHub profiles side by side without leaving the workspace.",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3]">
      <header className="border-b border-[#30363d] bg-[#010409]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold">
            <GitBranch className="h-5 w-5" />
            GitHub Metrics
          </Link>
          <nav className="flex items-center gap-2 text-sm text-[#8b949e]">
            <Link href="/compare" className="rounded-md px-3 py-2 transition hover:bg-[#21262d] hover:text-[#e6edf3]">
              Compare
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hidden rounded-md px-3 py-2 transition hover:bg-[#21262d] hover:text-[#e6edf3] sm:inline-flex"
            >
              GitHub
            </a>
          </nav>
        </div>
      </header>

      <main>
        <section className="border-b border-[#30363d] bg-[radial-gradient(circle_at_top_right,rgba(35,134,54,.2),transparent_34%),linear-gradient(180deg,#0d1117_0%,#010409_100%)]">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:py-16">
            <div className="flex flex-col justify-center">
              <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-[#30363d] bg-[#161b22] px-3 py-1 text-xs text-[#8b949e]">
                <Sparkles className="h-3.5 w-3.5 text-[#3fb950]" />
                GitHub-style analytics workspace
              </div>
              <h1 className="max-w-3xl text-4xl font-semibold tracking-normal text-white sm:text-5xl lg:text-6xl">
                Inspect any developer profile like a repository maintainer.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[#8b949e] sm:text-lg">
                Search a username to review profile stats, contribution activity, top repositories, language usage, achievements, and exportable summaries.
              </p>
              <div className="mt-8 max-w-2xl">
                <SearchBar />
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                <Link
                  href="/compare"
                  className="inline-flex items-center gap-2 rounded-md border border-[#30363d] bg-[#21262d] px-4 py-2 font-medium text-[#e6edf3] transition hover:border-[#8b949e] hover:bg-[#30363d]"
                >
                  Compare users
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <span className="text-[#8b949e]">Try `torvalds`, `gaearon`, or `vercel`.</span>
              </div>
            </div>

            <div className="rounded-lg border border-[#30363d] bg-[#0d1117]/80 p-4 shadow-2xl shadow-black/30">
              <div className="mb-4 flex items-center justify-between border-b border-[#30363d] pb-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Search className="h-4 w-4 text-[#3fb950]" />
                  Profile output
                </div>
                <div className="text-xs text-[#8b949e]">Live API</div>
              </div>
              <div className="space-y-4">
                {featureRows.map((item) => (
                  <div key={item.title} className="flex gap-4 rounded-md border border-[#30363d] bg-[#161b22] p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#238636]/15 text-[#3fb950]">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-[#e6edf3]">{item.title}</h2>
                      <p className="mt-1 text-sm leading-6 text-[#8b949e]">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[.9fr_1.1fr] lg:px-8">
          <PopularUsers />
          <TrendingRepos />
        </section>
      </main>
    </div>
  )
}
