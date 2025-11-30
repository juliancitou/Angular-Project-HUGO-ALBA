// src/app/components/product-detail/product-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../models/product.model';
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FooterComponent],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product!: Product;
  isLoading = true;
  isLiked = false;
  likesCount = 0;

  // Cambiar authService a público para poder usarlo en la plantilla
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    public authService: AuthService  // ← CAMBIADO DE private A public
  ) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = +idParam;
      this.loadProduct(id);
    } else {
      this.router.navigate(['/']);
    }
  }

  loadProduct(id: number): void {
    this.productService.getProduct(id).subscribe({
      next: (product: Product) => {
        this.product = product;
        this.likesCount = product.likes_count || 0;
        this.isLoading = false;

        if (this.authService.isLoggedIn()) {
          const likedProducts = JSON.parse(localStorage.getItem('liked_products') || '[]');
          this.isLiked = likedProducts.includes(product.id);
        }
      },
      error: () => {
        alert('Producto no encontrado');
        this.router.navigate(['/']);
      }
    });
  }

  toggleLike(): void {
    if (!this.authService.isLoggedIn()) {
      alert('Debes iniciar sesión para dar like');
      this.router.navigate(['/login']);
      return;
    }

    if (!this.product?.id) return;

    this.isLiked = !this.isLiked;
    this.likesCount = this.isLiked ? this.likesCount + 1 : this.likesCount - 1;

    let likedProducts = JSON.parse(localStorage.getItem('liked_products') || '[]');
    if (this.isLiked) {
      if (!likedProducts.includes(this.product.id)) {
        likedProducts.push(this.product.id);
      }
    } else {
      likedProducts = likedProducts.filter((id: number) => id !== this.product.id);
    }
    localStorage.setItem('liked_products', JSON.stringify(likedProducts));

    this.productService.toggleLike(this.product.id).subscribe({
      next: (res: any) => {
        this.likesCount = res.likes_count ?? this.likesCount;
        this.isLiked = res.liked ?? this.isLiked;
      },
      error: () => {
        this.isLiked = !this.isLiked;
        this.likesCount = this.isLiked ? this.likesCount + 1 : this.likesCount - 1;
        alert('Error al guardar el like');
      }
    });
  }

  goHome() {
    this.router.navigate(['/']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getFirstImage(images: string[] | null): string {
    if (images && images.length > 0) {
      return `http://localhost:8000/storage/${images[0]}`;
    }
    return 'assets/default-product.jpg';
  }

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