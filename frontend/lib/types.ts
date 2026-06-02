export interface Repository {
  name: string
  owner?: string
  url?: string
  description?: string
  language?: string
  stars?: number
  forks?: number
  avatar?: string
  size?: number
  license?: string
  open_issues?: number
}

export interface GithubProfile {
  avatar_url: string
  name?: string
  username: string
  followers: number
  following: number
  public_repos: number
  profile_url: string
  bio?: string
  company?: string
  location?: string
  blog?: string
  total_stars?: number
  total_forks?: number
  languages?: Record<string, number>
  top_repositories?: Repository[]
}

export interface Badge {
  icon: string
  name: string
  desc?: string
}

export interface TrendingUser {
  username: string
  name: string
  avatar: string
}

export interface ContributionDay {
  date: string
  contributionCount: number
}

export interface ContributionWeek {
  contributionDays: ContributionDay[]
}

export interface ContributionCalendar {
  totalContributions: number
  weeks: ContributionWeek[]
}

export interface ContributionsResponse {
  username: string
  contributions?: {
    data?: {
      user?: {
        contributionsCollection?: {
          contributionCalendar?: ContributionCalendar
        }
      }
    }
  }
  badges?: Badge[]
}
