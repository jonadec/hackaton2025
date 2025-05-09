import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})

export class NavbarComponent {
  
  listaMenu:itemNavbar[]=[
    {
      title:'Home',
      url:'/home'
    },
    {
      title:'Login',
      url:'/login'
    }
  ];

}


export interface itemNavbar{
  title:string;
  url:string;
}