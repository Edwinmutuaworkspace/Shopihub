from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.user import UserCreate, UserLogin, UserResponse
from app.services.auth_service import (
    get_current_active_user,
    get_current_admin,
    login_user,
    register_user,
)

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(payload: UserCreate, db: Session = Depends(get_db)) -> UserResponse:
    user = register_user(db, payload)
    return UserResponse.model_validate(user)


@router.post("/login")
def login(payload: UserLogin, db: Session = Depends(get_db)) -> dict:
    return login_user(db, payload)


@router.get("/me", response_model=UserResponse)
def get_me(current_user=Depends(get_current_active_user)) -> UserResponse:
    return UserResponse.model_validate(current_user)


@router.get("/admin", response_model=UserResponse)
def get_admin(current_user=Depends(get_current_admin)) -> UserResponse:
    return UserResponse.model_validate(current_user)
