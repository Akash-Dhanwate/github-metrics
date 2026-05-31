"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SearchBar() {
    const [username, setUsername] = useState("")
    const [searching, setSearching] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const handleSearch = async () => {
        if (!username.trim()) {
            setError("Please enter a username")
            return
        }

        setSearching(true)
        setError(null)

        try {
            // Validate username exists
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/github/${username}`
            )
            
            if (response.status === 404) {
                setError("User not found")
                setSearching(false)
                return
            }

            if (!response.ok) {
                setError("Error checking user")
                setSearching(false)
                return
            }

            // User exists, go to dashboard
            router.push(`/dashboard/${username}`)
            setUsername("")
        } catch (err) {
            setError("Failed to search. Check username and try again")
        } finally {
            setSearching(false)
        }
    }

    return (
        <div className="mb-6">
            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="Search GitHub username..."
                    value={username}
                    onChange={(e) => {
                        setUsername(e.target.value)
                        setError(null)
                    }}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    disabled={searching}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
                <button
                    onClick={handleSearch}
                    disabled={searching}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                    {searching ? "Searching..." : "Search"}
                </button>
            </div>
            {error && (
                <p className="text-red-600 text-sm mt-2">⚠️ {error}</p>
            )}
        </div>
    )
}