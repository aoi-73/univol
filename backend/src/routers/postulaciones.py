from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from models import Usuario, Postulante, Evento, Organizacion, Postulacion
from models.enums import RolEnum
from schemas import PostulacionCreate, PostulacionResponse, PostulacionUpdate
from utils.auth import get_db, get_current_user

router = APIRouter(prefix="/postulaciones", tags=["postulaciones"])

@router.post("/", response_model=PostulacionResponse)
def crear_postulacion(post: PostulacionCreate, current_user: Usuario = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.rol != RolEnum.postulante:
        raise HTTPException(status_code=403, detail="Solo los postulantes pueden postularse")
    
    postulante = db.query(Postulante).filter(Postulante.id_usuario == current_user.id).first()
    if not postulante:
        raise HTTPException(status_code=404, detail="Debe crear un perfil de postulante primero")
    
    nueva_postulacion = Postulacion(id_postulante=postulante.id, **post.dict())
    db.add(nueva_postulacion)
    db.commit()
    db.refresh(nueva_postulacion)
    return nueva_postulacion

@router.get("/mis-postulaciones", response_model=List[PostulacionResponse])
def mis_postulaciones(current_user: Usuario = Depends(get_current_user), db: Session = Depends(get_db)):
    postulante = db.query(Postulante).filter(Postulante.id_usuario == current_user.id).first()
    if not postulante:
        raise HTTPException(status_code=404, detail="Perfil no encontrado")
    return db.query(Postulacion).filter(Postulacion.id_postulante == postulante.id).all()

@router.put("/{postulacion_id}", response_model=PostulacionResponse)
def actualizar_postulacion(postulacion_id: int, postulacion_update: PostulacionUpdate, current_user: Usuario = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.rol != RolEnum.organizacion:
        raise HTTPException(status_code=403, detail="Solo las organizaciones pueden actualizar postulaciones")
    
    postulacion = db.query(Postulacion).filter(Postulacion.id == postulacion_id).first()
    if not postulacion:
        raise HTTPException(status_code=404, detail="Postulación no encontrada")
    
    evento = db.query(Evento).filter(Evento.id == postulacion.id_evento).first()
    if not evento:
        raise HTTPException(status_code=404, detail="Evento no encontrado")
    
    organizacion = db.query(Organizacion).filter(Organizacion.id_usuario == current_user.id).first()
    if not organizacion or evento.id_organizacion != organizacion.id:
        raise HTTPException(status_code=403, detail="No tienes permiso para actualizar esta postulación")
    
    postulacion.estado = postulacion_update.estado
    postulacion.nota_respuesta = postulacion_update.nota_respuesta
    postulacion.fecha_respuesta = datetime.utcnow()
    
    db.commit()
    db.refresh(postulacion)
    return postulacion

