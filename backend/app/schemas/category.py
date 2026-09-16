from pydantic import BaseModel, Field


class CategoryRead(BaseModel):
    id: str
    label: str
    bg: str
    text: str

    model_config = {"from_attributes": True}


class CategoryCreate(BaseModel):
    label: str = Field(min_length=1, max_length=50)
    bg: str = Field(min_length=1, max_length=20)
    text: str = Field(min_length=1, max_length=20)
