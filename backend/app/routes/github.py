from fastapi import APIRouter, HTTPException
from app.schemas.language import LanguageResponse
from app.services.github_service import (
    calculate_total_stars,
    calculate_total_forks,
    calculate_language_frequency,
    get_top_repos,
    get_user_repositories,
    get_user,
    get_user_analytics,
    get_user_contribution_data,
    get_user_badges,
    get_trending_repositories,
    get_trending_users,
    get_repo_insights
)
from app.schemas.github import UserResponse



router = APIRouter()


def _raise_if_repo_error(repos):
    if isinstance(repos, dict) and "error" in repos:
        raise HTTPException(status_code=404, detail=repos["error"])
    if repos is None:
        raise HTTPException(status_code=404, detail="Repositories not found")


# ==================== info about the user ( followers , following , etc) ======================

@router.get("/github/{username}", response_model=UserResponse)
def get_github_user(username: str):
    data = get_user(username)
    
    if data is None or "error" in data:
        raise HTTPException(status_code=404, detail="User not found")
    
    return UserResponse(
        username=data["login"],
        name=data["name"],
        followers=data["followers"],
        following=data["following"],
        public_repos=data["public_repos"],
        profile_url=data["html_url"],
        avatar=data["avatar_url"]
    )
# ================== info fo repoes ===================================

@router.get("/github/{username}/repos")
def get_user_repos(username : str):
    repos = get_user_repositories(username)
    _raise_if_repo_error(repos)
    repo_list = []
    for repo in repos:
        repo_data = {
            "name" : repo["name"], 
            "stars" : repo["stargazers_count"], 
            "forks" : repo["forks_count"],
            "language" : repo["language"],
            "repo_url" : repo["html_url"]               
            }
        repo_list.append(repo_data)
    return {
        "username" : username,
        "total_repositories" : len(repo_list),
        "repositories" : repo_list
    }

# =================== totoal github stars analytics ==============================

@router.get("/github/{username}/total-stars")
def get_total_stars(username : str):
    repos = get_user_repositories(username)
    _raise_if_repo_error(repos)
    return {
        "username": username , 
        "total_star": calculate_total_stars(repos)
    }

# ====================== languages analytics =====================================

@router.get("/languages/{username}" , 
            response_model = LanguageResponse
            )
def get_languages(username : str):
    repos = get_user_repositories(username)
    _raise_if_repo_error(repos)


    return {
        "languages": calculate_language_frequency(repos)
    }

# ========== top repositories ================================================

@router.get("/top_repositories/{username}")

def get_top_repositories(username : str):
    repos = get_user_repositories(username)
    _raise_if_repo_error(repos)
    sorted_repos = sorted(
        repos , 
        key = lambda repo : repo["stargazers_count"],
        reverse=True
    )
    top_repos = sorted_repos[:5]
    repository_data = []
    for repo in top_repos:
        repository_data.append({
            "name": repo["name"],
            "stars": repo["stargazers_count"],
            "forks": repo["forks_count"],
            "language": repo["language"],
            "url": repo["html_url"]
        })
    return {
        "top_repositories": repository_data[:5]
    }

# ============== total forks ================================
@router.get("/github/{username}/total-forks")
def get_total_forks(username : str):
    repos = get_user_repositories(username)
    _raise_if_repo_error(repos)
    return {
        "total_forks" : calculate_total_forks(repos)
    }

# ======================= github stats ============================

@router.get("/github-stats/{username}")
def get_github_stats(username : str):
    """
    Get comprehensive GitHub statistics for a user.
    
    Processes all repositories and returns:
    - Total stars and forks
    - Most used programming language
    """
    repos = get_user_repositories(username)
    _raise_if_repo_error(repos)
    language_count = {}
    for repo in repos:
        lang = repo["language"]
        if lang is None:
            continue
        if lang in language_count:
            language_count[lang] += 1
        else:
            language_count[lang] = 1

    most_used_language = max(
        language_count ,
        key = language_count.get
    ) if language_count else None
    return {
        "username": username,
        "total_repositories": len(repos),
        "total_stars": calculate_total_stars(repos),
        "total_forks": calculate_total_forks(repos),
        "most_used_language": most_used_language
    }

@router.get("/github_analytics/{username}")
def github_analytics(username: str):
    return get_user_analytics(username)
         
@router.get("/github/{username}/contributions")
def get_contributions(username: str):
    data = get_user_contribution_data(username)
    badges = get_user_badges(username)
    
    return {
        "username": username,
        "contributions": data,
        "badges": badges
    }
    
@router.get("/trending/repositories")
def get_trending_repos():
    """Get trending repositories"""
    repos = get_trending_repositories()
    return {"repositories": repos}


@router.get("/trending/users")
def get_trending_users_endpoint():
    """Get trending users"""
    users = get_trending_users()
    return {"users": users}

@router.get("/repo/{username}/{repo_name}")
def get_repo_details(username: str, repo_name: str):
    """Get repository insights"""
    insights = get_repo_insights(username, repo_name)
    if not insights:
        raise HTTPException(status_code=404, detail="Repository not found")
    return insights
