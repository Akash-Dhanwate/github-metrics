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