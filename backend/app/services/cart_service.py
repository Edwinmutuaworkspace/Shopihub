from __future__ import annotations

from typing import List

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.cart import Cart
from app.models.product import Product
from app.models.user import User
from app.schemas.cart import CartCreate, CartUpdate


class CartService:
    def __init__(self, db: Session, user: User):
        self.db = db
        self.user = user

    def validate_stock(self, product: Product, quantity: int) -> None:
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        if not product.stock:
            raise HTTPException(status_code=400, detail="Product is out of stock")
        if quantity > product.stock:
            raise HTTPException(status_code=400, detail="Requested quantity exceeds available stock")

    def add_to_cart(self, payload: CartCreate) -> dict:
        product = self.db.get(Product, payload.product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        if not product.stock:
            raise HTTPException(status_code=400, detail="Product is out of stock")

        existing_item = (
            self.db.query(Cart)
            .filter(Cart.user_id == self.user.id, Cart.product_id == payload.product_id)
            .first()
        )
        if existing_item:
            new_quantity = existing_item.quantity + payload.quantity
            self.validate_stock(product, new_quantity)
            existing_item.quantity = new_quantity
            self.db.commit()
            self.db.refresh(existing_item)
            item = existing_item
        else:
            self.validate_stock(product, payload.quantity)
            item = Cart(user_id=self.user.id, product_id=payload.product_id, quantity=payload.quantity)
            self.db.add(item)
            self.db.commit()
            self.db.refresh(item)

        return self._serialize_item(item)

    def get_user_cart(self) -> dict:
        items = self.db.query(Cart).filter(Cart.user_id == self.user.id).all()
        serialized_items = [self._serialize_item(item) for item in items]
        return {
            "cart_items": serialized_items,
            "total_items": self.calculate_total_items(items),
            "subtotal": self.calculate_cart_total(items),
            "estimated_total": self.calculate_cart_total(items),
        }

    def update_cart_item(self, cart_item_id: int, payload: CartUpdate) -> dict:
        item = self.db.query(Cart).filter(Cart.id == cart_item_id, Cart.user_id == self.user.id).first()
        if not item:
            raise HTTPException(status_code=404, detail="Cart item not found")
        if payload.quantity is None:
            raise HTTPException(status_code=400, detail="Quantity is required")
        if payload.quantity <= 0:
            raise HTTPException(status_code=400, detail="Quantity must be greater than zero")

        product = self.db.get(Product, item.product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        self.validate_stock(product, payload.quantity)

        item.quantity = payload.quantity
        self.db.commit()
        self.db.refresh(item)
        return self._serialize_item(item)

    def remove_cart_item(self, cart_item_id: int) -> None:
        item = self.db.query(Cart).filter(Cart.id == cart_item_id, Cart.user_id == self.user.id).first()
        if not item:
            raise HTTPException(status_code=404, detail="Cart item not found")
        self.db.delete(item)
        self.db.commit()

    def clear_cart(self) -> None:
        self.db.query(Cart).filter(Cart.user_id == self.user.id).delete()
        self.db.commit()

    def calculate_cart_total(self, items: List[Cart]) -> float:
        return round(sum(self._subtotal_for_item(item) for item in items), 2)

    def calculate_total_items(self, items: List[Cart]) -> int:
        return sum(item.quantity for item in items)

    def _subtotal_for_item(self, item: Cart) -> float:
        product = self.db.get(Product, item.product_id)
        if not product:
            return 0.0
        return float(product.price) * item.quantity

    def _serialize_item(self, item: Cart) -> dict:
        product = self.db.get(Product, item.product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        return {
            "product_id": product.id,
            "product_name": product.name,
            "product_image": product.image_url,
            "price": float(product.price),
            "quantity": item.quantity,
            "subtotal": round(float(product.price) * item.quantity, 2),
        }
