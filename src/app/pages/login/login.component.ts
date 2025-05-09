import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from 'app/components/navbar/navbar.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private _router = inject(Router);
  formLogin!: FormGroup;
  private fb = inject(FormBuilder);
  private _authS = inject(AuthService);

  constructor() {
    // Inicializar el formulario reactivo
    this.formLogin = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // Campo para el correo
      password: ['', Validators.required] // Campo para la contraseña
    });
  }

  login() {
    console.log(this.formLogin.value); // Mostrar los datos del formulario en la consola
    this._authS.login(this.formLogin.value).subscribe(
      (res: any) => {
        console.log('Respuesta del servidor:', res);
        if (res.login) {
          Swal.fire({
            icon: 'success',
            title: 'Login correcto',
            text: 'Bienvenido',
            position: 'center',
            timer: 3000,
            showConfirmButton: false
          });
          // Guardar datos en localStorage
          localStorage.setItem('isAdmin', res.isAdmin.toString());
          localStorage.setItem('login', res.login.toString()); 
          localStorage.setItem('id', res.id.toString());
          this._authS.updateAuthState(); // Actualizar el estado reactivo
          if(res.isAdmin) {
            this._router.navigate(['/registropruebas']);
          } else if(!res.isAdmin) {
            this._router.navigate(['/homeuser']);
          }
         
          
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Acceso denegado',
            text: 'Credenciales incorrectas'
          });
        }
      },
      (err) => {
        console.log('Error en el login', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al intentar iniciar sesión'
        });
      }
    );
  }
}
