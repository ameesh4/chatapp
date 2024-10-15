from fastapi import Depends, HTTPException, Request
from fastapi.security import OAuth2PasswordBearer
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.responses import JSONResponse
from src.components.jwt_token import verify_token

class TokenAuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        open_endpoints = ["/signup", "/signin", "/get_email_by_token"]
        if request.url.path in open_endpoints:
            response = await call_next(request)
            return response
        
        authorization: str = request.headers.get("Authorization")
        if authorization:
            scheme, token = authorization.split()
            if scheme.lower() == "bearer":
                try:
                    verify_token(token)  # Verify the token
                except HTTPException as e:
                    return JSONResponse({"detail": e.detail}, status_code=e.status_code)
        else:
            return JSONResponse({"detail": "Authorization header missing"}, status_code=401)

        response = await call_next(request)
        return response
            
        
