from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.responses import JSONResponse
from src.components.jwt_token import verify_token

class URLFilterMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: callable):
        open = ["/signup", "/signin"]
        try:
            if request.url.path not in open:
                token = request.headers.get("Authorization")
                if not token:
                    return JSONResponse({"error": "Token required"}, status_code=401)
                if not verify_token(token):
                    return JSONResponse({"error": "Invalid token"}, status_code=401)
            
            try:
                response = await call_next(request)
                return response
            except Exception as e:
                return e.message
            
        except Exception as e:
            return e.message
        
