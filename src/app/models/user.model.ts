export interface Usuario {
  id_usuario?: number;
  nombre: string;
  apellido: string;
  email: string;
  password_hash?: string;
  tipo: TipoUsuario;
  fecha_registro?: Date;
}

export enum TipoUsuario {
  VOLUNTARIO = 'VOLUNTARIO',
  ORGANIZACION = 'ORGANIZACION'
}