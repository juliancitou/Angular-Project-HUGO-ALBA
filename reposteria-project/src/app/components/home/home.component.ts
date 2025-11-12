import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { ProductListComponent } from '../../components/product-list/product-list.component';
// Asegúrate de importar estos componentes o crearlos:
import { HeaderComponent } from '../../components/header/header.component';
import { HeroComponent } from '../../components/hero/hero.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        CommonModule,
        ProductListComponent,
        HeaderComponent,  // ← Necesitas este componente
        HeroComponent,    // ← Necesitas este componente
        FooterComponent   // ← Necesitas este componente
    ],
    templateUrl: './home.component.html',
})
export class HomeComponent {
    constructor(private productService: ProductService) { }
}