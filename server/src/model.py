from pydantic import BaseModel

class User(BaseModel):
    name: str
    age: int
    email: str
    password: str

class UserEmail(BaseModel):
    email: str

class UserLogin(BaseModel):
    email: str
    password: str

class Chats(BaseModel):
    roomid: int
    sender: str
    receiver: str
    message: str

class ChatRoom(BaseModel):
    user1: str
    user2: str

class Token(BaseModel):
    token: str

class UserDetail(BaseModel):
    id: int
    name: str
    age: int
    email: str

class ChatId(BaseModel):
    chatid: int

    