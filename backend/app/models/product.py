from __future__ import annotations

from datetime import datetime, timezone
from typing import List, Optional

from sqlalchemy import DateTime, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.database import Base


class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    price: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    stock: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    image_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    affiliate_link: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    brand: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    rating: Mapped[Optional[float]] = mapped_column(Numeric(3, 2), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    category_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("categories.id"), nullable=True)
    owner_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("users.id"), nullable=True)

    category: Mapped[Optional["Category"]] = relationship(back_populates="products")
    owner: Mapped[Optional["User"]] = relationship(back_populates="products")
    cart_items: Mapped[List["Cart"]] = relationship(back_populates="product", cascade="all, delete-orphan")
    wishlist_items: Mapped[List["Wishlist"]] = relationship(back_populates="product", cascade="all, delete-orphan")
    affiliate_clicks: Mapped[List["AffiliateClick"]] = relationship(back_populates="product", cascade="all, delete-orphan")
