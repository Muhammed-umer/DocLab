import jwt
import requests
from typing import Optional
from fastapi import Request, Header, HTTPException, status
from backend.app.config import settings

_CLERK_JWKS_CACHE = None

def get_clerk_jwks():
    global _CLERK_JWKS_CACHE
    if _CLERK_JWKS_CACHE:
        return _CLERK_JWKS_CACHE
    try:
        # Fetch Clerk JWKS public keys
        resp = requests.get("https://api.clerk.com/v1/jwks", timeout=5)
        if resp.status_code == 200:
            _CLERK_JWKS_CACHE = resp.json()
            return _CLERK_JWKS_CACHE
    except Exception as e:
        print(f"[AUTH] Failed to fetch Clerk JWKS: {e}")
    return None

def get_current_user_id(
    authorization: Optional[str] = Header(None),
    x_user_id: Optional[str] = Header(None)
) -> str:
    """
    Extracts authenticated user_id from Clerk JWT Bearer token or X-User-Id header.
    Returns 'default_user' if unauthenticated.
    """
    if x_user_id and x_user_id.strip():
        return x_user_id.strip()

    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ", 1)[1]
        try:
            # Decode JWT payload
            unverified = jwt.decode(token, options={"verify_signature": False})
            user_id = unverified.get("sub") or unverified.get("user_id")
            if user_id:
                return user_id
        except Exception as e:
            print(f"[AUTH] JWT parse warning: {e}")

    return "default_user"
