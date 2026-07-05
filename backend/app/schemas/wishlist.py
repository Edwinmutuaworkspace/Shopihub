from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict


class WishlistCreate(BaseModel):
    product_id: int


class WishlistResponse(BaseModel):
    id: int
    user_id: int
    product_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
