import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Obtener el estado de login y el rol del usuario desde localStorage
    const isLogged = localStorage.getItem('login') === 'true';
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    // Verificar si la ruta requiere que el usuario esté logueado
    const requiresLogin = route.data['requiresLogin'] || false;

    // Verificar si la ruta requiere que el usuario sea administrador
    const requiresAdmin = route.data['requiresAdmin'] || false;

    // Si el usuario está logueado y trata de acceder al login, redirigir al home
    if (!requiresLogin && isLogged) {
      this.router.navigate(['/home']);
      return false;
    }

    // Validar las condiciones
    if (requiresLogin && !isLogged) {
      // Si requiere login y el usuario no está logueado, redirigir al login
      this.router.navigate(['/login']);
      return false;
    }

    if (requiresAdmin && !isAdmin) {
      // Si requiere ser administrador y el usuario no lo es, redirigir al login
      this.router.navigate(['/login']);
      return false;
    }

    // Si pasa todas las validaciones, permitir el acceso
    return true;
  }
}
