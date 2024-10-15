from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from src.router import router
from dotenv import load_dotenv
from middleware import TokenAuthMiddleware

load_dotenv()

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["POST", "GET", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)

# app.add_middleware(TokenAuthMiddleware)

app.include_router(router)


if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)