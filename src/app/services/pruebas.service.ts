import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
const APIURL='http://localhost:3000/api/';

@Injectable({
  providedIn: 'root'
})
export class PruebasService {
  private _http=inject(HttpClient);
  private router=inject(Router);

  constructor() { }

  getPruebas() {
    return this._http.get(`${APIURL}prueba`);
  }

}
