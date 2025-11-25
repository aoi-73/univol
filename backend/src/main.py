import sys
from pathlib import Path

# Agregar el directorio backend al PYTHONPATH
backend_dir = Path(__file__).parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from routers import auth, organizaciones, postulantes, eventos, postulaciones, uploads

# FastAPI App
app = FastAPI(title="API Voluntariado Huancayo")

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers
app.include_router(auth.router)
app.include_router(organizaciones.router)
app.include_router(postulantes.router)
app.include_router(eventos.router)
app.include_router(postulaciones.router)
app.include_router(uploads.router)

# Montar directorio de uploads para servir archivos estáticos
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

