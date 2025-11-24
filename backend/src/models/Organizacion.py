from sqlalchemy import Column, BigInteger, String, Text, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class Organizacion(Base):
    __tablename__ = "organizaciones"
    id = Column(BigInteger, primary_key=True, index=True)
    id_usuario = Column(BigInteger, ForeignKey('usuarios.id', ondelete='CASCADE'), nullable=False, unique=True)
    nombre = Column(String(200), nullable=False)
    nombre_corto = Column(String(120))
    descripcion = Column(Text)
    direccion = Column(String(500))
    ciudad = Column(String(100), default="Huancayo")
    nombre_contacto = Column(String(200))
    telefono_contacto = Column(String(30))
    sitio_web = Column(String(255))
    fecha_creacion = Column(TIMESTAMP, default=datetime.utcnow)
    fecha_actualizacion = Column(TIMESTAMP, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    usuario = relationship("Usuario", back_populates="organizacion")
    eventos = relationship("Evento", back_populates="organizacion", cascade="all, delete-orphan")

