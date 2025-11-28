import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';

@Component({
    selector: 'app-about',
    standalone: true,
    imports: [CommonModule, HeaderComponent],  // ← Ya no necesitas HeaderComponent aquí
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css']
})
export class AboutComponent {
    socialLinks = [
        { name: 'WhatsApp', image: 'assets/whatsapp-logo.png', url: 'https://wa.me/524811140821' },
        { name: 'Facebook', image: 'assets/facebook-logo.png', url: '#' },
        { name: 'Gmail', image: 'assets/logo-gmail.png', url: 'mailto:encanto.reposteria@gmail.com' }
    ];

    teamMembers = [
        {
            name: 'Carlos Martinez Gonzalez',
            role: 'Pastelera Principal',
            description: 'Especialista en repostería francesa con 10 años de experiencia.',
            image: 'assets/imagen-chef-1.png'  // ← TU IMAGEN
        },
        {
            name: 'Laura Fernández Ruiz',
            role: 'Chef Repostero',
            description: 'Experto en decoración y pasteles temáticos de alto nivel.',
            image: 'assets/imagen-chef-2.png'  // ← TU IMAGEN
        },
        {
            name: 'María López Sánchez',
            role: 'Atención al Cliente',
            description: 'Siempre dispuesta a hacer tu experiencia dulce y memorable.',
            image: 'assets/imagen-chef-3.png'  // ← TU IMAGEN
        }
    ];
}