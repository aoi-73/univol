import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiConfig {
  private readonly baseUrl = 'http://localhost:8000';

  getBaseUrl(): string {
    return this.baseUrl;
  }

  getApiUrl(endpoint: string): string {
    return `${this.baseUrl}${endpoint}`;
  }
}


