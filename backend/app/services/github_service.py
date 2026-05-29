import requests

def get_user_repositories(username : str):
    url = f"https://api.github.com/users/{username}/repos"
    response = requests.get(url)
    if response.status_code != 200:
        return None
    return response.json()

def get_user(username : str):
    url = f"https://api.github.com/users/{username}" 
    response = requests.get(url)
    if response.status_code != 200:
        return None
    return response.json()


# helper function 

def calculate_total_stars(repos: list) -> int:
    total = 0
    for repo in repos:
        total += repo["stargazers_count"]
    return total

def calculate_total_forks(repos: list) -> int:
    total = 0 
    for repo in repos:
        total += repo["forks_count"]
    return total

def calculate_language_frequency(repos: list) -> dict:
    language_count = {}
    for repo in repos:
        lang = repo["language"]
        if lang is None:
            continue
        language_count[lang] = language_count.get(lang, 0) + 1
    return language_count

def get_top_repos(repos: list, limit: int = 5) -> list:
    return sorted(repos, key=lambda r: r["stargazers_count"], reverse=True)[:limit]