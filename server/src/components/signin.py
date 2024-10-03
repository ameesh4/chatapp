from src.model import UserLogin
from src.database import connect
from .signup import match_pw
from .jwt_token import create_token

async def signin(user: UserLogin):
    if user.email == None and user.password == None:
        raise Exception("All fields are required")
    
    try:
        db_connect = connect()
        cursor = db_connect.cursor()
        sql = f"SELECT * FROM users WHERE email = '{user.email}'"
        cursor.execute(sql)
        result = cursor.fetchone()
        if not result:
            raise Exception("User not found")
        
        if not match_pw(user.password, result[3]):
            raise Exception("Incorrect password")
        
        jwt = create_token(user.email)
        return {
            "status": "success",
            "code": 200,
            "message": "User logged in successfully",
            "token": jwt
        }
        
    except Exception as e:
        raise e

  

    

