import unittest
from typing import Generator

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

from app.database.database import Base
from app.main import app
from app.models.product import Product
from app.models.user import User
from app.models.affiliate_click import AffiliateClick
from app.routers import affiliate as affiliate_router
from app.services.affiliate_service import AffiliateAnalyticsService


class AffiliateEngineTests(unittest.TestCase):
    def setUp(self) -> None:
        self.engine = create_engine(
            "sqlite://",
            connect_args={"check_same_thread": False},
            poolclass=StaticPool,
        )
        self.TestSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=self.engine)
        Base.metadata.create_all(bind=self.engine)

        self.session = self.TestSessionLocal()
        self._add_test_data()

        def override_get_db() -> Generator[Session, None, None]:
            try:
                yield self.session
            finally:
                pass

        app.dependency_overrides[affiliate_router.get_db] = override_get_db
        self.client = TestClient(app)

    def tearDown(self) -> None:
        self.session.close()
        app.dependency_overrides.clear()
        Base.metadata.drop_all(bind=self.engine)

    def _add_test_data(self) -> None:
        user = User(username="affiliate_user", email="affiliate@example.com", hashed_password="test")
        self.session.add(user)
        self.session.flush()

        product = Product(
            name="Affiliate Product",
            description="Test product",
            price=19.99,
            stock=10,
            affiliate_link="https://amzn.to/test-product",
            brand="TestBrand",
        )
        self.session.add(product)
        self.session.commit()

    def test_redirect_records_click_and_returns_302(self) -> None:
        product = self.session.query(Product).first()
        response = self.client.get(f"/affiliate/redirect/{product.id}", headers={"User-Agent": "TestAgent"})

        self.assertEqual(response.status_code, 302)
        self.assertEqual(response.headers["location"], product.affiliate_link)
        self.assertEqual(self.session.query(AffiliateClick).count(), 1)

    def test_analytics_service_reports_click_data(self) -> None:
        product = self.session.query(Product).first()
        service = AffiliateAnalyticsService(self.session)

        service.record_click(product_id=product.id, user_id=None, ip_address="127.0.0.1", user_agent="agent", referrer="https://example.com")
        service.record_click(product_id=product.id, user_id=None, ip_address="127.0.0.2", user_agent="agent", referrer="https://example.com")

        self.assertEqual(service.get_total_clicks(), 2)
        self.assertEqual(service.get_product_clicks(product.id), 2)
        analytics = service.get_dashboard_stats()
        self.assertEqual(analytics["total_affiliate_clicks"], 2)
        self.assertEqual(analytics["most_clicked_product"], product.name)


if __name__ == "__main__":
    unittest.main()
