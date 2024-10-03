from pydantic import BaseModel

class User(BaseModel):
    name: str
    age: int
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str


    