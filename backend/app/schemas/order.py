from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class OrderBase(BaseModel):
    shipping_address: str = Field(..., min_length=5)
    status: str = Field("pending", min_length=2, max_length=50)
    total_amount: float = Field(..., gt=0)


class OrderCreate(OrderBase):
    pass


class OrderUpdate(BaseModel):
    shipping_address: Optional[str] = Field(None, min_length=5)
    status: Optional[str] = Field(None, min_length=2, max_length=50)
    total_amount: Optional[float] = Field(None, gt=0)


class OrderResponse(OrderBase):
    id: int
    order_number: str
    user_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
