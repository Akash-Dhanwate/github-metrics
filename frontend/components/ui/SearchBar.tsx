"use client"

import { useState , useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Loader2, Search, XCircle } from "lucide-react"
import { apiGet } from "@/lib/api"

export default function SearchBar() {
  const [username, setUsername] = useState("")
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // 
  const [history, setHistory] = useState<string[]>([])
  useEffect(() => {
  const saved = localStorage.getItem("searchHistory")

  if (saved) {
    try {
      setHistory(JSON.parse(saved))
    } catch {
      setHistory([])
    }
  }
}, [])
  const router = useRouter()

  const handleSearch = async (value = username) => {
    const nextUsername = value.trim().replace(/^@/, "")

    if (!nextUsername) {
      setError("Enter a GitHub username")
      return
    }

    setSearching(true)
    setError(null)

    try {
      await apiGet(`/github/${nextUsername}`)

      const newHistory = [nextUsername, ...history.filter((user) => user !== nextUsername)].slice(0, 5)
      setHistory(newHistory)
      localStorage.setItem("searchHistory", JSON.stringify(newHistory))

      router.push(`/dashboard/${nextUsername}`)
      setUsername("")
    } catch {
      setError("API is not reachable")
    } finally {
      setSearching(false)
    }
  }

  return (
    <div className="rounded-lg border border-[#30363d] bg-[#161b22] p-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8b949e]" />
          <input
            type="text"
            placeholder="Search GitHub username"
            value={username}
            onChange={(event) => {
              setUsername(event.target.value)
              setError(null)
            }}
            onKeyDown={(event) => event.key === "Enter" && handleSearch()}
            disabled={searching}
            className="h-11 w-full rounded-md border border-[#30363d] bg-[#0d1117] pl-10 pr-3 text-sm text-[#e6edf3] placeholder:text-[#8b949e] transition focus:border-[#3fb950] focus:ring-2 focus:ring-[#3fb950]/30 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </label>
        <button
          onClick={() => handleSearch()}
          disabled={searching}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#238636] px-5 text-sm font-semibold text-white transition hover:bg-[#2ea043] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
          {searching ? "Searching" : "Analyze"}
        </button>
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 rounded-md border border-[#f85149]/30 bg-[#f85149]/10 px-3 py-2 text-sm text-[#ff7b72]">
          <XCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs text-[#8b949e]">Recent</span>
          {history.map((user) => (
            <button
              key={user}
              onClick={() => handleSearch(user)}
              className="rounded-full border border-[#30363d] bg-[#0d1117] px-3 py-1 text-xs text-[#8b949e] transition hover:border-[#8b949e] hover:text-[#e6edf3]"
            >
              @{user}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
