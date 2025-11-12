import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent {
  brandName = 'Encanto';

  menuItems = [
    { name: 'Inicio', path: '/', icon: 'bi bi-house' },
    { name: 'Productos', path: '/productos', icon: 'bi bi-basket' },
    { name: 'Acerca de', path: '/acerca', icon: 'bi bi-info-circle' },
  ];
}