from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class CartBase(BaseModel):
    product_id: int
    quantity: int = Field(..., gt=0)


class CartCreate(CartBase):
    pass


class CartUpdate(BaseModel):
    quantity: Optional[int] = Field(None, gt=0)


class CartResponse(CartBase):
    id: int
    user_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
