import os
import requests
from dotenv import load_dotenv

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


def print_rate_limit(response):
    remaining = response.headers.get("X-RateLimit-Remaining")
    limit = response.headers.get("X-RateLimit-Limit")

    print(f"Rate Limit Remaining: {remaining}")
    print(f"Rate Limit Limit: {limit}")


def get_user(username: str):
    url = f"https://api.github.com/users/{username}"

    response = session.get(url)

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


def get_user_repositories(username: str):
    url = f"https://api.github.com/users/{username}/repos"

    response = session.get(url)

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
    user = get_user(username)

    if "error" in user:
        return user

    repos = get_user_repositories(username)

    if isinstance(repos, dict) and "error" in repos:
        return repos

    top_repos = get_top_repos(repos)

    return {
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


# Test
if __name__ == "__main__":
    username = "torvalds"

    data = get_user_analytics(username)

    from pprint import pprint
    pprint(data)