import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homeuser',
  templateUrl: './homeuser.component.html',
  styleUrls: ['./homeuser.component.css'],
  imports: [CommonModule]
})
export class HomeuserComponent implements OnInit {
  mostrarModal = false; // Controla la visibilidad del modal
  private _router = inject(Router);

  constructor() {}

  ngOnInit(): void {
    // Verificar si el modal ya se mostró en esta sesión
    const modalMostrado = sessionStorage.getItem('modalMostrado');
    if (!modalMostrado) {
      this.mostrarModal = true; // Mostrar el modal si no se ha mostrado antes
      sessionStorage.setItem('modalMostrado', 'true'); // Marcar el modal como mostrado
    }
  }

  cerrarModal(): void {
    this.mostrarModal = false; // Ocultar el modal cuando el usuario hace clic en "Aceptar"
  }

  irAPaginaHome(): void {
    this._router.navigate(['/home']);
  }
}
