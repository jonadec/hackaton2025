import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from 'app/services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  isLogged = false; // Estado inicial
  isAdmin = false; // Estado inicial
  mobileMenuOpen = false;

  constructor(private authS: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Suscribirse a los cambios en el estado de autenticación
    this.authS.isLogged$.subscribe((logged) => {
      this.isLogged = logged;
    });

    this.authS.isAdmin$.subscribe((admin) => {
      this.isAdmin = admin;
    });
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen; // Alternar el estado del menú móvil
  }

  logout(): void {
    this.authS.logout(); // Llama al servicio para cerrar sesión
  }
}