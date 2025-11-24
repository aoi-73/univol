from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models import Usuario, Postulante
from models.enums import RolEnum
from schemas import PostulanteCreate, PostulanteResponse
from utils.auth import get_db, get_current_user

router = APIRouter(prefix="/postulantes", tags=["postulantes"])

@router.post("/", response_model=PostulanteResponse)
def crear_postulante(post: PostulanteCreate, current_user: Usuario = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.rol != RolEnum.postulante:
        raise HTTPException(status_code=403, detail="Solo los postulantes pueden crear perfiles")
    
    nuevo_postulante = Postulante(id_usuario=current_user.id, **post.dict())
    db.add(nuevo_postulante)
    db.commit()
    db.refresh(nuevo_postulante)
    return nuevo_postulante

@router.get("/me", response_model=PostulanteResponse)
def obtener_mi_perfil(current_user: Usuario = Depends(get_current_user), db: Session = Depends(get_db)):
    postulante = db.query(Postulante).filter(Postulante.id_usuario == current_user.id).first()
    if not postulante:
        raise HTTPException(status_code=404, detail="Perfil no encontrado")
    return postulante

