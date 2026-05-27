from fastapi import APIRouter
import requests

router = APIRouter()
# ==================== info about the user ( followers , following , etc) ======================

@router.get("/github/{username}")
def get_github_user(username: str):
    url = f"https://api.github.com/users/{username}"

    response = requests.get(url)

    if response.status_code != 200:
        return {"error": "User not found"}

    data = response.json()

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
    url = f"https://api.github.com/users/{username}/repos"
    response = requests.get(url)
    if response.status_code != 200:
        return {"Error : Repositories not found"}
    repos = response.json()
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