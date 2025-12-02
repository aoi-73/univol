from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from models.enums import EstadoEventoEnum

class EventoCreate(BaseModel):
    titulo: str
    descripcion: Optional[str] = None
    descripcion_corta: Optional[str] = None
    fecha_inicio: datetime
    fecha_fin: datetime
    ubicacion: Optional[str] = None
    cupo_maximo: Optional[int] = None

class EventoResponse(BaseModel):
    id: int
    titulo: str
    descripcion_corta: Optional[str]
    fecha_inicio: datetime
    fecha_fin: datetime
    ubicacion: Optional[str]
    estado: EstadoEventoEnum
    imagen_url: Optional[str] = None
    cupo_maximo: Optional[int]
    id_organizacion: int
    
    class Config:
        from_attributes = True


