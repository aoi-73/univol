from pathlib import Path

# Configuración de seguridad
SECRET_KEY = "tu-clave-secreta-segura-cambiala-en-produccion"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Configuración de archivos
UPLOAD_DIR = Path("uploads")
AVATAR_DIR = UPLOAD_DIR / "avatars"
EVENT_IMAGE_DIR = UPLOAD_DIR / "eventos"

# Crear directorios si no existen
UPLOAD_DIR.mkdir(exist_ok=True)
AVATAR_DIR.mkdir(exist_ok=True)
EVENT_IMAGE_DIR.mkdir(exist_ok=True)


