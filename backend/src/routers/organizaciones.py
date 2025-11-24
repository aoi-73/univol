from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models import Usuario, Organizacion
from models.enums import RolEnum
from schemas import OrganizacionCreate, OrganizacionResponse
from utils.auth import get_db, get_current_user

router = APIRouter(prefix="/organizaciones", tags=["organizaciones"])

@router.post("/", response_model=OrganizacionResponse)
def crear_organizacion(org: OrganizacionCreate, current_user: Usuario = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.rol != RolEnum.organizacion:
        raise HTTPException(status_code=403, detail="Solo las organizaciones pueden crear perfiles")
    
    nueva_org = Organizacion(id_usuario=current_user.id, **org.dict())
    db.add(nueva_org)
    db.commit()
    db.refresh(nueva_org)
    return nueva_org

@router.get("/me", response_model=OrganizacionResponse)
def obtener_mi_organizacion(current_user: Usuario = Depends(get_current_user), db: Session = Depends(get_db)):
    org = db.query(Organizacion).filter(Organizacion.id_usuario == current_user.id).first()
    if not org:
        raise HTTPException(status_code=404, detail="Perfil no encontrado")
    return org

@router.get("/{org_id}", response_model=OrganizacionResponse)
def obtener_organizacion(org_id: int, db: Session = Depends(get_db)):
    org = db.query(Organizacion).filter(Organizacion.id == org_id).first()
    if not org:
        raise HTTPException(status_code=404, detail="Organización no encontrada")
    return org

