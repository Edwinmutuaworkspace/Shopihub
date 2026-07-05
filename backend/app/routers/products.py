from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.product import ProductCreate, ProductResponse, ProductUpdate
from app.services.auth_service import get_current_admin
from app.services.product_service import ProductService

router = APIRouter(prefix="/products", tags=["products"])


@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    payload: ProductCreate,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
) -> ProductResponse:
    service = ProductService(db)
    product = service.create_product(payload, owner_id=current_admin.id)
    return ProductResponse.model_validate(product)


@router.get("", response_model=list[ProductResponse])
def get_products(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
) -> list[ProductResponse]:
    service = ProductService(db)
    products = service.get_all_products(skip=skip, limit=limit)
    return [ProductResponse.model_validate(product) for product in products]


@router.get("/search", response_model=list[ProductResponse])
def search_products(
    q: str = Query(..., min_length=1),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
) -> list[ProductResponse]:
    service = ProductService(db)
    products = service.search_products(q, skip=skip, limit=limit)
    return [ProductResponse.model_validate(product) for product in products]


@router.get("/category/{category_id}", response_model=list[ProductResponse])
def get_products_by_category(
    category_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
) -> list[ProductResponse]:
    service = ProductService(db)
    products = service.get_products_by_category(category_id, skip=skip, limit=limit)
    return [ProductResponse.model_validate(product) for product in products]


@router.get("/featured", response_model=list[ProductResponse])
def get_featured_products(
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db),
) -> list[ProductResponse]:
    service = ProductService(db)
    products = service.get_featured_products(limit=limit)
    return [ProductResponse.model_validate(product) for product in products]


@router.get("/latest", response_model=list[ProductResponse])
def get_latest_products(
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db),
) -> list[ProductResponse]:
    service = ProductService(db)
    products = service.get_latest_products(limit=limit)
    return [ProductResponse.model_validate(product) for product in products]


@router.get("/{product_id}", response_model=ProductResponse)
def get_product_by_id(product_id: int, db: Session = Depends(get_db)) -> ProductResponse:
    service = ProductService(db)
    product = service.get_product_by_id(product_id)
    return ProductResponse.model_validate(product)


@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    payload: ProductUpdate,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
) -> ProductResponse:
    service = ProductService(db)
    product = service.update_product(product_id, payload)
    return ProductResponse.model_validate(product)


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
) -> None:
    service = ProductService(db)
    service.delete_product(product_id)
