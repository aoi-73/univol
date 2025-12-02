from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class PostulanteCreate(BaseModel):
    nombres: str
    apellidos: str
    fecha_nacimiento: Optional[datetime] = None
    telefono: Optional[str] = None
    educacion: Optional[str] = None
    biografia: Optional[str] = None

class PostulanteResponse(BaseModel):
    id: int
    nombres: str
    apellidos: str
    ciudad: str
    educacion: Optional[str]
    
    class Config:
        from_attributes = True


