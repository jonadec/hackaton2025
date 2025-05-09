import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GestureComponent } from './components/gesture/gesture.component';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  imports: [ RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'hackatonproject';
}
