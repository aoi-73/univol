import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Postulacion, PostulacionCreate, PostulacionUpdate, EstadoPostulacionEnum } from '../models/event.model';
import { ApiConfig } from './api.config';

@Injectable({
  providedIn: 'root'
})
export class PostulacionService {
  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfig
  ) {}

  createPostulacion(post: PostulacionCreate): Observable<Postulacion> {
    return this.http.post<Postulacion>(
      this.apiConfig.getApiUrl('/postulaciones/'),
      post
    );
  }

  getMyPostulaciones(): Observable<Postulacion[]> {
    return this.http.get<Postulacion[]>(
      this.apiConfig.getApiUrl('/postulaciones/mis-postulaciones')
    );
  }

  getPostulacionesByEvento(eventoId: number): Observable<Postulacion[]> {
    return this.http.get<Postulacion[]>(
      this.apiConfig.getApiUrl(`/eventos/${eventoId}/postulaciones`)
    );
  }

  updatePostulacion(postulacionId: number, update: PostulacionUpdate): Observable<Postulacion> {
    return this.http.put<Postulacion>(
      this.apiConfig.getApiUrl(`/postulaciones/${postulacionId}`),
      update
    );
  }

  aceptarPostulacion(postulacionId: number, nota?: string): Observable<Postulacion> {
    return this.updatePostulacion(postulacionId, {
      estado: EstadoPostulacionEnum.aceptado,
      nota_respuesta: nota
    });
  }

  rechazarPostulacion(postulacionId: number, nota?: string): Observable<Postulacion> {
    return this.updatePostulacion(postulacionId, {
      estado: EstadoPostulacionEnum.rechazado,
      nota_respuesta: nota
    });
  }
}

