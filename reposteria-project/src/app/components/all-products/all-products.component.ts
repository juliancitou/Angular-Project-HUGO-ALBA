import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { Product } from '../../models/product.model';

interface Category {
  id: number;
  name: string;
  is_active: boolean;
  description?: string;
  image?: string;
}

@Component({
  selector: 'app-all-products',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.css']
})
export class AllProductsComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  categories: Category[] = [];
  filteredProducts: Product[] = [];
  loading = false;
  searchTerm = '';
  selectedCategory = '';
  sortBy = 'name';
  private destroy$ = new Subject<void>();

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts().pipe(takeUntil(this.destroy$)).subscribe({
      next: (products: Product[]) => {
        this.products = products;
        this.filteredProducts = [...products];
        this.loading = false;
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading = false;
      }
    });
  }

  loadCategories(): void {
    this.productService.getCategories().pipe(takeUntil(this.destroy$)).subscribe({
      next: (categories: Category[]) => {
        this.categories = categories.filter(cat => cat.is_active);
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  onSearch(): void {
    this.applyFilters();
  }

  onCategoryChange(): void {
    this.applyFilters();
  }

  onSortChange(): void {
    this.applyFilters();
  }

  private applyFilters(): void {
    let filtered = [...this.products];

    // 🔍 FILTRO DE BÚSQUEDA
    if (this.searchTerm.trim()) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // 🏷️ FILTRO POR CATEGORÍA
    if (this.selectedCategory) {
      filtered = filtered.filter(product =>
        product.category_id?.toString() === this.selectedCategory
      );
    }

    // 📊 ORDENAMIENTO
    filtered.sort((a, b) => {
      switch (this.sortBy) {
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'newest':
          return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
        default:
          return a.name.localeCompare(b.name);
      }
    });

    this.filteredProducts = filtered;
  }

  get filteredProductsCount(): number {
    return this.filteredProducts.length;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.sortBy = 'name';
    this.applyFilters();
  }

  // ✅ MÉTODO NUEVO: OBTENER NOMBRE DE CATEGORÍA
  getCategoryName(product: any): string {
    if (!product.category) return 'Sin categoría';

    // Si es objeto (viene de la API con with('category'))
    if (product.category && typeof product.category === 'object') {
      return product.category.name || 'Sin categoría';
    }

    // Si es string (nombre directo)
    return product.category.toString();
  }
}