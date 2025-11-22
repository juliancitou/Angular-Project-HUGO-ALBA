import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserAdminService, CreateAdminRequest } from '../../../services/user-admin';
import { Router } from '@angular/router';
import { SHARED_IMPORTS } from '../../../shared/imports';


@Component({
  selector: 'app-create-admin',
  standalone: true,
  imports: [SHARED_IMPORTS],
  templateUrl: './create-admin.html',
  styleUrls: ['./create-admin.css']
})
export class CreateAdminComponent {
  adminForm: FormGroup;
  isLoading = false;
  message = '';
  isError = false;

  constructor(
    private fb: FormBuilder,
    private userAdminService: UserAdminService,
    private router: Router
  ) {
    this.adminForm = this.createForm();
  }

  createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirmation: ['', [Validators.required]],
      phone: [''],
      address: ['']
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('password_confirmation')?.value
      ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.adminForm.valid) {
      this.isLoading = true;
      this.message = '';

      // FORZAMOS EL ROL 'admin'
      const payload = {
        ...this.adminForm.value,
        role: 'admin'
      };

      this.userAdminService.createAdmin(payload).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.isError = false;
          this.message = '¡Administrador creado exitosamente!';
          this.adminForm.reset();

          setTimeout(() => {
            this.router.navigate(['/admin']);
          }, 2000);
        },
        error: (error) => {
          this.isLoading = false;
          this.isError = true;
          this.message = error.error?.message || 'Error al crear el administrador';
        }
      });
    }
  }
}