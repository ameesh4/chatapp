from fastapi import APIRouter
from .model import User, UserLogin
from .components.signup import signup
from .components.signin import signin

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