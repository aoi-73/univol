from pydantic import BaseModel, EmailStr
from typing import Optional
from models.enums import RolEnum

class UsuarioCreate(BaseModel):
    correo: EmailStr
    contrasena: str
    rol: RolEnum
    telefono: Optional[str] = None

class UsuarioResponse(BaseModel):
    id: int
    correo: str
    rol: RolEnum
    telefono: Optional[str]
    activo: bool
    
    class Config:
        from_attributes = True

