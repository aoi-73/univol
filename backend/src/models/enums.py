import enum

class RolEnum(str, enum.Enum):
    postulante = "postulante"
    organizacion = "organizacion"

class EstadoEventoEnum(str, enum.Enum):
    borrador = "borrador"
    publicado = "publicado"
    cancelado = "cancelado"
    completado = "completado"

class EstadoPostulacionEnum(str, enum.Enum):
    postulado = "postulado"
    revision = "revision"
    aceptado = "aceptado"
    rechazado = "rechazado"
    cancelado = "cancelado"

