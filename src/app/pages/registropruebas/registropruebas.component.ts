import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { PruebasService } from 'app/services/pruebas.service';

@Component({
  selector: 'app-registropruebas',
  imports: [CommonModule],
  templateUrl: './registropruebas.component.html',
  styleUrl: './registropruebas.component.css'
})
export class RegistropruebasComponent {
  pruebas: any[] = []; // Almacena las pruebas obtenidas del servicio
  private _pruebasService = inject(PruebasService);

  constructor() {
    this.obtenerPruebas();
  }

  obtenerPruebas(): void {
    this._pruebasService.getPruebas().subscribe({
      next: (data: any) => {
        console.log('Pruebas obtenidas:', data);
        this.pruebas = data; // Asignar las pruebas al array
      },
      error: (err) => {
        console.error('Error al obtener las pruebas:', err);
      }
    });
  }
}