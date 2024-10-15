from datetime import datetime

from ..utils import get_current_date_time
from ..model import ChatRoom, UserEmail
from ..database import connect, check_user
from ..model import User

async def create_chat_room(chat_room: ChatRoom):
    if chat_room.user1 == chat_room.user2:
        raise Exception("User1 and User2 cannot be the same")
    
    if chat_room.user1 == "" or chat_room.user2 == "":
        raise Exception("User1 and User2 cannot be empty")
    
    try:
        db = connect()
        cursor = db.cursor()
        time = get_current_date_time()
        if not check_user(chat_room.user1) or not check_user(chat_room.user2):
            raise Exception("User does not exist")
        
        cursor.execute("SELECT * FROM chatroom WHERE (user1 = %s AND user2 = %s) OR (user1 = %s AND user2 = %s)", (chat_room.user1, chat_room.user2, chat_room.user2, chat_room.user1))
        chat_room_exists = cursor.fetchone()
        if chat_room_exists:
            raise Exception("Chat room already exists")
        
        cursor.execute("INSERT INTO chatroom (user1, user2, date_time) VALUES (%s, %s, %s)", (chat_room.user1, chat_room.user2, time))
        db.commit()
        return {
            "status": 200,
            "message": "Chat room created successfully"
            }
    except Exception as e:
        raise e
    
    finally:
        cursor.close()
        db.close()


async def get_chat_room(user: UserEmail):
    try:
        db = connect()
        cursor = db.cursor()
        cursor.execute("SELECT * FROM chatroom WHERE user1 = %s OR user2 = %s", (user.email, user.email))
        chat_rooms = cursor.fetchall()
        return chat_rooms
    except Exception as e:
        raise e
    finally:
        cursor.close()
        db.close()


async def get_chat_room_by_id(chat_room_id: int):
    try:
        db = connect()
        cursor = db.cursor()
        cursor.execute("SELECT * FROM chatroom WHERE roomid = %s", (chat_room_id, ))
        chat_room = cursor.fetchone()
        return {
            "id": chat_room[0],
            "user1": chat_room[1],
            "user2": chat_room[2],
            "date_time": chat_room[3]
        }
    except Exception as e:
        raise e
    finally:
        cursor.close()
        db.close()






