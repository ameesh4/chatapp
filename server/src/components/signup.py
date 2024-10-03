from ..model import User
import re
from src.database import connect
import bcrypt



async def signup(user: User):
    if user.name == None and user.age == None and user.email == None and user.password == None:
       raise Exception("All fields are required")

    if not check_email(user.email):
        raise Exception("Invalid email address")

    if not check_password(user.password):
        raise Exception("Password must be at least 8 characters long and contain at least one letter and one number")
    
    try:
        db_connect = connect()
        cursor = db_connect.cursor()
        sql = "INSERT INTO users (name, age, email, password) VALUES (%s, %s, %s, %s)"
        val = (user.name, user.age, user.email, hash_pw(user.password))
        cursor.execute(sql, val)
        db_connect.commit()
        return {
            "status": "success",
            "code": 200,
            "message": "User created successfully"
        }
    except Exception as e:
        if "Duplicate entry" in str(e):
            raise Exception("User already exists")
        else:
            print(e)
    finally:
        cursor.close()
        db_connect.close()




def check_email(email: str) -> bool:
    email_regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b'
    
    if re.match(email_regex, email):
        return True
    else:
        return False




def check_password(password: str) -> bool:
    pass_regex = r'^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$'

    if re.match(pass_regex, password):
        return True
    else:
        return False
    



def hash_pw(password: str)-> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')





def match_pw(password: str, hashed_pw: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed_pw.encode('utf-8'))

