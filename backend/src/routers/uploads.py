from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
import shutil
from pathlib import Path
from datetime import datetime
from models import Usuario, Evento, Organizacion
from models.enums import RolEnum
from utils.auth import get_db, get_current_user
from utils.config import AVATAR_DIR, EVENT_IMAGE_DIR

router = APIRouter(prefix="/upload", tags=["uploads"])

@router.post("/avatar")
async def upload_avatar(
    file: UploadFile = File(...),
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Validar tipo de archivo
    if not file.content_type or not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="El archivo debe ser una imagen")
    
    # Generar nombre único
    file_extension = Path(file.filename).suffix
    unique_filename = f"{current_user.id}_{datetime.utcnow().timestamp()}{file_extension}"
    file_path = AVATAR_DIR / unique_filename
    
    # Guardar archivo
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Actualizar URL en la base de datos
    avatar_url = f"/uploads/avatars/{unique_filename}"
    current_user.avatar_url = avatar_url
    db.commit()
    db.refresh(current_user)
    
    return {"url": avatar_url}

@router.post("/evento/{evento_id}")
async def upload_evento_imagen(
    evento_id: int,
    file: UploadFile = File(...),
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.rol != RolEnum.organizacion:
        raise HTTPException(status_code=403, detail="Solo las organizaciones pueden subir imágenes de eventos")
    
    evento = db.query(Evento).filter(Evento.id == evento_id).first()
    if not evento:
        raise HTTPException(status_code=404, detail="Evento no encontrado")
    
    organizacion = db.query(Organizacion).filter(Organizacion.id_usuario == current_user.id).first()
    if not organizacion or evento.id_organizacion != organizacion.id:
        raise HTTPException(status_code=403, detail="No tienes permiso para subir imágenes de este evento")
    
    # Validar tipo de archivo
    if not file.content_type or not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="El archivo debe ser una imagen")
    
    # Generar nombre único
    file_extension = Path(file.filename).suffix
    unique_filename = f"evento_{evento_id}_{datetime.utcnow().timestamp()}{file_extension}"
    file_path = EVENT_IMAGE_DIR / unique_filename
    
    # Guardar archivo
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Actualizar URL en la base de datos
    imagen_url = f"/uploads/eventos/{unique_filename}"
    evento.imagen_url = imagen_url
    db.commit()
    db.refresh(evento)
    
    return {"url": imagen_url}

