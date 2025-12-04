// hero.component.ts → VERSIÓN FINAL ÓPTIMA
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-hero',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './hero.component.html',
    styleUrls: ['./hero.component.css']
})
export class HeroComponent {
    title = 'Dulces Momentos, Sabores Inolvidables';
    subtitle = 'Descubre nuestra selección de pasteles y postres artesanales elaborados con los mejores ingredientes.';
    buttonText = 'Ver Productos';

    slides = [
        { image: 'assets/pasteles-mostrar-1.jpg', alt: 'Pastel de Chocolate' },
        { image: 'assets/pasteles-mostrar-2.jpg', alt: 'Pastel de Fresa' },
        { image: 'assets/pasteles-mostrar-3.jpg', alt: 'Variedad de Postres' },
        { image: 'assets/pasteles-mostrar-4.jpg', alt: 'Cupcakes Decorados' }
    ];

    currentSlide = 0;

    goToSlide(index: number): void {
        this.currentSlide = index;
    }

    nextSlide(): void {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    }

    prevSlide(): void {
        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    }
}