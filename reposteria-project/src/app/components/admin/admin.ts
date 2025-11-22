import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ImageService } from '../../services/image.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css']
})
export class AdminComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  currentProduct: Product = this.getEmptyProduct();
  isEditing = false;
  isLoading = false;
  searchTerm = '';
  selectedCategory = '';
  categories = ['pasteles', 'galletas', 'postres', 'bebidas', 'otros'];
  imageFile: File | null = null;
  imagePreview: string | null = null;

  // Hacer authService público para el template
  constructor(
    private productService: ProductService,
    private imageService: ImageService,
    public authService: AuthService // ← CAMBIAR A PUBLIC
  ) { }

  ngOnInit() {
    this.loadProducts();
  }

  ngOnDestroy() {
    if (this.imagePreview) {
      URL.revokeObjectURL(this.imagePreview);
    }
  }

  loadProducts() {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = products;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando productos:', error);
        this.isLoading = false;
      }
    });
  }

  filterProducts() {
    this.filteredProducts = this.products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCategory = !this.selectedCategory || product.category === this.selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido');
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        alert('La imagen no debe superar los 10MB');
        return;
      }

      this.imageFile = file;

      if (this.imagePreview) {
        URL.revokeObjectURL(this.imagePreview);
      }
      this.imagePreview = URL.createObjectURL(file);
    }
  }

  async submitProduct() {
    if (!this.validateProduct()) return;

    this.isLoading = true;

    try {
      let imageUrl = this.currentProduct.image_url;

      if (this.imageFile) {
        const imageResponse = await this.imageService.uploadImage(this.imageFile).toPromise();
        imageUrl = imageResponse.url;
      }

      const productData: Product = {
        ...this.currentProduct,
        image_url: imageUrl,
        is_available: this.currentProduct.is_available ?? true
      };

      if (this.isEditing && this.currentProduct.id) {
        await this.productService.updateProduct(this.currentProduct.id, productData).toPromise();
      } else {
        await this.productService.createProduct(productData).toPromise();
      }

      this.loadProducts();
      this.resetForm();
      alert(`Producto ${this.isEditing ? 'actualizado' : 'creado'} exitosamente!`);

    } catch (error: any) {
      console.error('Error:', error);
      alert(error.error?.error || `Error al ${this.isEditing ? 'actualizar' : 'crear'} el producto`);
    } finally {
      this.isLoading = false;
    }
  }

  editProduct(product: Product) {
    this.currentProduct = { ...product };
    this.isEditing = true;
    this.imageFile = null;
    this.imagePreview = product.image_url || null;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteProduct(product: Product) {
    if (confirm(`¿Estás seguro de eliminar "${product.name}"?`)) {
      this.productService.deleteProduct(product.id!).subscribe({
        next: () => {
          this.loadProducts();
          alert('Producto eliminado exitosamente');
        },
        error: (error) => {
          console.error('Error eliminando producto:', error);
          alert('Error al eliminar el producto');
        }
      });
    }
  }

  resetForm() {
    this.currentProduct = this.getEmptyProduct();
    this.isEditing = false;
    this.imageFile = null;

    if (this.imagePreview) {
      URL.revokeObjectURL(this.imagePreview);
      this.imagePreview = null;
    }

    const fileInput = document.getElementById('productImage') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  private validateProduct(): boolean {
    if (!this.currentProduct.name?.trim()) {
      alert('El nombre del producto es requerido');
      return false;
    }
    if (!this.currentProduct.description?.trim()) {
      alert('La descripción del producto es requerida');
      return false;
    }
    if (!this.currentProduct.price || this.currentProduct.price <= 0) {
      alert('El precio debe ser mayor a 0');
      return false;
    }
    if (!this.currentProduct.category) {
      alert('La categoría es requerida');
      return false;
    }
    if (this.currentProduct.stock === undefined || this.currentProduct.stock < 0) {
      alert('El stock no puede ser negativo');
      return false;
    }
    return true;
  }

  private getEmptyProduct(): Product {
    return {
      name: '',
      description: '',
      price: 0,
      category: '',
      stock: 0,
      image_url: '',
      is_available: true
    };
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        window.location.href = '/';
      },
      error: () => {
        // Forzar logout local
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = '/';
      }
    });
  }
}