import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfig } from './api.config';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfig
  ) {}

  uploadAvatar(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.http.post<{ url: string }>(
      this.apiConfig.getApiUrl('/upload/avatar'),
      formData
    );
  }

  uploadEventImage(eventoId: number, file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    console.log(file)
    
    return this.http.post<{ url: string }>(
      this.apiConfig.getApiUrl(`/upload/evento/${eventoId}`),
      formData
    );
  }
}


