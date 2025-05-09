import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from 'app/services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})

export class NavbarComponent {
  isLogged :any;
  isAdmin :any = false;
  private authS = inject(AuthService);
  private router = inject(Router);
  mobileMenuOpen = false;

  constructor() {
    if(this.authS.isAdmin()){
      this.isAdmin = true;
    }
    this.isLog();
    this.isAd();
  }
  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen; // Alternar el estado del menú móvil
  }

  logout(): void {
    this.authS.logout();
    this.isLogged = false;
    this.isAdmin = false;
    this.router.navigate(['/login']);
  }

  isLog(){
    this.isLogged = this.authS.isLogged();
  }
  isAd(){
    if(this.authS.isAdmin()){
      this.isAdmin = true;
    }
  }

}