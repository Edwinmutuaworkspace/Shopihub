from __future__ import annotations

from typing import List

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.cart import Cart
from app.models.product import Product
from app.models.user import User
from app.models.wishlist import Wishlist
from app.schemas.wishlist import WishlistCreate


class WishlistService:
    def __init__(self, db: Session, user: User):
        self.db = db
        self.user = user

    def add_to_wishlist(self, payload: WishlistCreate) -> dict:
        product = self.db.get(Product, payload.product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        if not product.stock:
            raise HTTPException(status_code=400, detail="Product is inactive or unavailable")

        existing = (
            self.db.query(Wishlist)
            .filter(Wishlist.user_id == self.user.id, Wishlist.product_id == payload.product_id)
            .first()
        )
        if existing:
            raise HTTPException(status_code=400, detail="Product already in wishlist")

        item = Wishlist(user_id=self.user.id, product_id=payload.product_id)
        self.db.add(item)
        self.db.commit()
        self.db.refresh(item)
        return self._serialize_item(item)

    def get_user_wishlist(self) -> dict:
        items = self.db.query(Wishlist).filter(Wishlist.user_id == self.user.id).order_by(Wishlist.created_at.desc()).all()
        return {
            "items": [self._serialize_item(item) for item in items],
            "total_saved_items": len(items),
        }

    def remove_from_wishlist(self, wishlist_item_id: int) -> None:
        item = self.db.query(Wishlist).filter(Wishlist.id == wishlist_item_id, Wishlist.user_id == self.user.id).first()
        if not item:
            raise HTTPException(status_code=404, detail="Wishlist item not found")
        self.db.delete(item)
        self.db.commit()

    def clear_wishlist(self) -> None:
        self.db.query(Wishlist).filter(Wishlist.user_id == self.user.id).delete()
        self.db.commit()

    def move_to_cart(self, wishlist_item_id: int) -> dict:
        item = self.db.query(Wishlist).filter(Wishlist.id == wishlist_item_id, Wishlist.user_id == self.user.id).first()
        if not item:
            raise HTTPException(status_code=404, detail="Wishlist item not found")

        product = self.db.get(Product, item.product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        if not product.stock:
            raise HTTPException(status_code=400, detail="Product is out of stock")

        existing_cart_item = (
            self.db.query(Cart)
            .filter(Cart.user_id == self.user.id, Cart.product_id == product.id)
            .first()
        )
        if existing_cart_item:
            existing_cart_item.quantity += 1
        else:
            cart_item = Cart(user_id=self.user.id, product_id=product.id, quantity=1)
            self.db.add(cart_item)

        self.db.delete(item)
        self.db.commit()
        return {"message": "Moved to cart successfully"}

    def wishlist_statistics(self) -> dict:
        items = self.db.query(Wishlist).filter(Wishlist.user_id == self.user.id).all()
        return {
            "total_saved_items": len(items),
            "products": [self._serialize_item(item) for item in items],
        }

    def _serialize_item(self, item: Wishlist) -> dict:
        product = self.db.get(Product, item.product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        return {
            "wishlist_item_id": item.id,
            "product_id": product.id,
            "product_name": product.name,
            "image_url": product.image_url,
            "affiliate_link": product.affiliate_link,
            "brand": product.brand,
            "price": float(product.price),
            "rating": float(product.rating) if product.rating is not None else None,
            "created_at": item.created_at,
        }
