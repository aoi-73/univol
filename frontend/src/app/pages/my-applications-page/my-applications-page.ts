import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { PostulacionService } from '../../services/postulacion.service';
import { EventService } from '../../services/event.service';
import { AuthService } from '../../services/auth';
import { Postulacion, EstadoPostulacionEnum } from '../../models/event.model';
import { Evento } from '../../models/event.model';

@Component({
  selector: 'app-my-applications-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-applications-page.html',
  styleUrls: ['./my-applications-page.css']
})
export class MyApplicationsPage implements OnInit {
  postulaciones: Postulacion[] = [];
  eventos: Map<number, Evento> = new Map();
  isLoading = true;

  constructor(
    private postulacionService: PostulacionService,
    private eventService: EventService,
    public authService: AuthService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.loadPostulaciones();
  }

  loadPostulaciones(): void {
    this.isLoading = true;
    this.postulacionService.getMyPostulaciones().subscribe({
      next: (postulaciones) => {
        this.postulaciones = postulaciones;
        // Cargar información de eventos
        postulaciones.forEach(post => {
          this.eventService.getEventById(post.id_evento).subscribe({
            next: (evento) => {
              this.eventos.set(post.id_evento, evento);
            }
          });
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading applications:', error);
        this.isLoading = false;
      }
    });
  }

  getEstadoColor(estado: EstadoPostulacionEnum): string {
    switch (estado) {
      case EstadoPostulacionEnum.aceptado:
        return 'bg-green-500/20 text-green-400';
      case EstadoPostulacionEnum.rechazado:
        return 'bg-red-500/20 text-red-400';
      case EstadoPostulacionEnum.revision:
        return 'bg-yellow-500/20 text-yellow-400';
      default:
        return 'bg-blue-500/20 text-blue-400';
    }
  }

  getEstadoLabel(estado: EstadoPostulacionEnum): string {
    switch (estado) {
      case EstadoPostulacionEnum.aceptado:
        return 'Aceptado';
      case EstadoPostulacionEnum.rechazado:
        return 'Rechazado';
      case EstadoPostulacionEnum.revision:
        return 'En Revisión';
      case EstadoPostulacionEnum.postulado:
        return 'Postulado';
      case EstadoPostulacionEnum.cancelado:
        return 'Cancelado';
      default:
        return estado;
    }
  }

  formatDate(date: string | Date): string {
    const d = new Date(date);
    return d.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}


