import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { PostulanteService } from '../../services/postulante.service';
import { OrganizacionService } from '../../services/organizacion.service';
import { UploadService } from '../../services/upload.service';
import { PostulanteCreate } from '../../models/postulante.model';
import { OrganizacionCreate } from '../../models/organizacion.model';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile-page.html',
  styleUrls: ['./profile-page.css']
})
export class ProfilePage implements OnInit {
  profileForm: FormGroup = new FormGroup({});
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
  selectedAvatarFile: File | null = null;
  avatarPreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private postulanteService: PostulanteService,
    private organizacionService: OrganizacionService,
    private uploadService: UploadService,
    public router: Router
  ) {
    if (authService.isPostulante()) {
      this.profileForm = this.fb.group({
        nombres: ['', [Validators.required]],
        apellidos: ['', [Validators.required]],
        fecha_nacimiento: [''],
        telefono: [''],
        educacion: [''],
        biografia: ['']
      });
    } else if (authService.isOrganization()) {
      this.profileForm = this.fb.group({
        nombre: ['', [Validators.required]],
        nombre_corto: [''],
        descripcion: [''],
        direccion: [''],
        nombre_contacto: [''],
        telefono_contacto: [''],
        sitio_web: ['']
      });
    }
  }

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
    }
  }

  get f() {
    return this.profileForm.controls;
  }

  onAvatarSelected(event: Event): void {
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
      
      this.selectedAvatarFile = file;
      
      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.avatarPreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Primero subir el avatar si hay uno seleccionado
    const uploadAvatar = this.selectedAvatarFile 
      ? this.uploadService.uploadAvatar(this.selectedAvatarFile)
      : null;

    if (uploadAvatar) {
      uploadAvatar.subscribe({
        next: () => {
          // Avatar subido, continuar con el perfil
          this.createProfile();
        },
        error: (error) => {
          this.isSubmitting = false;
          this.errorMessage = error.error?.detail || 'Error al subir el avatar.';
        }
      });
    } else {
      // No hay avatar, crear perfil directamente
      this.createProfile();
    }
  }

  private createProfile(): void {
    if (this.authService.isPostulante()) {
      const postData: PostulanteCreate = this.profileForm.value;
      this.postulanteService.createPostulante(postData).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.successMessage = 'Perfil creado exitosamente!';
        },
        error: (error) => {
          this.isSubmitting = false;
          this.errorMessage = error.error?.detail || 'Error al crear el perfil.';
        }
      });
    } else if (this.authService.isOrganization()) {
      const orgData: OrganizacionCreate = this.profileForm.value;
      this.organizacionService.createOrganizacion(orgData).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.successMessage = 'Perfil de organización creado exitosamente!';
        },
        error: (error) => {
          this.isSubmitting = false;
          this.errorMessage = error.error?.detail || 'Error al crear el perfil.';
        }
      });
    }
  }
}

