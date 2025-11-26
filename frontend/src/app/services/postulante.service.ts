import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Postulante, PostulanteCreate } from '../models/postulante.model';
import { ApiConfig } from './api.config';

@Injectable({
  providedIn: 'root'
})
export class PostulanteService {
  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfig
  ) {}

  createPostulante(post: PostulanteCreate): Observable<Postulante> {
    return this.http.post<Postulante>(
      this.apiConfig.getApiUrl('/postulantes/'),
      post
    );
  }

  getMyProfile(): Observable<Postulante> {
    return this.http.get<Postulante>(
      this.apiConfig.getApiUrl('/postulantes/me')
    );
  }
}

