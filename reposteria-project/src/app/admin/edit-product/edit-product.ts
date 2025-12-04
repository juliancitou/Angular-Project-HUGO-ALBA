// src/app/admin/edit-product/edit-product.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './edit-product.html',
  styleUrls: ['./edit-product.css']
})
export class EditProductComponent implements OnInit {
  productId!: number;
  categories: Category[] = [];
  isLoading = false;

  product = {
    name: '',
    description: '',
    price: 0,
    category_id: '',
    stock: 10,
    is_available: true
  };

  // Imágenes nuevas que sube el admin
  newImages: File[] = [];
  newImagePreviews: string[] = [];

  // Imágenes actuales del producto (del backend)
  currentImages: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadCategories();
    this.loadProduct();
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (cats) => this.categories = cats,
      error: () => alert('Error cargando categorías')
    });
  }

  loadProduct(): void {
    this.isLoading = true;
    this.productService.getProductById(this.productId).subscribe({
      next: (product: any) => {
        this.product = {
          name: product.name,
          description: product.description || '',
          price: product.price,
          category_id: product.category_id || product.category?.id || '',
          stock: product.stock,
          is_available: product.is_available
        };
        this.currentImages = product.images || [];
        this.isLoading = false;
      },
      error: (err) => {
        alert('Error cargando producto');
        console.error(err);
        this.router.navigate(['/admin']);
      }
    });
  }

  onNewImagesSelected(event: any): void {
    const files: FileList = event.target.files;
    for (let i = 0; i < files.length && (this.newImages.length + this.currentImages.length) < 5; i++) {
      const file = files[i];
      if (file.type.match(/image.*/)) {
        this.newImages.push(file);
        const reader = new FileReader();
        reader.onload = (e: any) => this.newImagePreviews.push(e.target.result);
        reader.readAsDataURL(file);
      }
    }
  }

  removeNewImage(index: number): void {
    this.newImages.splice(index, 1);
    this.newImagePreviews.splice(index, 1);
  }

  removeCurrentImage(index: number): void {
    this.currentImages.splice(index, 1);
  }

  async submit(): Promise<void> {
    if (!this.product.name || this.product.price <= 0 || !this.product.category_id) {
      alert('Complete nombre, precio y categoría');
      return;
    }

    this.isLoading = true;
    const formData = new FormData();
    formData.append('name', this.product.name);
    formData.append('description', this.product.description);
    formData.append('price', this.product.price.toString());
    formData.append('category_id', this.product.category_id);
    formData.append('stock', this.product.stock.toString());
    formData.append('is_available', this.product.is_available ? '1' : '0');

    // Imágenes nuevas
    this.newImages.forEach(img => formData.append('images[]', img));

    // Imágenes actuales que se mantienen
    this.currentImages.forEach(imgPath => {
      formData.append('existing_images[]', imgPath);
    });

    try {
      await this.productService.updateProduct(this.productId, formData).toPromise();
      alert('¡Producto actualizado con éxito!');
      this.router.navigate(['/admin']);
    } catch (err: any) {
      alert(err.error?.message || 'Error al actualizar producto');
    } finally {
      this.isLoading = false;
    }
  }
}