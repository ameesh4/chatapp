from fastapi import APIRouter

from src.utils import get_user_by_email
from .model import ChatId, Chats, User, UserEmail, UserLogin
from .components.signup import signup
from .components.signin import signin
from .components.chat_room import create_chat_room, get_chat_room, get_chat_room_by_id
from .model import ChatRoom, Token
from .components.chats import get_chats, insert_chat
from .components.jwt_token import verify_token

router = APIRouter()

@router.post("/signup")
async def signup_handler(user: User):
    try:
        return await signup(user)
    except Exception as e:
        return {"error": str(e)}
    
@router.post("/signin")
async def signin_handler(user: UserLogin):
    try:
        return await signin(user)
    except Exception as e:
        return {"error": str(e)}


@router.post("/")
async def root():
    return {"message": "Hello World"}
    

@router.post('/create_chat_room')
async def create_chat_room_handler(chat_room: ChatRoom):
    try:
        return await create_chat_room(chat_room)
    except Exception as e:
        return {"error": str(e)}


@router.post("/get_email_by_token")
async def get_email_by_token(token: Token):
    try:
        email = await verify_token(token.token)
        return email
    except Exception as e:
        return {"error": str(e)}
    

@router.post("/get_user_by_email")
async def get_user_by_email_handler(email: UserEmail):
    try:
        return await get_user_by_email(email.email)
    except Exception as e:
        return {"error": str(e)}
    
    
@router.post("/get_chat_room")
async def get_chat_room_handler(user: UserEmail):
    try:
        return await get_chat_room(user)
    except Exception as e:
        return {"error": str(e)}
    
@router.post("/message")
async def handle_message(chat: Chats):
    try:
        return await insert_chat(chat)
    except Exception as e:
        return {"error": str(e)}
    
@router.post("/get_chatroom_details")
async def get_chatroom_details(user: ChatId):
    try:
        return await get_chat_room_by_id(user.chatid)
    except Exception as e:
        return {"error": str(e)}
    
@router.post("/get_chats")
async def get_chats_handler(chatroom: ChatId):
    try:
        return await get_chats(chatroom.chatid)
    except Exception as e:
        return {"error": str(e)}