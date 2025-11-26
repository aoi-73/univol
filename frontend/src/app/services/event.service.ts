import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evento, EventoCreate, EstadoEventoEnum } from '../models/event.model';
import { ApiConfig } from './api.config';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfig
  ) {}

  getEvents(estado?: EstadoEventoEnum): Observable<Evento[]> {
    let params = new HttpParams();
    if (estado) {
      params = params.set('estado', estado);
    }
    
    return this.http.get<Evento[]>(
      this.apiConfig.getApiUrl('/eventos/'),
      { params }
    );
  }

  getEventById(eventoId: number): Observable<Evento> {
    return this.http.get<Evento>(
      this.apiConfig.getApiUrl(`/eventos/${eventoId}`)
    );
  }

  createEvent(evento: EventoCreate): Observable<Evento> {
    return this.http.post<Evento>(
      this.apiConfig.getApiUrl('/eventos/'),
      evento
    );
  }

  updateEvent(eventoId: number, evento: Partial<EventoCreate>): Observable<Evento> {
    return this.http.put<Evento>(
      this.apiConfig.getApiUrl(`/eventos/${eventoId}`),
      evento
    );
  }
}
