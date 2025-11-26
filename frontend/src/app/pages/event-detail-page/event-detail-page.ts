import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EventService } from '../../services/event.service';
import { PostulacionService } from '../../services/postulacion.service';
import { AuthService } from '../../services/auth';
import { Evento } from '../../models/event.model';

@Component({
  selector: 'app-event-detail-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './event-detail-page.html',
  styleUrls: ['./event-detail-page.css']
})
export class EventDetailPage implements OnInit {
  event: Evento | null = null;
  isLoading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private eventService: EventService,
    private postulacionService: PostulacionService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      this.loadEvent(parseInt(eventId));
    }
  }

  loadEvent(id: number): void {
    this.isLoading = true;
    this.eventService.getEventById(id).subscribe({
      next: (event) => {
        this.event = event;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar el evento';
        this.isLoading = false;
      }
    });
  }

  applyToEvent(): void {
    if (!this.event) return;

    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: `/eventos/${this.event.id}` } });
      return;
    }

    if (!this.authService.isPostulante()) {
      alert('Solo los postulantes pueden aplicar a eventos');
      return;
    }

    this.postulacionService.createPostulacion({ id_evento: this.event.id }).subscribe({
      next: () => {
        alert('Postulación enviada exitosamente!');
        this.loadEvent(this.event!.id);
      },
      error: (error) => {
        const message = error.error?.detail || 'Error al postularse al evento';
        alert(message);
      }
    });
  }

  formatDateTime(date: string | Date): string {
    const d = new Date(date);
    return d.toLocaleString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}


