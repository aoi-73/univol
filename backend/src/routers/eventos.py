from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional, List
from models import Usuario, Organizacion, Evento, Postulacion, Postulante
from models.enums import RolEnum, EstadoEventoEnum
from schemas import EventoCreate, EventoResponse, PostulacionConPostulanteResponse, PostulanteResponse
from utils.auth import get_db, get_current_user

router = APIRouter(prefix="/eventos", tags=["eventos"])

@router.post("/", response_model=EventoResponse)
def crear_evento(evento: EventoCreate, current_user: Usuario = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.rol != RolEnum.organizacion:
        raise HTTPException(status_code=403, detail="Solo las organizaciones pueden crear eventos")
    
    org = db.query(Organizacion).filter(Organizacion.id_usuario == current_user.id).first()
    if not org:
        raise HTTPException(status_code=404, detail="Debe crear un perfil de organización primero")
    
    try:
        nuevo_evento = Evento(id_organizacion=org.id, **evento.dict())
        db.add(nuevo_evento)
        db.commit()
        db.refresh(nuevo_evento)
        return nuevo_evento
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al crear el evento: {str(e)}")

@router.get("/", response_model=List[EventoResponse])
def listar_eventos(estado: Optional[EstadoEventoEnum] = None, db: Session = Depends(get_db)):
    query = db.query(Evento)
    if estado:
        query = query.filter(Evento.estado == estado)
    return query.all()

@router.get("/{evento_id}", response_model=EventoResponse)
def obtener_evento(evento_id: int, db: Session = Depends(get_db)):
    evento = db.query(Evento).filter(Evento.id == evento_id).first()
    if not evento:
        raise HTTPException(status_code=404, detail="Evento no encontrado")
    return evento

@router.get("/{evento_id}/postulaciones", response_model=List[PostulacionConPostulanteResponse])
def obtener_postulaciones_evento(evento_id: int, current_user: Usuario = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.rol != RolEnum.organizacion:
        raise HTTPException(status_code=403, detail="Solo las organizaciones pueden ver postulaciones")
    
    evento = db.query(Evento).filter(Evento.id == evento_id).first()
    if not evento:
        raise HTTPException(status_code=404, detail="Evento no encontrado")
    
    organizacion = db.query(Organizacion).filter(Organizacion.id_usuario == current_user.id).first()
    if not organizacion or evento.id_organizacion != organizacion.id:
        raise HTTPException(status_code=403, detail="No tienes permiso para ver las postulaciones de este evento")
    
    postulaciones = db.query(Postulacion).filter(Postulacion.id_evento == evento_id).all()
    result = []
    for post in postulaciones:
        postulante = db.query(Postulante).filter(Postulante.id == post.id_postulante).first()
        post_dict = {
            "id": post.id,
            "id_evento": post.id_evento,
            "id_postulante": post.id_postulante,
            "estado": post.estado,
            "fecha_postulacion": post.fecha_postulacion,
            "fecha_respuesta": post.fecha_respuesta,
            "mensaje": post.mensaje,
            "nota_respuesta": post.nota_respuesta,
            "postulante": PostulanteResponse(
                id=postulante.id,
                nombres=postulante.nombres,
                apellidos=postulante.apellidos,
                ciudad=postulante.ciudad,
                educacion=postulante.educacion
            ) if postulante else None
        }
        result.append(post_dict)
    return result

