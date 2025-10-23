import { Component } from '@angular/core';

@Component({
    selector: 'app-hero',
    templateUrl: './hero.component.html',
    styleUrls: ['./hero.component.css']
})
export class HeroComponent {
    title = 'Dulces Momentos, Sabores Inolvidables';
    subtitle = 'Descubre nuestra selección de pasteles y postres artesanales elaborados con los mejores ingredientes.';
    buttonText = 'Ver Productos';
}