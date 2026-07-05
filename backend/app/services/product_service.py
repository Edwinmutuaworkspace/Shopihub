from __future__ import annotations

from typing import List, Optional

from fastapi import HTTPException, status
from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.models.category import Category
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate


class ProductService:
    def __init__(self, db: Session):
        self.db = db

    def create_product(self, payload: ProductCreate, owner_id: Optional[int] = None) -> Product:
        if payload.category_id is not None:
            category = self.db.get(Category, payload.category_id)
            if category is None:
                raise HTTPException(status_code=404, detail="Category not found")

        existing = (
            self.db.query(Product)
            .filter(Product.name == payload.name, Product.brand == payload.brand)
            .first()
        )
        if existing:
            raise HTTPException(status_code=400, detail="Product already exists")

        product = Product(
            name=payload.name,
            description=payload.description,
            price=payload.price,
            stock=payload.stock,
            image_url=payload.image_url,
            affiliate_link=payload.affiliate_link,
            brand=payload.brand,
            rating=payload.rating,
            category_id=payload.category_id,
            owner_id=owner_id,
        )
        self.db.add(product)
        self.db.commit()
        self.db.refresh(product)
        return product

    def get_product_by_id(self, product_id: int) -> Product:
        product = self.db.get(Product, product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        return product

    def get_all_products(self, skip: int = 0, limit: int = 20) -> List[Product]:
        return self.db.query(Product).offset(skip).limit(limit).all()

    def update_product(self, product_id: int, payload: ProductUpdate) -> Product:
        product = self.get_product_by_id(product_id)

        if payload.category_id is not None:
            category = self.db.get(Category, payload.category_id)
            if category is None:
                raise HTTPException(status_code=404, detail="Category not found")

        for field, value in payload.model_dump(exclude_unset=True).items():
            setattr(product, field, value)

        self.db.commit()
        self.db.refresh(product)
        return product

    def delete_product(self, product_id: int) -> None:
        product = self.get_product_by_id(product_id)
        self.db.delete(product)
        self.db.commit()

    def search_products(self, query: str, skip: int = 0, limit: int = 20) -> List[Product]:
        search_term = f"%{query}%"
        statement = (
            select(Product)
            .where(
                or_(
                    Product.name.ilike(search_term),
                    Product.brand.ilike(search_term),
                    Product.description.ilike(search_term),
                )
            )
            .offset(skip)
            .limit(limit)
        )
        return self.db.execute(statement).scalars().all()

    def filter_products(
        self,
        category_id: Optional[int] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
        brand: Optional[str] = None,
        in_stock: Optional[bool] = None,
        skip: int = 0,
        limit: int = 20,
    ) -> List[Product]:
        query = self.db.query(Product)

        if category_id is not None:
            category = self.db.get(Category, category_id)
            if category is None:
                raise HTTPException(status_code=404, detail="Category not found")
            query = query.filter(Product.category_id == category_id)

        if min_price is not None:
            query = query.filter(Product.price >= min_price)
        if max_price is not None:
            query = query.filter(Product.price <= max_price)
        if brand:
            query = query.filter(Product.brand.ilike(f"%{brand}%"))
        if in_stock is not None:
            query = query.filter(Product.stock > 0 if in_stock else Product.stock <= 0)

        return query.offset(skip).limit(limit).all()

    def get_featured_products(self, limit: int = 10) -> List[Product]:
        return self.db.query(Product).filter(Product.rating.is_not(None)).order_by(Product.rating.desc()).limit(limit).all()

    def get_latest_products(self, limit: int = 10) -> List[Product]:
        return self.db.query(Product).order_by(Product.created_at.desc()).limit(limit).all()

    def get_products_by_category(self, category_id: int, skip: int = 0, limit: int = 20) -> List[Product]:
        category = self.db.get(Category, category_id)
        if category is None:
            raise HTTPException(status_code=404, detail="Category not found")
        return self.db.query(Product).filter(Product.category_id == category_id).offset(skip).limit(limit).all()
