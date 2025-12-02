from pydantic import BaseModel
from typing import Optional

class OrganizacionCreate(BaseModel):
    nombre: str
    nombre_corto: Optional[str] = None
    descripcion: Optional[str] = None
    direccion: Optional[str] = None
    nombre_contacto: Optional[str] = None
    telefono_contacto: Optional[str] = None
    sitio_web: Optional[str] = None

class OrganizacionResponse(BaseModel):
    id: int
    nombre: str
    descripcion: Optional[str]
    ciudad: str
    sitio_web: Optional[str]
    
    class Config:
        from_attributes = True


