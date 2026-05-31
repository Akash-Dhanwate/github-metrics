"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
    const [username, setUsername] = useState("")
    const router = useRouter()

    const handleSearch = () => {
        if (username.trim()) {
            router.push(`/dashboard/${username}`)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="text-center">
                <h1 className="text-5xl font-bold mb-4 text-gray-900">GitHub Metrics</h1>
                <p className="text-gray-600 mb-8">Analyze any GitHub profile in seconds</p>
                <div className="flex gap-2 justify-center">
                    <input
                        type="text"
                        placeholder="Enter GitHub username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                        className="border border-gray-300 rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Search
                    </button>
                </div>
            </div>
        </div>
    )
}