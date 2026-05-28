from fastapi import APIRouter
from app.schemas.language import LanguageResponse
from app.services.github_service import get_user_repositories , get_user


router = APIRouter()
# ==================== info about the user ( followers , following , etc) ======================

@router.get("/github/{username}")
def get_github_user(username: str):
    data = get_user(username)
    if data is None:
        return {"error": "User not found"}
    return {
        "username": data["login"],
        "name": data["name"],
        "followers": data["followers"],
        "following": data["following"],
        "public_repos": data["public_repos"],
        "profile_url": data["html_url"],
        "avatar": data["avatar_url"]
    }
# ================== info fo repoes ===================================

@router.get("/github/{username}/repos")
def get_user_repos(username : str):
    repos = get_user_repositories(username)
    if repos is None:
        return {"error" : "Repositories not found"}
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
    if repos is None:
        return {"error" : "repositories not found"}
    total_stars = 0
    for repo in repos:
        total_stars += repo["stargazers_count"]
    return {
        "username" : username , 
        "total_star" : total_stars
    }

# ====================== languages analytics =====================================

@router.get("/languages/{username}" , 
            response_model = LanguageResponse
            )
async def get_languages(username : str):
    repos = get_user_repositories(username)
    if repos is None:
        return {"error": "repositories not found"}
    language_count = {}
    for repo in repos:
        lang = repo["language"]
        if lang is None:
            continue
        if lang in language_count:
            language_count[lang] += 1
        else:
            language_count[lang] = 1

    return {
        "languages" : language_count
    }

# ========== top repositories ================================================

@router.get("/top_repositories/{username}")

async def get_top_repositories(username : str):
    repos = get_user_repositories(username)
    if repos is None:
        return {"error" : "repositories not found"}
    sorted_repos = sorted(
        repos , 
        key = lambda repo : repo["stargazers_count"],
        reverse=True
    )
    top_repos = sorted_repos[:5]
    repository_data = []
    for repo in top_repos:
        repository_data.append({
            "name" : repo["name"],
            "stars" : repo["stargazers_count"],
            "forks" : repo["forks_count"],
            "language" :repo["language"]
        })
    return {
        "top_repositories" :repository_data
    }

# ============== total forks ================================
@router.get("/github/{username}/total-forks")
def get_total_forks(username : str):
    repos = get_user_repositories(username)
    if repos is None:
        return { "error" : "repositories not found"}
    total_forks = 0
    for repo in repos:
        total_forks += repo["forks_count"]
    return {
        "total_forks" : total_forks
    }



    
    