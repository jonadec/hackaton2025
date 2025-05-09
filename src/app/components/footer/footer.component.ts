import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from 'app/services/auth.service';

@Component({
  selector: 'app-footer',
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styles: ''
})
export class FooterComponent implements OnInit {
  isLogged = false;
  isAdmin = false;
  mobileMenuOpen = false;
  constructor(private authS: AuthService, private router: Router) {
    
  }
  ngOnInit(): void {
    this.authS.isLogged$.subscribe((logged) => {
      this.isLogged = logged;
    });
  }

}
