import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homeuser',
  imports: [],
  templateUrl: './homeuser.component.html',
  styleUrl: './homeuser.component.css'
})
export class HomeuserComponent {
  private _router = inject(Router);

  irAPaginaHome(): void {
    this._router.navigate(['/home']);
  }

}
