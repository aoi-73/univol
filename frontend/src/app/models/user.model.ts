export enum RolEnum {
  postulante = 'postulante',
  organizacion = 'organizacion'
}

export interface Usuario {
  id: number;
  correo: string;
  rol: RolEnum;
  telefono?: string;
  avatar_url?: string;
  activo: boolean;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
  ultimo_login?: string;
}

export interface UsuarioCreate {
  correo: string;
  contrasena: string;
  rol: RolEnum;
  telefono?: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface LoginRequest {
  username: string; // OAuth2 usa 'username' para el correo
  password: string;
}
