from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.cart import CartCreate, CartUpdate
from app.services.auth_service import get_current_active_user
from app.services.cart_service import CartService

router = APIRouter(prefix="/cart", tags=["cart"])


@router.post("/add")
def add_to_cart(
    payload: CartCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    service = CartService(db, current_user)
    return service.add_to_cart(payload)


@router.get("")
def get_cart(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    service = CartService(db, current_user)
    return service.get_user_cart()


@router.put("/{cart_item_id}")
def update_cart_item(
    cart_item_id: int,
    payload: CartUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    service = CartService(db, current_user)
    return service.update_cart_item(cart_item_id, payload)


@router.delete("/{cart_item_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_cart_item(
    cart_item_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
) -> None:
    service = CartService(db, current_user)
    service.remove_cart_item(cart_item_id)


@router.delete("/clear", status_code=status.HTTP_204_NO_CONTENT)
def clear_cart(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
) -> None:
    service = CartService(db, current_user)
    service.clear_cart()
