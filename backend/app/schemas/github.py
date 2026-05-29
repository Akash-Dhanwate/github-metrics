from pydantic import BaseModel
from typing import List , Dict , Optional

class UserResponse(BaseModel):
    username: str
    name: Optional[str]
    followers: int
    following: int
    public_repos: int
    profile_url: str
    avatar: str

class RepositoryResponse(BaseModel):
    name: str
    stars: int
    forks: int
    language: Optional[str]
    repo_url:str

class GitHubStatsResponse(BaseModel):
    username: str
    total_repositories: int
    total_stars: int
    total_forks: int
    most_used_language: Optional[str]