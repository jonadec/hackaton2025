import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
const APIURL='http://localhost:3000/api/';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _http=inject(HttpClient);
  private router=inject(Router);

  constructor() { }

  login(body:{username:string, password:string}){
    return this._http.post(`${APIURL}login`, body);
  }

  isLogged(): boolean {
    return localStorage.getItem('login') ? true : false;
  }

  isAdmin(): any {
    const temp = localStorage.getItem('isAdmin');
    console.log('isAdmin', temp);
    if (temp === 'true') {
      return true;
    } else if (temp === 'false') {
      return false;
    }
    // return localStorage.getItem('isAdmin') ? true : false;
  }
  
  logout(): void {
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('login');
    this.router.navigate(['/login']);
  }
}
