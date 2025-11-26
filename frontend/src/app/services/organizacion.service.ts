import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Organizacion, OrganizacionCreate } from '../models/organizacion.model';
import { ApiConfig } from './api.config';

@Injectable({
  providedIn: 'root'
})
export class OrganizacionService {
  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfig
  ) {}

  createOrganizacion(org: OrganizacionCreate): Observable<Organizacion> {
    return this.http.post<Organizacion>(
      this.apiConfig.getApiUrl('/organizaciones/'),
      org
    );
  }

  getOrganizacionById(orgId: number): Observable<Organizacion> {
    return this.http.get<Organizacion>(
      this.apiConfig.getApiUrl(`/organizaciones/${orgId}`)
    );
  }

  getMyOrganizacion(): Observable<Organizacion> {
    return this.http.get<Organizacion>(
      this.apiConfig.getApiUrl('/organizaciones/me')
    );
  }
}

