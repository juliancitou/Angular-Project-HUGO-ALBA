// src/app/admin/create-product/create-product.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './create-product.html',  // ← nombre correcto
  styleUrls: ['./create-product.css']
})
export class CreateProductComponent implements OnInit {

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

  images: File[] = [];
  imagePreviews: string[] = [];

  constructor(
    private productService: ProductService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (cats: Category[]) => this.categories = cats,
      error: () => alert('Error cargando categorías')
    });
  }

  onImagesSelected(event: any): void {
    const files: FileList = event.target.files;
    this.images = [];
    this.imagePreviews = [];

    for (let i = 0; i < files.length && i < 5; i++) {
      const file = files[i];
      if (file.type.match(/image.*/)) {
        this.images.push(file);
        const reader = new FileReader();
        reader.onload = (e: any) => this.imagePreviews.push(e.target.result);
        reader.readAsDataURL(file);
      }
    }
  }

  removeImage(index: number): void {
    this.images.splice(index, 1);
    this.imagePreviews.splice(index, 1);
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

    this.images.forEach(img => formData.append('images[]', img));

    try {
      await this.productService.createProduct(formData).toPromise();
      alert('¡Producto creado con éxito!');
      this.router.navigate(['/admin']);
    } catch (err: any) {
      alert(err.error?.message || 'Error al crear producto');
    } finally {
      this.isLoading = false;
    }
  }
}