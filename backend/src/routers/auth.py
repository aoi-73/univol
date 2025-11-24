from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from models import Usuario
from models.enums import RolEnum
from schemas import UsuarioCreate, UsuarioResponse, Token
from utils.auth import get_db, get_password_hash, verify_password, create_access_token, get_current_user
from utils.config import ACCESS_TOKEN_EXPIRE_MINUTES
from datetime import datetime

router = APIRouter(tags=["auth"])

@router.post("/registro/", response_model=UsuarioResponse)
def registrar_usuario(user: UsuarioCreate, db: Session = Depends(get_db)):
    db_user = db.query(Usuario).filter(Usuario.correo == user.correo).first()
    if db_user:
        raise HTTPException(status_code=400, detail="El correo ya está registrado")
    
    hashed_password = get_password_hash(user.contrasena)
    nuevo_usuario = Usuario(
        correo=user.correo,
        contrasena_hash=hashed_password,
        rol=user.rol,
        telefono=user.telefono
    )
    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)
    return nuevo_usuario

@router.post("/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(Usuario).filter(Usuario.correo == form_data.username).first()
    if not user or not verify_password(form_data.password, user.contrasena_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Correo o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user.ultimo_login = datetime.utcnow()
    db.commit()
    
    access_token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/usuarios/me", response_model=UsuarioResponse)
def obtener_usuario_actual(current_user: Usuario = Depends(get_current_user)):
    return current_user

