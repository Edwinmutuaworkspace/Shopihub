from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.category import CategoryCreate, CategoryResponse, CategoryUpdate
from app.schemas.product import ProductResponse
from app.services.auth_service import get_current_admin
from app.services.category_service import CategoryService

router = APIRouter(prefix="/categories", tags=["categories"])


@router.post("", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(
    payload: CategoryCreate,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
) -> CategoryResponse:
    service = CategoryService(db)
    category = service.create_category(payload)
    return CategoryResponse.model_validate(category)


@router.get("", response_model=list[CategoryResponse])
def get_categories(db: Session = Depends(get_db)) -> list[CategoryResponse]:
    service = CategoryService(db)
    categories = service.get_all_categories()
    return [CategoryResponse.model_validate(category) for category in categories]


@router.get("/{category_id}", response_model=CategoryResponse)
def get_category(category_id: int, db: Session = Depends(get_db)) -> CategoryResponse:
    service = CategoryService(db)
    category = service.get_category_by_id(category_id)
    return CategoryResponse.model_validate(category)


@router.put("/{category_id}", response_model=CategoryResponse)
def update_category(
    category_id: int,
    payload: CategoryUpdate,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
) -> CategoryResponse:
    service = CategoryService(db)
    category = service.update_category(category_id, payload)
    return CategoryResponse.model_validate(category)


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
) -> None:
    service = CategoryService(db)
    service.delete_category(category_id)


@router.get("/{category_id}/products", response_model=list[ProductResponse])
def get_category_products(category_id: int, db: Session = Depends(get_db)) -> list[ProductResponse]:
    service = CategoryService(db)
    products = service.get_products_by_category(category_id)
    return [ProductResponse.model_validate(product) for product in products]


@router.get("/statistics")
def get_category_statistics(db: Session = Depends(get_db)) -> dict:
    service = CategoryService(db)
    return {"categories": service.get_category_statistics()}
