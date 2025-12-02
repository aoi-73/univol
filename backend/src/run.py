import sys
from pathlib import Path

# Agregar el directorio backend al PYTHONPATH
backend_dir = Path(__file__).parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

if __name__ == "__main__":
    import uvicorn
    from main import app
    uvicorn.run(app, host="0.0.0.0", port=8000)


