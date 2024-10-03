import mysql.connector
from dotenv import load_dotenv
import os

load_dotenv()

def connect():
    try:
        return mysql.connector.connect(
            host="localhost",
            user = os.getenv("DB_USER"),
            password = os.getenv("DB_PASSWORD"),
            database = os.getenv("DB_NAME")
        )
    except mysql.connector.Error as e:
        raise e