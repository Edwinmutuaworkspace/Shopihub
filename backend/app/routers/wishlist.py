from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.wishlist import WishlistCreate
from app.services.auth_service import get_current_active_user
from app.services.wishlist_service import WishlistService

router = APIRouter(prefix="/wishlist", tags=["wishlist"])


@router.post("/add")
def add_to_wishlist(
    payload: WishlistCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    service = WishlistService(db, current_user)
    return service.add_to_wishlist(payload)


@router.get("")
def get_wishlist(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    service = WishlistService(db, current_user)
    return service.get_user_wishlist()


@router.delete("/{wishlist_item_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_from_wishlist(
    wishlist_item_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
) -> None:
    service = WishlistService(db, current_user)
    service.remove_from_wishlist(wishlist_item_id)


@router.delete("/clear", status_code=status.HTTP_204_NO_CONTENT)
def clear_wishlist(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
) -> None:
    service = WishlistService(db, current_user)
    service.clear_wishlist()


@router.post("/{wishlist_item_id}/move-to-cart")
def move_to_cart(
    wishlist_item_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    service = WishlistService(db, current_user)
    return service.move_to_cart(wishlist_item_id)
