import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  template: `
    <div class="app-container">
      <app-header></app-header>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
      <footer class="bg-dark text-light py-4 mt-5">
        <div class="container text-center">
          <p>&copy; 2024 Dulce Tentación - Repostería Artesanal</p>
        </div>
      </footer>
    </div>
  `,
  styleUrls: ['./app.css']
})
export class App {
  title = 'Dulce Tentación - Repostería';
}