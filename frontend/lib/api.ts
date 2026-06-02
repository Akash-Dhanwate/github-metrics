const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
const CACHE_TTL_MS = 60_000
const MAX_CACHE_ITEMS = 50

type CacheEntry<T> = {
  expiresAt: number
  promise?: Promise<T>
  value?: T
}

const getCache = new Map<string, CacheEntry<unknown>>()

function setCacheEntry<T>(key: string, entry: CacheEntry<T>) {
  getCache.set(key, entry)

  while (getCache.size > MAX_CACHE_ITEMS) {
    const oldestKey = getCache.keys().next().value
    if (!oldestKey) break
    getCache.delete(oldestKey)
  }
}

export async function apiGet<T>(path: string, ttlMs = CACHE_TTL_MS): Promise<T> {
  const key = path
  const now = Date.now()
  const cached = getCache.get(key) as CacheEntry<T> | undefined

  if (cached && cached.expiresAt > now) {
    if (cached.value !== undefined) return cached.value
    if (cached.promise) return cached.promise
  }

  const promise = fetch(`${API_URL}${path}`).then(async (response) => {
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`)
    }

    return response.json() as Promise<T>
  })

  setCacheEntry(key, { expiresAt: now + ttlMs, promise })

  try {
    const value = await promise
    setCacheEntry(key, { expiresAt: Date.now() + ttlMs, value })
    return value
  } catch (error) {
    getCache.delete(key)
    throw error
  }
}

export async function getGithubAnalytics(username: string) {
  return apiGet(`/github_analytics/${username}`)
}
