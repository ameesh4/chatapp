from ..model import Chats
from ..database import connect
from ..utils import get_current_date_time

async def insert_chat(chat: Chats):
    try:
        time = get_current_date_time()
        db = connect()
        cursor = db.cursor()
        sql = "INSERT INTO chats (sender, receiver, message, roomid, date_time) VALUES (%s, %s, %s, %s, %s)"
        values = (chat.sender, chat.receiver, chat.message, chat.roomid, time)
        cursor.execute(sql, values)
        db.commit()
        return {
            "status": 200,
            "message": "Chat inserted successfully"
        }
    except Exception as e:
        raise e
    finally:
        cursor.close()
        db.close()


async def get_chats(roomid: int):
    try:
        db = connect()
        cursor = db.cursor()
        cursor.execute("SELECT * FROM chats WHERE roomid = %s", (roomid,))
        chats = cursor.fetchall()
        response = []
        for chat in chats:
            temp = {
                "chatid": chat[0],
                "sender": chat[1],
                "receiver": chat[2],
                "message": chat[3],
                "date_time": chat[5]
            }
            response.append(temp)

        return response
    except Exception as e:
        raise e