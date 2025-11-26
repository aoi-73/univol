export interface Organizacion {
  id: number;
  nombre: string;
  nombre_corto?: string;
  descripcion?: string;
  direccion?: string;
  ciudad: string;
  nombre_contacto?: string;
  telefono_contacto?: string;
  sitio_web?: string;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

export interface OrganizacionCreate {
  nombre: string;
  nombre_corto?: string;
  descripcion?: string;
  direccion?: string;
  nombre_contacto?: string;
  telefono_contacto?: string;
  sitio_web?: string;
}


