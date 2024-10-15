from datetime import datetime
from src.model import UserDetail
from .database import connect

class obj:
    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

def dict_to_obj(d):
    return obj(**d)


async def get_user_by_email(email):
    try:
        db = connect()
        cursor = db.cursor()
        cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()
        detail: UserDetail = {
            "id": user[0],
            "name": user[1],
            "age": user[2],
            "email": user[4],
        }
        return detail
    except Exception as e:
        raise e
    finally:
        cursor.close()
        db.close()


def get_current_date_time():
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")