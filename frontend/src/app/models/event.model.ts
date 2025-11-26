export enum EstadoEventoEnum {
  borrador = 'borrador',
  publicado = 'publicado',
  cancelado = 'cancelado',
  completado = 'completado'
}

export enum EstadoPostulacionEnum {
  postulado = 'postulado',
  revision = 'revision',
  aceptado = 'aceptado',
  rechazado = 'rechazado',
  cancelado = 'cancelado'
}

export interface Evento {
  id: number;
  titulo: string;
  descripcion?: string;
  descripcion_corta?: string;
  fecha_inicio: string;
  fecha_fin: string;
  ubicacion?: string;
  cupo_maximo?: number;
  imagen_url?: string;
  estado: EstadoEventoEnum;
  fecha_publicacion?: string;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
  id_organizacion?: number;
}

export interface EventoCreate {
  titulo: string;
  descripcion?: string;
  descripcion_corta?: string;
  fecha_inicio: string;
  fecha_fin: string;
  ubicacion?: string;
  cupo_maximo?: number;
}

export interface Postulacion {
  id: number;
  id_evento: number;
  id_postulante?: number;
  mensaje?: string;
  estado: EstadoPostulacionEnum;
  fecha_postulacion: string;
  fecha_respuesta?: string;
  nota_respuesta?: string;
  postulante?: {
    id: number;
    nombres: string;
    apellidos: string;
    ciudad: string;
    educacion?: string;
  };
}

export interface PostulacionCreate {
  id_evento: number;
  mensaje?: string;
}

export interface PostulacionUpdate {
  estado: EstadoPostulacionEnum;
  nota_respuesta?: string;
}
