from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from models.enums import EstadoPostulacionEnum
from schemas.postulante import PostulanteResponse

class PostulacionCreate(BaseModel):
    id_evento: int
    mensaje: Optional[str] = None

class PostulacionResponse(BaseModel):
    id: int
    id_evento: int
    id_postulante: Optional[int] = None
    estado: EstadoPostulacionEnum
    fecha_postulacion: datetime
    fecha_respuesta: Optional[datetime] = None
    mensaje: Optional[str]
    nota_respuesta: Optional[str] = None
    
    class Config:
        from_attributes = True

class PostulacionConPostulanteResponse(PostulacionResponse):
    postulante: Optional[PostulanteResponse] = None

class PostulacionUpdate(BaseModel):
    estado: EstadoPostulacionEnum
    nota_respuesta: Optional[str] = None


