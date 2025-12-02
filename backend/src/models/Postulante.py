from sqlalchemy import Column, BigInteger, String, DateTime, Text, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class Postulante(Base):
    __tablename__ = "postulantes"
    id = Column(BigInteger, primary_key=True, index=True)
    id_usuario = Column(BigInteger, ForeignKey('usuarios.id', ondelete='CASCADE'), nullable=False, unique=True)
    nombres = Column(String(120))
    apellidos = Column(String(120))
    fecha_nacimiento = Column(DateTime)
    ciudad = Column(String(100), default="Huancayo")
    telefono = Column(String(30))
    educacion = Column(String(255))
    biografia = Column(Text)
    fecha_creacion = Column(TIMESTAMP, default=datetime.utcnow)
    fecha_actualizacion = Column(TIMESTAMP, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    usuario = relationship("Usuario", back_populates="postulante")
    postulaciones = relationship("Postulacion", back_populates="postulante", cascade="all, delete-orphan")


