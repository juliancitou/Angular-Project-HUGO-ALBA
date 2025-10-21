import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterLinkActive],
    template: `
    <nav class="navbar navbar-expand-lg navbar-light pastel-bg">
      <div class="container">
        <a class="navbar-brand fw-bold text-white" routerLink="/">
          🎂 Dulce Tentación
        </a>
        
        <div class="navbar-nav">
          <a class="nav-link text-white" routerLink="/" routerLinkActive="active">Inicio</a>
          <a class="nav-link text-white" routerLink="/products" routerLinkActive="active">Productos</a>
        </div>
      </div>
    </nav>
  `,
    styles: [`
    .pastel-bg {
      background: linear-gradient(135deg, #ff6b8b 0%, #ffd166 100%);
    }
    .nav-link.active {
      font-weight: bold;
      text-decoration: underline;
    }
  `]
})
export class HeaderComponent { }