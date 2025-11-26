import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PostulacionService } from '../../services/postulacion.service';
import { EventService } from '../../services/event.service';
import { AuthService } from '../../services/auth';
import { Postulacion, EstadoPostulacionEnum } from '../../models/event.model';
import { Evento } from '../../models/event.model';

@Component({
  selector: 'app-event-applications-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './event-applications-page.html',
  styleUrls: ['./event-applications-page.css']
})
export class EventApplicationsPage implements OnInit {
  evento: Evento | null = null;
  postulaciones: Postulacion[] = [];
  isLoading = true;
  errorMessage = '';
  processingId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private postulacionService: PostulacionService,
    private eventService: EventService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAuthenticated() || !this.authService.isOrganization()) {
      this.router.navigate(['/']);
      return;
    }

    const eventoId = this.route.snapshot.paramMap.get('id');
    if (eventoId) {
      this.loadEvento(parseInt(eventoId));
      this.loadPostulaciones(parseInt(eventoId));
    }
  }

  loadEvento(id: number): void {
    this.eventService.getEventById(id).subscribe({
      next: (evento) => {
        this.evento = evento;
      },
      error: (error) => {
        console.error('Error loading event:', error);
      }
    });
  }

  loadPostulaciones(eventoId: number): void {
    this.isLoading = true;
    this.postulacionService.getPostulacionesByEvento(eventoId).subscribe({
      next: (postulaciones) => {
        this.postulaciones = postulaciones;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.detail || 'Error al cargar las postulaciones';
        this.isLoading = false;
      }
    });
  }

  aceptarPostulacion(postulacion: Postulacion): void {
    if (!confirm(`¿Aceptar la postulación de ${postulacion.postulante?.nombres} ${postulacion.postulante?.apellidos}?`)) {
      return;
    }

    this.processingId = postulacion.id;
    this.postulacionService.aceptarPostulacion(postulacion.id).subscribe({
      next: () => {
        this.processingId = null;
        if (this.evento) {
          this.loadPostulaciones(this.evento.id);
        }
      },
      error: (error) => {
        this.processingId = null;
        alert(error.error?.detail || 'Error al aceptar la postulación');
      }
    });
  }

  rechazarPostulacion(postulacion: Postulacion): void {
    if (!confirm(`¿Rechazar la postulación de ${postulacion.postulante?.nombres} ${postulacion.postulante?.apellidos}?`)) {
      return;
    }

    this.processingId = postulacion.id;
    this.postulacionService.rechazarPostulacion(postulacion.id).subscribe({
      next: () => {
        this.processingId = null;
        if (this.evento) {
          this.loadPostulaciones(this.evento.id);
        }
      },
      error: (error) => {
        this.processingId = null;
        alert(error.error?.detail || 'Error al rechazar la postulación');
      }
    });
  }

  getEstadoColor(estado: EstadoPostulacionEnum): string {
    switch (estado) {
      case EstadoPostulacionEnum.aceptado:
        return 'bg-green-500/20 text-green-400 border-green-500';
      case EstadoPostulacionEnum.rechazado:
        return 'bg-red-500/20 text-red-400 border-red-500';
      case EstadoPostulacionEnum.revision:
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500';
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

  canModify(postulacion: Postulacion): boolean {
    return postulacion.estado === EstadoPostulacionEnum.postulado || 
           postulacion.estado === EstadoPostulacionEnum.revision;
  }
}


