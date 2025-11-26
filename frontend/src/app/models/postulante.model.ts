export interface Postulante {
  id: number;
  nombres: string;
  apellidos: string;
  fecha_nacimiento?: string;
  ciudad: string;
  telefono?: string;
  educacion?: string;
  biografia?: string;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

export interface PostulanteCreate {
  nombres: string;
  apellidos: string;
  fecha_nacimiento?: string;
  telefono?: string;
  educacion?: string;
  biografia?: string;
}


