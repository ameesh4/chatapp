import jwt
import os
from ..model import UserLogin
from dotenv import load_dotenv
import json

load_dotenv()


def create_token(email: str):
    return jwt.encode({"email": email}, os.getenv("SECRET_KEY"), algorithm="HS256")
    

async def verify_token(token: str):
    try:
        return jwt.decode(token, os.getenv("SECRET_KEY"), algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        raise Exception("Token has expired")
    except jwt.InvalidTokenError:
        raise Exception("Invalid token")
    