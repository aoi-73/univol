from sqlalchemy import Column, BigInteger, String, Text, DateTime, Integer, Enum as SQLEnum, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base
from models.enums import EstadoEventoEnum

class Evento(Base):
    __tablename__ = "eventos"
    id = Column(BigInteger, primary_key=True, index=True)
    id_organizacion = Column(BigInteger, ForeignKey('organizaciones.id', ondelete='CASCADE'), nullable=False)
    titulo = Column(String(250), nullable=False)
    descripcion = Column(Text)
    descripcion_corta = Column(String(500))
    fecha_inicio = Column(DateTime, nullable=False)
    fecha_fin = Column(DateTime, nullable=False)
    ubicacion = Column(String(500))
    imagen_url = Column(String(500), nullable=True)
    cupo_maximo = Column(Integer, nullable=True)
    estado = Column(SQLEnum(EstadoEventoEnum), default=EstadoEventoEnum.borrador)
    fecha_publicacion = Column(TIMESTAMP, nullable=True)
    fecha_creacion = Column(TIMESTAMP, default=datetime.utcnow)
    fecha_actualizacion = Column(TIMESTAMP, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    organizacion = relationship("Organizacion", back_populates="eventos")
    postulaciones = relationship("Postulacion", back_populates="evento", cascade="all, delete-orphan")

