from pydantic import BaseModel
class LanguageResponse(BaseModel):
    languages : dict[str , int]