import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { EventService } from '../../services/event.service';
import { AuthService } from '../../services/auth';
import { PostulacionService } from '../../services/postulacion.service';
import { OrganizacionService } from '../../services/organizacion.service';
import { Evento, EstadoEventoEnum } from '../../models/event.model';
import { Postulacion } from '../../models/event.model';
import { Organizacion } from '../../models/organizacion.model';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage implements OnInit {
  events: Evento[] = [];
  myEvents: Evento[] = [];
  otherEvents: Evento[] = [];
  currentUser$;
  isLoading = true;
  myOrganization: Organizacion | null = null;

  constructor(
    private eventService: EventService,
    public authService: AuthService,
    private postulacionService: PostulacionService,
    private organizacionService: OrganizacionService,
    public router: Router
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {
    if (this.authService.isOrganization()) {
      this.loadMyOrganization();
    }
    this.loadEvents();
  }

  loadMyOrganization(): void {
    this.organizacionService.getMyOrganizacion().subscribe({
      next: (org) => {
        this.myOrganization = org;
        // Separar eventos si ya están cargados
        if (this.events.length > 0) {
          this.separateEvents();
        }
      },
      error: (error) => {
        console.error('Error loading organization:', error);
        // Si no tiene organización, simplemente mostrar todos los eventos juntos
        this.myOrganization = null;
        this.myEvents = [];
        this.otherEvents = this.events;
      }
    });
  }

  loadEvents(): void {
    this.isLoading = true;
    this.eventService.getEvents(EstadoEventoEnum.publicado).subscribe({
      next: (events) => {
        this.events = events;
        // Si es organización y ya tenemos la organización cargada, separar eventos
        if (this.authService.isOrganization() && this.myOrganization) {
          this.separateEvents();
        } else if (!this.authService.isOrganization()) {
          // Si no es organización, mantener eventos juntos
          this.myEvents = [];
          this.otherEvents = [];
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading events:', error);
        this.isLoading = false;
      }
    });
  }

  separateEvents(): void {
    if (!this.myOrganization) {
      this.myEvents = [];
      this.otherEvents = this.events;
      return;
    }

    console.log('Separating events...');
    console.log('My organization ID:', this.myOrganization.id);
    console.log('Total events:', this.events.length);
    console.log('Events with id_organizacion:', this.events.map(e => ({ id: e.id, id_organizacion: e.id_organizacion, titulo: e.titulo })));

    this.myEvents = this.events.filter(
      event => event.id_organizacion === this.myOrganization!.id
    );
    this.otherEvents = this.events.filter(
      event => event.id_organizacion !== this.myOrganization!.id
    );

    console.log('My events:', this.myEvents.length);
    console.log('Other events:', this.otherEvents.length);
  }

  applyToEvent(eventId: number): void {
    if (!this.authService.isAuthenticated()) {
      alert('Debes iniciar sesión para postularte');
      this.router.navigate(['/login']);
      return;
    }

    if (!this.authService.isPostulante()) {
      alert('Solo los postulantes pueden aplicar a eventos');
      return;
    }

    this.postulacionService.createPostulacion({ id_evento: eventId }).subscribe({
      next: () => {
        alert('Postulación enviada exitosamente!');
        this.loadEvents();
        if (this.authService.isOrganization() && this.myOrganization) {
          this.separateEvents();
        }
      },
      error: (error) => {
        const message = error.error?.detail || 'Error al postularse al evento';
        alert(message);
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }

  formatDate(date: string | Date): string {
    const d = new Date(date);
    return d.toLocaleDateString('es-ES', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  formatDateTime(date: string | Date): string {
    const d = new Date(date);
    return d.toLocaleString('es-ES', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
