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
    // Textos para el hero
    title = 'Dulces Momentos, Sabores Inolvidables';
    subtitle = 'Descubre nuestra selección de pasteles y postres artesanales elaborados con los mejores ingredientes.';
    buttonText = 'Ver Productos';

    // Array de imágenes para el carrusel
    slides = [
        {
            image: 'assets/pasteles-mostrar-1.jpg',
            alt: 'Pastel de Chocolate'
        },
        {
            image: 'assets/pasteles-mostrar-2.jpg',
            alt: 'Pastel de Fresa'
        },
        {
            image: 'assets/pasteles-mostrar-3.jpg',
            alt: 'Variedad de Postres'
        },
        {
            image: 'assets/pasteles-mostrar-4.jpg',
            alt: 'Cupcakes Decorados'
        }
    ];

    // Imagen por defecto si alguna no carga
    currentSlide = 0;

    // Método para cambiar slide manualmente
    goToSlide(index: number): void {
        this.currentSlide = index;
    }

    // Método para slide siguiente
    nextSlide(): void {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    }

    // Método para slide anterior
    prevSlide(): void {
        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    }
}