from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.user import User
from schemas.user import UserCreate, UserUpdate, UserInDB
from database.db import get_db
from datetime import datetime
from utils.security import hash_password  # 👈 Importa el hasheador
from sqlalchemy import func

router = APIRouter(prefix="/api/users", tags=["users"])

@router.post("/", response_model=UserInDB)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    # Verificar que no exista ya el USER_CODE
    db_user = db.query(User).filter(User.USER_CODE == user.USER_CODE).first()
    if db_user:
        raise HTTPException(status_code=400, detail="User code already registered")
    
    # Hashear la contraseña
    hashed_pw = hash_password(user.PASSWORD)

    # Obtener el siguiente USERID manualmente
    max_userid = db.query(func.max(User.USERID)).scalar()
    next_userid = (max_userid or 0) + 1

    # Crear nuevo usuario
    new_user = User(
        USERID=next_userid,
        **user.dict(exclude={"PASSWORD"}),
        PASSWORD=hashed_pw,
        createDate=datetime.now(),
        updateDate=datetime.now()
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

@router.get("/", response_model=list[UserInDB])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(User).offset(skip).limit(limit).all()

@router.get("/{user_id}", response_model=UserInDB)
def read_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.USERID == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/{user_id}", response_model=UserInDB)
def update_user(user_id: int, user: UserUpdate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.USERID == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")

    update_data = user.dict(exclude_unset=True)
    update_data['updateDate'] = datetime.now()

    # 👇 Procesar contraseña solo si es válida y no vacía
    password = update_data.get("PASSWORD")
    if password:
        update_data["PASSWORD"] = hash_password(password)
    else:
        update_data.pop("PASSWORD", None)

    for field, value in update_data.items():
        setattr(db_user, field, value)

    db.commit()
    db.refresh(db_user)
    return db_user


@router.delete("/{user_id}", response_model=UserInDB)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.USERID == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    db_user.is_active = False
    db_user.updateDate = datetime.now()
    db.commit()
    db.refresh(db_user)
    return db_user

