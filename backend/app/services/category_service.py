from __future__ import annotations

from typing import List

from fastapi import HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.category import Category
from app.models.product import Product
from app.schemas.category import CategoryCreate, CategoryUpdate


class CategoryService:
    def __init__(self, db: Session):
        self.db = db

    def create_category(self, payload: CategoryCreate) -> Category:
        existing = self.db.query(Category).filter(Category.name == payload.name).first()
        if existing:
            raise HTTPException(status_code=400, detail="Category already exists")

        category = Category(name=payload.name, description=payload.description)
        self.db.add(category)
        self.db.commit()
        self.db.refresh(category)
        return category

    def get_category_by_id(self, category_id: int) -> Category:
        category = self.db.get(Category, category_id)
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")
        return category

    def get_all_categories(self) -> List[Category]:
        return self.db.query(Category).order_by(Category.name).all()

    def update_category(self, category_id: int, payload: CategoryUpdate) -> Category:
        category = self.get_category_by_id(category_id)

        if payload.name is not None:
            existing = self.db.query(Category).filter(Category.name == payload.name, Category.id != category_id).first()
            if existing:
                raise HTTPException(status_code=400, detail="Category already exists")
            category.name = payload.name

        if payload.description is not None:
            category.description = payload.description

        self.db.commit()
        self.db.refresh(category)
        return category

    def delete_category(self, category_id: int) -> None:
        category = self.get_category_by_id(category_id)
        if self.db.query(Product).filter(Product.category_id == category_id).first():
            raise HTTPException(status_code=400, detail="Cannot delete category with existing products")

        self.db.delete(category)
        self.db.commit()

    def get_products_by_category(self, category_id: int) -> List[Product]:
        self.get_category_by_id(category_id)
        return self.db.query(Product).filter(Product.category_id == category_id).all()

    def get_category_statistics(self) -> list[dict]:
        categories = self.db.query(Category).all()
        stats = []
        for category in categories:
            products = self.db.query(Product).filter(Product.category_id == category.id).all()
            product_count = len(products)
            inventory_value = sum(float(product.price) * product.stock for product in products)
            average_rating = (
                sum(float(product.rating) for product in products if product.rating is not None) / product_count
                if product_count and any(product.rating is not None for product in products)
                else 0
            )
            stats.append(
                {
                    "category_id": category.id,
                    "category_name": category.name,
                    "total_products": product_count,
                    "total_inventory_value": round(inventory_value, 2),
                    "average_rating": round(average_rating, 2),
                }
            )
        return stats
