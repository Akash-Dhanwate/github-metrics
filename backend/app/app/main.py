from fastapi import FastAPI
from app.routes.github import router as github_router

app = FastAPI()

app.include_router(github_router)

@app.get("/")
def home():
    return {"message": "Backend running"}

@app.get("/health")
def health():
    return {"status": "ok"}