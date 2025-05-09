import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

const APIURL = 'http://localhost:3000/api/';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _http = inject(HttpClient);
  private router = inject(Router);

  // BehaviorSubjects para manejar el estado reactivo
  private isLoggedSubject = new BehaviorSubject<boolean>(this.isLogged());
  private isAdminSubject = new BehaviorSubject<boolean>(this.isAdmin());

  // Observables para que otros componentes puedan suscribirse
  isLogged$ = this.isLoggedSubject.asObservable();
  isAdmin$ = this.isAdminSubject.asObservable();

  constructor() {}

  login(body: { username: string; password: string }) {
    return this._http.post(`${APIURL}login`, body);
  }

  isLogged(): boolean {
    return localStorage.getItem('login') === 'true';
  }

  isAdmin(): boolean {
    const temp = localStorage.getItem('isAdmin');
    return temp === 'true';
  }

  updateAuthState(): void {
    // Actualiza los valores de los BehaviorSubjects
    this.isLoggedSubject.next(this.isLogged());
    this.isAdminSubject.next(this.isAdmin());
  }

  logout(): void {
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('login');
    this.updateAuthState(); // Actualiza el estado reactivo
    this.router.navigate(['/login']);
  }
}