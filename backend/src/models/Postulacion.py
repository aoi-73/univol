from sqlalchemy import Column, BigInteger, Text, Enum as SQLEnum, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base
from models.enums import EstadoPostulacionEnum

class Postulacion(Base):
    __tablename__ = "postulaciones"
    id = Column(BigInteger, primary_key=True, index=True)
    id_evento = Column(BigInteger, ForeignKey('eventos.id', ondelete='CASCADE'), nullable=False)
    id_postulante = Column(BigInteger, ForeignKey('postulantes.id', ondelete='CASCADE'), nullable=False)
    mensaje = Column(Text)
    estado = Column(SQLEnum(EstadoPostulacionEnum), default=EstadoPostulacionEnum.postulado)
    fecha_postulacion = Column(TIMESTAMP, default=datetime.utcnow)
    fecha_respuesta = Column(TIMESTAMP, nullable=True)
    nota_respuesta = Column(Text)
    
    evento = relationship("Evento", back_populates="postulaciones")
    postulante = relationship("Postulante", back_populates="postulaciones")


