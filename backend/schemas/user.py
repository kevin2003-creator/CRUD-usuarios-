from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class UserBase(BaseModel):
    USER_CODE: str
    U_NAME: Optional[str] = None
    E_Mail: Optional[str] = None
    Department: Optional[int] = -2
    Branch: Optional[int] = -2

class UserCreate(UserBase):
    PASSWORD: str

class UserUpdate(BaseModel):
    U_NAME: Optional[str] = None
    E_Mail: Optional[str] = None
    Department: Optional[int] = None
    Branch: Optional[int] = None
    is_active: Optional[bool] = None
    PASSWORD: Optional[str] = None  # 👈 Agregado aquí


class UserInDB(UserBase):
    USERID: int
    is_active: bool
    createDate: Optional[datetime] = None
    updateDate: Optional[datetime] = None

    class Config:
        orm_mode = True