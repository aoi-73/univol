import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RolEnum, UsuarioCreate } from '../../models/user.model';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-signup-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signup-page.html',
  styleUrls: ['./signup-page.css']
})
export class SignupPage {
  signupForm: FormGroup;
  isSubmitting = false;
  showPassword = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.signupForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      telefono: [''],
      rol: ['', Validators.required]
    });
  }

  get f() {
    return this.signupForm.controls;
  }

  onSubmit() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const formValue = this.signupForm.value;
    const userData: UsuarioCreate = {
      correo: formValue.correo,
      contrasena: formValue.contrasena,
      rol: formValue.rol === 'volunteer' ? RolEnum.postulante : RolEnum.organizacion,
      telefono: formValue.telefono || undefined
    };

    this.authService.register(userData).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.error?.detail || 'Error al registrar. Intenta nuevamente.';
      }
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
