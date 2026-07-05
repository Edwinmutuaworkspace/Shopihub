from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.database import Base, engine
from app.routers.affiliate import (
    get_affiliate_analytics,
    get_affiliate_dashboard,
    get_product_affiliate_analytics,
    redirect_to_affiliate,
)
from app.routers.auth import router as auth_router
from app.routers.cart import router as cart_router
from app.routers.categories import router as categories_router
from app.routers.products import router as products_router
from app.routers.wishlist import router as wishlist_router

app = FastAPI(title="ShoppyHub API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost",
        "http://127.0.0.1",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(products_router)
app.include_router(categories_router)
app.include_router(cart_router)
app.include_router(wishlist_router)

app.add_api_route(
    "/affiliate/redirect/{product_id}",
    redirect_to_affiliate,
    methods=["GET"],
    summary="Redirect to affiliate product",
)
app.add_api_route(
    "/affiliate/analytics",
    get_affiliate_analytics,
    methods=["GET"],
    summary="Get affiliate analytics",
)
app.add_api_route(
    "/affiliate/dashboard",
    get_affiliate_dashboard,
    methods=["GET"],
    summary="Get affiliate dashboard",
)
app.add_api_route(
    "/affiliate/products/{product_id}",
    get_product_affiliate_analytics,
    methods=["GET"],
    summary="Get product affiliate analytics",
)


@app.on_event("startup")
def startup_event():
    Base.metadata.create_all(bind=engine)


@app.get("/")
def read_root():
    return {"message": "Welcome to ShoppyHub API"}
