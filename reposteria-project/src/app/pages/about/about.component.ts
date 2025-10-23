import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-about',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css']
})
export class AboutComponent {
    brandName = 'Encanto';

    socialLinks = [
        {
            name: 'WhatsApp',
            icon: 'bi bi-whatsapp',
            image: 'assets/whatsapp-logo.png',
            url: '#'
        },
        {
            name: 'Facebook',
            icon: 'bi bi-facebook',
            image: 'assets/facebook-logo.png',
            url: '#'
        },
        {
            name: 'Gmail',
            icon: 'bi bi-envelope',
            image: 'assets/logo-gmail.png',
            url: '#'
        }
    ];

    quickLinks = [
        { name: 'Inicio', url: '/' },
        { name: 'Productos', url: '/productos' },
        { name: 'Acerca de', url: '/acerca' },
        { name: 'Contacto', url: '/contacto' }
    ];

    teamMembers = [
        {
            name: 'Ana García',
            role: 'Pastelera Principal',
            description: 'Especialista en repostería francesa con 10 años de experiencia.'
        },
        {
            name: 'Carlos Rodríguez',
            role: 'Chef Repostero',
            description: 'Expertos en decoración y pasteles temáticos.'
        },
        {
            name: 'María López',
            role: 'Atención al Cliente',
            description: 'Siempre dispuesta a hacer tu experiencia dulce y memorable.'
        }
    ];
}