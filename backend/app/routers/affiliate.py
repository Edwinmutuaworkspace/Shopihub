from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.responses import RedirectResponse
from jose import JWTError
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.product import Product
from app.models.user import User
from app.services.affiliate_service import AffiliateAnalyticsService
from app.services.auth_service import get_current_admin
from app.utils.security import decode_access_token

router = APIRouter(prefix="/affiliate", tags=["affiliate"])


@router.get("/redirect/{product_id}", summary="Redirect to affiliate product")
def redirect_to_affiliate(
    product_id: int,
    request: Request,
    db: Session = Depends(get_db),
) -> RedirectResponse:
    product = db.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if not product.affiliate_link:
        raise HTTPException(status_code=400, detail="Affiliate link not found")

    user_id = None
    auth_header = request.headers.get("authorization")
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ", 1)[1]
        try:
            username = decode_access_token(token)
            current_user = db.query(User).filter(User.username == username).first()
            if current_user:
                user_id = current_user.id
        except JWTError:
            user_id = None

    service = AffiliateAnalyticsService(db)
    service.record_click(
        product_id=product_id,
        user_id=user_id,
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
        referrer=request.headers.get("referer"),
    )

    return RedirectResponse(url=product.affiliate_link, status_code=status.HTTP_302_FOUND)


@router.get("/analytics", summary="Get affiliate analytics")
def get_affiliate_analytics(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    service = AffiliateAnalyticsService(db)
    return {
        "total_clicks": service.get_total_clicks(),
        "today_clicks": service.get_daily_clicks(),
        "weekly_clicks": service.get_weekly_clicks(),
        "monthly_clicks": service.get_monthly_clicks(),
        "top_products": service.get_top_products(),
        "top_categories": service.get_top_categories(),
        "recent_clicks": [
            {
                "id": click.id,
                "product_id": click.product_id,
                "user_id": click.user_id,
                "ip_address": click.ip_address,
                "user_agent": click.user_agent,
                "referrer": click.referrer,
                "clicked_at": click.clicked_at,
            }
            for click in service.get_recent_clicks()
        ],
    }


@router.get("/dashboard", summary="Get affiliate dashboard")
def get_affiliate_dashboard(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    service = AffiliateAnalyticsService(db)
    return service.get_dashboard_stats()


@router.get("/products/{product_id}", summary="Get product affiliate analytics")
def get_product_affiliate_analytics(
    product_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    service = AffiliateAnalyticsService(db)
    return service.get_product_analytics(product_id)
