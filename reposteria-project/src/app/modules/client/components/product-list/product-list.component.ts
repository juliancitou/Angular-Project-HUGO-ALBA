import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../../core/services/product.service';
import { Product } from '../../../../shared/models/product.model';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  template: `
    <div class="container py-5">
      <div class="row">
        <div class="col-12">
          <h1 class="text-center mb-5">Nuestros Productos</h1>
        </div>
      </div>
      
      <div class="row">
        <div class="col-md-4 mb-4" *ngFor="let product of products">
          <app-product-card [product]="product"></app-product-card>
        </div>
      </div>

      <div *ngIf="products.length === 0" class="text-center">
        <p>Cargando productos...</p>
      </div>
    </div>
  `,
  styleUrls: ['./product-list.scss']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
    });
  }
}