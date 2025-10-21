import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../../core/services/product.service';
import { Product, ProductCategory } from '../../../../shared/models/product.model';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card.component';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, RouterLink, ProductCardComponent],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    featuredProducts: Product[] = [];

    categories = [
        { id: ProductCategory.CAKES, name: 'Pasteles', icon: '🎂', description: 'Deliciosos pasteles para toda ocasión' },
        { id: ProductCategory.CUPCAKES, name: 'Cupcakes', icon: '🧁', description: 'Pequeños y deliciosos cupcakes' },
        { id: ProductCategory.COOKIES, name: 'Galletas', icon: '🍪', description: 'Galletas artesanales y decoradas' },
        { id: ProductCategory.DESSERTS, name: 'Postres', icon: '🍮', description: 'Postres individuales y especiales' }
    ];

    constructor(private productService: ProductService) { }

    ngOnInit(): void {
        this.loadFeaturedProducts();
    }

    loadFeaturedProducts(): void {
        this.productService.getProducts().subscribe(products => {
            this.featuredProducts = products.slice(0, 3);
        });
    }
}