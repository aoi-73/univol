import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EventService } from '../../services/event.service';
import { UploadService } from '../../services/upload.service';
import { AuthService } from '../../services/auth';
import { EventoCreate } from '../../models/event.model';

@Component({
  selector: 'app-create-event-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-event-page.html',
  styleUrls: ['./create-event-page.css']
})
export class CreateEventPage implements OnInit {
  eventForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  selectedImageFile: File | null = null;
  imagePreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private uploadService: UploadService,
    private authService: AuthService,
    public router: Router
  ) {
    this.eventForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: [''],
      descripcion_corta: ['', [Validators.required, Validators.minLength(10)]],
      fecha_inicio: ['', Validators.required],
      fecha_fin: ['', Validators.required],
      ubicacion: ['', [Validators.required, Validators.minLength(3)]],
      cupo_maximo: ['']
    });
  }

  ngOnInit(): void {
    if (!this.authService.isAuthenticated() || !this.authService.isOrganization()) {
      this.router.navigate(['/']);
    }
  }

  get f() {
    return this.eventForm.controls;
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        this.errorMessage = 'El archivo debe ser una imagen';
        return;
      }
      
      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = 'La imagen no debe superar los 5MB';
        return;
      }
      
      this.selectedImageFile = file;
      
      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.eventForm.invalid) {
      this.eventForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const formValue = this.eventForm.value;
    const evento: EventoCreate = {
      titulo: formValue.titulo,
      descripcion: formValue.descripcion || undefined,
      descripcion_corta: formValue.descripcion_corta || undefined,
      fecha_inicio: new Date(formValue.fecha_inicio).toISOString(),
      fecha_fin: new Date(formValue.fecha_fin).toISOString(),
      ubicacion: formValue.ubicacion || undefined,
      cupo_maximo: formValue.cupo_maximo ? parseInt(formValue.cupo_maximo) : undefined
    };

    // Crear evento primero
    this.eventService.createEvent(evento).subscribe({
      next: (createdEvent) => {
        // Si hay imagen, subirla después de crear el evento
        if (this.selectedImageFile) {
          this.uploadService.uploadEventImage(createdEvent.id, this.selectedImageFile).subscribe({
            next: () => {
              this.isSubmitting = false;
              alert('Evento creado exitosamente!');
              this.router.navigate(['/']);
            },
            error: (error) => {
              this.isSubmitting = false;
              this.errorMessage = error.error?.detail || 'Evento creado pero error al subir la imagen.';
            }
          });
        } else {
          this.isSubmitting = false;
          alert('Evento creado exitosamente!');
          this.router.navigate(['/']);
        }
      },
      error: (error) => {
        this.isSubmitting = false;
        console.log(error)
        this.errorMessage = error.error?.detail || 'Error al crear el evento. Intenta nuevamente.';
      }
    });
  }
}
