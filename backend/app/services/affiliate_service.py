from __future__ import annotations

from collections import Counter
from datetime import datetime, timedelta, timezone
from typing import Any

from fastapi import HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.affiliate_click import AffiliateClick
from app.models.category import Category
from app.models.product import Product
from app.models.user import User


class AffiliateAnalyticsService:
    def __init__(self, db: Session):
        self.db = db

    def record_click(self, product_id: int, user_id: int | None, ip_address: str | None, user_agent: str | None, referrer: str | None) -> AffiliateClick:
        product = self.db.get(Product, product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        if not product.affiliate_link:
            raise HTTPException(status_code=400, detail="Affiliate link not found")

        click = AffiliateClick(
            product_id=product_id,
            user_id=user_id,
            ip_address=ip_address,
            user_agent=user_agent,
            referrer=referrer,
        )
        self.db.add(click)
        self.db.commit()
        self.db.refresh(click)
        return click

    def get_total_clicks(self) -> int:
        return self.db.query(AffiliateClick).count()

    def get_product_clicks(self, product_id: int) -> int:
        return self.db.query(AffiliateClick).filter(AffiliateClick.product_id == product_id).count()

    def get_category_clicks(self, category_id: int) -> int:
        return self.db.query(AffiliateClick).join(Product, AffiliateClick.product_id == Product.id).filter(Product.category_id == category_id).count()

    def get_user_clicks(self, user_id: int) -> int:
        return self.db.query(AffiliateClick).filter(AffiliateClick.user_id == user_id).count()

    def get_daily_clicks(self) -> int:
        since = datetime.now(timezone.utc) - timedelta(days=1)
        return self.db.query(AffiliateClick).filter(AffiliateClick.clicked_at >= since).count()

    def get_weekly_clicks(self) -> int:
        since = datetime.now(timezone.utc) - timedelta(days=7)
        return self.db.query(AffiliateClick).filter(AffiliateClick.clicked_at >= since).count()

    def get_monthly_clicks(self) -> int:
        since = datetime.now(timezone.utc) - timedelta(days=30)
        return self.db.query(AffiliateClick).filter(AffiliateClick.clicked_at >= since).count()

    def get_top_products(self, limit: int = 5) -> list[dict[str, Any]]:
        rows = (
            self.db.query(AffiliateClick.product_id, func.count(AffiliateClick.id).label("click_count"))
            .group_by(AffiliateClick.product_id)
            .order_by(func.count(AffiliateClick.id).desc())
            .limit(limit)
            .all()
        )
        result: list[dict[str, Any]] = []
        for product_id, click_count in rows:
            product = self.db.get(Product, product_id)
            result.append({"product_id": product_id, "product_name": product.name if product else None, "click_count": click_count})
        return result

    def get_top_categories(self, limit: int = 5) -> list[dict[str, Any]]:
        rows = (
            self.db.query(Product.category_id, func.count(AffiliateClick.id).label("click_count"))
            .join(AffiliateClick, AffiliateClick.product_id == Product.id)
            .filter(Product.category_id.is_not(None))
            .group_by(Product.category_id)
            .order_by(func.count(AffiliateClick.id).desc())
            .limit(limit)
            .all()
        )
        result: list[dict[str, Any]] = []
        for category_id, click_count in rows:
            category = self.db.get(Category, category_id)
            result.append({"category_id": category_id, "category_name": category.name if category else None, "click_count": click_count})
        return result

    def get_recent_clicks(self, limit: int = 10) -> list[AffiliateClick]:
        return self.db.query(AffiliateClick).order_by(AffiliateClick.clicked_at.desc()).limit(limit).all()

    def get_dashboard_stats(self) -> dict[str, Any]:
        total_users = self.db.query(User).count()
        total_products = self.db.query(Product).count()
        total_categories = self.db.query(Category).count()
        total_affiliate_clicks = self.get_total_clicks()
        top_product = self.get_top_products(limit=1)
        top_category = self.get_top_categories(limit=1)
        latest_clicks = self.get_recent_clicks(limit=5)

        return {
            "total_users": total_users,
            "total_products": total_products,
            "total_categories": total_categories,
            "total_affiliate_clicks": total_affiliate_clicks,
            "most_clicked_product": top_product[0]["product_name"] if top_product else None,
            "most_clicked_category": top_category[0]["category_name"] if top_category else None,
            "latest_clicks": [
                {
                    "product_id": click.product_id,
                    "user_id": click.user_id,
                    "ip_address": click.ip_address,
                    "clicked_at": click.clicked_at,
                }
                for click in latest_clicks
            ],
        }

    def get_product_analytics(self, product_id: int) -> dict[str, Any]:
        product = self.db.get(Product, product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")

        click_count = self.get_product_clicks(product_id)
        last_click = self.db.query(AffiliateClick).filter(AffiliateClick.product_id == product_id).order_by(AffiliateClick.clicked_at.desc()).first()

        return {
            "product": {
                "id": product.id,
                "name": product.name,
                "affiliate_link": product.affiliate_link,
            },
            "click_count": click_count,
            "last_clicked": last_click.clicked_at if last_click else None,
            "daily_clicks": self._count_clicks_since(product_id, timedelta(days=1)),
            "weekly_clicks": self._count_clicks_since(product_id, timedelta(days=7)),
            "monthly_clicks": self._count_clicks_since(product_id, timedelta(days=30)),
        }

    def _count_clicks_since(self, product_id: int, window: timedelta) -> int:
        since = datetime.now(timezone.utc) - window
        return self.db.query(AffiliateClick).filter(AffiliateClick.product_id == product_id, AffiliateClick.clicked_at >= since).count()
