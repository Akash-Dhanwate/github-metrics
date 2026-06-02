"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Users } from "lucide-react"
import type { TrendingUser } from "@/lib/types"

export default function PopularUsers() {
  const router = useRouter()
  const [users, setUsers] = useState<TrendingUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTrending() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/trending/users`)
        const data = await response.json()
        setUsers(data.users || [])
      } catch (err) {
        console.error(err)
        setUsers([
          { username: "torvalds", name: "Linus Torvalds", avatar: "https://avatars.githubusercontent.com/u/1024025?v=4" },
          { username: "gaearon", name: "Dan Abramov", avatar: "https://avatars.githubusercontent.com/u/810438?v=4" },
          { username: "octocat", name: "The Octocat", avatar: "https://avatars.githubusercontent.com/u/583231?v=4" },
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchTrending()
  }, [])

  return (
    <section className="rounded-lg border border-[#30363d] bg-[#161b22] p-5">
      <div className="mb-4 flex items-center gap-2">
        <Users className="h-5 w-5 text-[#3fb950]" />
        <h2 className="text-lg font-semibold text-[#e6edf3]">Trending Users</h2>
      </div>
      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="h-20 animate-pulse rounded-lg bg-[#21262d]" />
          ))}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <button
              key={user.username}
              onClick={() => router.push(`/dashboard/${user.username}`)}
              className="rounded-lg border border-[#30363d] bg-[#0d1117] p-4 text-left transition hover:border-[#58a6ff] hover:bg-[#161b22]"
            >
              <div className="flex items-center gap-3">
                <img src={user.avatar} alt={user.username} className="h-10 w-10 rounded-full border border-[#30363d] object-cover" />
                <div className="min-w-0">
                  <p className="truncate font-semibold text-[#e6edf3]">@{user.username}</p>
                  <p className="truncate text-xs text-[#8b949e]">{user.name}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
