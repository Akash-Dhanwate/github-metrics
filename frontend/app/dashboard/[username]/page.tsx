"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"

import StatsCard from "@/components/ui/StatsCard"
import ProfileCard from "@/components/ui/ProfileCard"

export default function DashboardPage() {
    const params = useParams()

    const [user, setUser] = useState<any>(null)
    const [stats , setStats] = useState<any>(null)
    const [repos , setRepos] = useState<any>(null)

    useEffect(() => {
        async function fetchUser() {
            try {
                console.log("Fetching user:", params.username)

                const response = await fetch(
                    `http://127.0.0.1:8000/github/${params.username}`
                )

                const data = await response.json()

                console.log("User data:", data)

                setUser(data)
            } catch (error) {
                console.error("Fetch Error:", error)
            }
        }

        if (params.username) {
            fetchUser()
        }
    }, [params.username])

    useEffect(() => {
        async function fetchUserStats() {
            try{
                console.log("Fetching User:" , params.username)
                const response = await fetch(`http://127.0.0.1:8000/github-stats/${params.username}`)
                const stats = await response.json()
                console.log("User Stats:" , stats)
                setStats(stats)
            } catch (error) {
                console.error("Fetch Error:" , error)
            }
        }
        if (params.username){
            fetchUserStats()
        }
    },[params.username])
    
    useEffect(() =>{
        async function fetchTopRepos() {
            try{
                console.log("Fetch User Info:" , params.username)
                const response = await fetch(`http://127.0.0.1:8000/top_repositories/${params.username}`)
                const repos =await response.json()
                console.log("User repo Data :" , repos) 
                setRepos(repos)
            } catch (error) {
                console.error("Fetch Error:" , error)
            }
        }
        if (params.username){
            fetchTopRepos()
        }  
    } , [params.username])

        if (!stats || !user || !repos ) {
            return <div>Lodding...</div>
        }

    return (
        <div className="p-6">
            <div className="border rounded-lg p-4 mb-6">
                Profile Section
            </div>

            <ProfileCard
                avatar={user.avatar}
                name={user.name}
                username={user.username}
                followers={user.followers}
                following={user.following}
                public_repos={user.public_repos}
                profile_url={user.profile_url}
            />

            <div className="flex gap-4 mt-6">
                <StatsCard
                    title="Total Repositories"
                    value={stats.total_repositories}
                />
                <StatsCard
                    title="Total Stars"
                    value={stats.total_stars}
                />
                <StatsCard
                    title="Total Forks"
                    value={stats.total_forks}
                />
                <StatsCard
                    title="Most Used Language"
                    value={stats.most_used_language}
                />
            </div>

            <div className="border rounded-lg p-4 mt-6">
                <h1>Top Repositories Sectio</h1>
                <StatsCard 
                title="Top Repositories"
                value={repos.top_repositories} 
                />
            </div>

            <div className="border rounded-lg p-4 mt-6">
                Language Analytics Section
            </div>
        </div>
    )
}