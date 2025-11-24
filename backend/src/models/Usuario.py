from sqlalchemy import Column, BigInteger, String, Integer, Enum as SQLEnum, TIMESTAMP
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base
from models.enums import RolEnum

class Usuario(Base):
    __tablename__ = "usuarios"
    id = Column(BigInteger, primary_key=True, index=True)
    correo = Column(String(255), unique=True, nullable=False)
    contrasena_hash = Column(String(255), nullable=False)
    rol = Column(SQLEnum(RolEnum), nullable=False)
    telefono = Column(String(30))
    avatar_url = Column(String(500))
    activo = Column(Integer, default=1)
    fecha_creacion = Column(TIMESTAMP, default=datetime.utcnow)
    fecha_actualizacion = Column(TIMESTAMP, default=datetime.utcnow, onupdate=datetime.utcnow)
    ultimo_login = Column(TIMESTAMP, nullable=True)
    
    organizacion = relationship("Organizacion", back_populates="usuario", uselist=False, cascade="all, delete-orphan")
    postulante = relationship("Postulante", back_populates="usuario", uselist=False, cascade="all, delete-orphan")

