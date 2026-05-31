"use client"
import { useState, useEffect } from "react"
import SearchBar from "@/components/ui/SearchBar"
import { useParams } from "next/navigation"
import StatsCard from "@/components/ui/StatsCard"
import ProfileCard from "@/components/ui/ProfileCard"
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts'

export default function DashboardPage() {
    const params = useParams()
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true)
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/github_analytics/${params.username}`
                )
                if (!response.ok) throw new Error("User not found")
                const result = await response.json()
                setData(result)
                setError(null)
            } catch (err: any) {
                setError(err.message)
                setData(null)
            } finally {
                setLoading(false)
            }
        }

        if (params.username) fetchData()
    }, [params.username])

    if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>
    if (error) return <div className="flex items-center justify-center min-h-screen text-red-600">Error: {error}</div>
    if (!data) return <div className="flex items-center justify-center min-h-screen">No data</div>
    if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading user data...</p>
        </div>
    </div>
)

if (error) return (
    <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto p-6">
            <SearchBar />
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mt-8">
                <h2 className="text-red-900 font-bold text-lg mb-2">❌ Error</h2>
                <p className="text-red-800 mb-4">{error}</p>
                <p className="text-red-700 text-sm">Try searching for another user or check the username spelling</p>
            </div>
        </div>
    </div>
)

if (!data) return (
    <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto p-6">
            <SearchBar />
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-8">
                <p className="text-yellow-800">No data available</p>
            </div>
        </div>
    </div>
)
    const languageData = Object.entries(data.languages).map(([name, value]) => ({
        name,
        value
    }))
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto p-6">
                <SearchBar />
                {/* Profile Section */}
                <ProfileCard
                    avatar={data.avatar_url}
                    name={data.name}
                    username={data.username}
                    followers={data.followers}
                    following={data.following}
                    public_repos={data.public_repos}
                    profile_url={data.profile_url}
                />

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
                    <StatsCard title="Repositories" value={data.public_repos} />
                    <StatsCard title="Total Stars" value={data.total_stars} />
                    <StatsCard title="Total Forks" value={data.total_forks} />
                    <StatsCard title="Top Language" value={Object.keys(data.languages)[0] || "N/A"} />
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                    {/* Languages Chart */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Languages</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={languageData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, value }: { name?: string; value?: number }) => `${name}: ${value}`}
                                    outerRadius={80}
                                    dataKey="value"
                                >
                                    {languageData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Top Repos Summary */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Top Repositories</h2>
                        <div className="space-y-3">
                            {data.top_repositories.map((repo: any) => (
                                <div key={repo.name} className="border-b pb-3">
                                    <a href={repo.url} rel="noopener noreferrer" target="_blank" className="font-semibold text-blue-600 hover:underline">
                                        {repo.name}
                                    </a>
                                    <div className="flex gap-4 text-sm text-gray-600 mt-1">
                                        <span>⭐ {repo.stars}</span>
                                        <span>🍴 {repo.forks}</span>
                                        <span>💻 {repo.language}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}