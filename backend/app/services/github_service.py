import os
import requests
from collections import OrderedDict
from datetime import date, timedelta
from dotenv import load_dotenv
from threading import Lock
from time import monotonic

# Load environment variables
load_dotenv()

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

if not GITHUB_TOKEN:
    raise ValueError("GITHUB_TOKEN not found in .env file")

# Create reusable session
session = requests.Session()

session.headers.update({
    "Authorization": f"Bearer {GITHUB_TOKEN}",
    "Accept": "application/vnd.github+json"
})

REQUEST_TIMEOUT_SECONDS = 10
MAX_CACHE_ITEMS = 256
DEFAULT_CACHE_TTL_SECONDS = 300
TRENDING_CACHE_TTL_SECONDS = 1800
CONTRIBUTIONS_CACHE_TTL_SECONDS = 900
MAX_REPO_PAGES = 3

_cache = OrderedDict()
_cache_lock = Lock()


def _cache_get(key):
    now = monotonic()
    with _cache_lock:
        entry = _cache.get(key)
        if not entry:
            return None

        expires_at, value = entry
        if expires_at <= now:
            _cache.pop(key, None)
            return None

        _cache.move_to_end(key)
        return value


def _cache_set(key, value, ttl=DEFAULT_CACHE_TTL_SECONDS):
    with _cache_lock:
        _cache[key] = (monotonic() + ttl, value)
        _cache.move_to_end(key)

        while len(_cache) > MAX_CACHE_ITEMS:
            _cache.popitem(last=False)


def _github_get_json(url, *, params=None):
    response = session.get(url, params=params, timeout=REQUEST_TIMEOUT_SECONDS)
    print_rate_limit(response)

    if response.status_code == 404:
        return {"error": "User not found"}

    if response.status_code == 403:
        return {
            "error": "Rate limit exceeded",
            "remaining": response.headers.get("X-RateLimit-Remaining"),
            "reset": response.headers.get("X-RateLimit-Reset")
        }

    if response.status_code != 200:
        return {"error": f"GitHub API Error: {response.status_code}"}

    return response.json()


def print_rate_limit(response):
    remaining = response.headers.get("X-RateLimit-Remaining")
    limit = response.headers.get("X-RateLimit-Limit")

    print(f"Rate Limit Remaining: {remaining}")
    print(f"Rate Limit Limit: {limit}")


def get_user(username: str):
    username = username.strip()
    cache_key = ("user", username.lower())
    cached = _cache_get(cache_key)
    if cached is not None:
        return cached

    data = _github_get_json(f"https://api.github.com/users/{username}")
    _cache_set(cache_key, data)
    return data


def _get_user_repositories_page(username: str, page: int):
    cache_key = ("repos-page", username.lower(), page)
    cached = _cache_get(cache_key)
    if cached is not None:
        return cached

    data = _github_get_json(
        f"https://api.github.com/users/{username}/repos",
        params={
            "per_page": 100,
            "page": page,
            "sort": "updated",
            "direction": "desc"
        }
    )
    _cache_set(cache_key, data)
    return data


def get_user_repositories(username: str):
    username = username.strip()
    cache_key = ("repos", username.lower())
    cached = _cache_get(cache_key)
    if cached is not None:
        return cached

    repos = []
    for page in range(1, MAX_REPO_PAGES + 1):
        page_data = _get_user_repositories_page(username, page)
        if isinstance(page_data, dict) and "error" in page_data:
            return page_data

        if not page_data:
            break

        repos.extend(page_data)

        if len(page_data) < 100:
            break

    _cache_set(cache_key, repos)
    return repos


# Analytics Helper Functions

def calculate_total_stars(repos):
    return sum(repo["stargazers_count"] for repo in repos)


def calculate_total_forks(repos):
    return sum(repo["forks_count"] for repo in repos)


def calculate_language_frequency(repos):
    language_count = {}

    for repo in repos:
        language = repo.get("language")

        if not language:
            continue

        language_count[language] = (
            language_count.get(language, 0) + 1
        )

    return language_count


def get_top_repos(repos, limit=5):
    return sorted(
        repos,
        key=lambda repo: repo["stargazers_count"],
        reverse=True
    )[:limit]


def get_user_analytics(username: str):
    username = username.strip()
    cache_key = ("analytics", username.lower())
    cached = _cache_get(cache_key)
    if cached is not None:
        return cached

    user = get_user(username)

    if "error" in user:
        return user

    repos = get_user_repositories(username)

    if isinstance(repos, dict) and "error" in repos:
        return repos

    top_repos = get_top_repos(repos)

    analytics = {
        "username": user["login"],
        "name": user["name"],
        "bio": user["bio"],
        "company": user["company"],
        "location": user["location"],
        "followers": user["followers"],
        "following": user["following"],
        "public_repos": user["public_repos"],
        "avatar_url": user["avatar_url"],
        "profile_url": user["html_url"],
        "created_at": user["created_at"],
        "total_stars": calculate_total_stars(repos),
        "total_forks": calculate_total_forks(repos),
        "languages": calculate_language_frequency(repos),
        "top_repositories": [
            {
                "name": repo["name"],
                "description": repo["description"],
                "language": repo["language"],
                "stars": repo["stargazers_count"],
                "forks": repo["forks_count"],
                "watchers": repo["watchers_count"],
                "open_issues": repo["open_issues_count"],
                "url": repo["html_url"]
            }
            for repo in top_repos
        ]
    }

    _cache_set(cache_key, analytics)
    return analytics

def get_user_contribution_data(username: str):
    """Get user's contribution data from GitHub GraphQL"""
    username = username.strip()
    cache_key = ("contributions", username.lower())
    cached = _cache_get(cache_key)
    if cached is not None:
        return cached

    query = """
    query($login: String!) {
      user(login: $login) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
      }
    }
    """
    
    headers = {
        "Authorization": f"Bearer {GITHUB_TOKEN}",
        "Content-Type": "application/json"
    }
    
    response = session.post(
        "https://api.github.com/graphql",
        json={"query": query, "variables": {"login": username}},
        headers=headers,
        timeout=REQUEST_TIMEOUT_SECONDS
    )
    
    if response.status_code == 200:
        data = response.json()
        _cache_set(cache_key, data, CONTRIBUTIONS_CACHE_TTL_SECONDS)
        return data
    return None

def get_trending_repositories():
    """Get trending repositories from GitHub search"""
    cache_key = ("trending", "repositories")
    cached = _cache_get(cache_key)
    if cached is not None:
        return cached

    url = "https://api.github.com/search/repositories"
    since = (date.today() - timedelta(days=30)).isoformat()
    
    # Search for repos with most stars created in last 30 days
    params = {
        "q": f"stars:>1000 created:>{since}",
        "sort": "stars",
        "order": "desc",
        "per_page": 10
    }
    
    response = session.get(url, params=params, timeout=REQUEST_TIMEOUT_SECONDS)
    
    if response.status_code == 200:
        repos = response.json().get("items", [])
        result = [
            {
                "name": repo["name"],
                "owner": repo["owner"]["login"],
                "description": repo["description"],
                "stars": repo["stargazers_count"],
                "forks": repo["forks_count"],
                "language": repo["language"],
                "url": repo["html_url"],
                "avatar": repo["owner"]["avatar_url"]
            }
            for repo in repos
        ]
        _cache_set(cache_key, result, TRENDING_CACHE_TTL_SECONDS)
        return result
    return []


def get_trending_users():
    """Get trending users from GitHub search"""
    cache_key = ("trending", "users")
    cached = _cache_get(cache_key)
    if cached is not None:
        return cached

    url = "https://api.github.com/search/users"
    
    # Search for users with most followers
    params = {
        "q": "followers:>1000",
        "sort": "followers",
        "order": "desc",
        "per_page": 6
    }
    
    response = session.get(url, params=params, timeout=REQUEST_TIMEOUT_SECONDS)
    
    if response.status_code == 200:
        users = response.json().get("items", [])
        result = [
            {
                "username": user["login"],
                "avatar": user["avatar_url"],
                "profile_url": user["html_url"]
            }
            for user in users
        ]
        _cache_set(cache_key, result, TRENDING_CACHE_TTL_SECONDS)
        return result
    return []

def get_repo_insights(username: str, repo_name: str):
    """Get detailed insights about a repository"""
    cache_key = ("repo", username.lower(), repo_name.lower())
    cached = _cache_get(cache_key)
    if cached is not None:
        return cached

    url = f"https://api.github.com/repos/{username}/{repo_name}"
    
    response = session.get(url, timeout=REQUEST_TIMEOUT_SECONDS)
    if response.status_code != 200:
        return None
    
    repo = response.json()
    
    result = {
        "name": repo["name"],
        "description": repo["description"],
        "url": repo["html_url"],
        "stars": repo["stargazers_count"],
        "forks": repo["forks_count"],
        "watchers": repo["watchers_count"],
        "open_issues": repo["open_issues_count"],
        "language": repo["language"],
        "created_at": repo["created_at"],
        "updated_at": repo["updated_at"],
        "size": repo["size"],
        "default_branch": repo["default_branch"],
        "is_fork": repo["fork"],
        "topics": repo["topics"],
        "license": repo["license"]["name"] if repo["license"] else None,
        "has_wiki": repo["has_wiki"],
        "has_issues": repo["has_issues"],
    }

    _cache_set(cache_key, result)
    return result

def get_user_badges(username: str):
    """Get user achievements/badges"""
    username = username.strip()
    cache_key = ("badges", username.lower())
    cached = _cache_get(cache_key)
    if cached is not None:
        return cached

    user_data = get_user(username)
    if not user_data or "error" in user_data:
        return []
    
    repos = get_user_repositories(username)
    if isinstance(repos, dict) and "error" in repos:
        repos = []

    badges = []
    
    # Follower badges
    followers = user_data.get("followers", 0)
    if followers >= 10000:
        badges.append({"name": "Legend", "icon": "🏆", "color": "gold", "desc": "10000+ followers"})
    elif followers >= 1000:
        badges.append({"name": "Popular", "icon": "⭐", "color": "blue", "desc": "1000+ followers"})
    elif followers >= 100:
        badges.append({"name": "Recognized", "icon": "👤", "color": "green", "desc": "100+ followers"})
    
    # Repository badges
    if repos and not isinstance(repos, dict):
        total_stars = sum(r.get("stargazers_count", 0) for r in repos)
        
        if total_stars >= 10000:
            badges.append({"name": "Star Legend", "icon": "✨", "color": "gold", "desc": "10000+ stars"})
        elif total_stars >= 1000:
            badges.append({"name": "Star Collector", "icon": "⭐", "color": "blue", "desc": "1000+ stars"})
        
        if len(repos) >= 100:
            badges.append({"name": "Prolific", "icon": "📦", "color": "purple", "desc": "100+ repos"})
        elif len(repos) >= 50:
            badges.append({"name": "Productive", "icon": "📦", "color": "blue", "desc": "50+ repos"})
    
    # Profile badges
    if user_data.get("bio"):
        badges.append({"name": "Bio Master", "icon": "📝", "color": "green", "desc": "Has a bio"})
    
    if user_data.get("company"):
        badges.append({"name": "Professional", "icon": "💼", "color": "blue", "desc": "Works at a company"})
    
    if user_data.get("blog"):
        badges.append({"name": "Blogger", "icon": "📚", "color": "green", "desc": "Has a blog"})

    if user_data.get("location"):
        badges.append({"name": "Explorer", "icon": "🗺️", "desc": "Location set"})

     # Contribution badges
    repos_with_desc = [r for r in repos if isinstance(repos, list) and r.get("description")]
    if len(repos_with_desc) >= 10:
        badges.append({"name": "Documentor", "icon": "📖", "desc": "10+ repos with description"})
    
    # Language badges
    languages = calculate_language_frequency(repos)
    if len(languages) >= 5:
        badges.append({"name": "Polyglot", "icon": "🌍", "desc": "5+ languages used"})

    _cache_set(cache_key, badges, CONTRIBUTIONS_CACHE_TTL_SECONDS)
    return badges


# Test
if __name__ == "__main__":
    username = "torvalds"

    data = get_user_analytics(username)

    from pprint import pprint
    pprint(data)
