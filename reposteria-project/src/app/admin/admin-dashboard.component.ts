// src/app/admin/admin-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductService } from '../services/product.service';
import { AuthService } from '../services/auth.service';
import { Product } from '../models/product.model';

// LIBRERÍAS PARA EXPORTAR
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FooterComponent } from "../components/footer/footer.component";

// Soluciona el error de TypeScript con autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    FooterComponent
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  // Pestañas
  activeTab: 'products' | 'orders' | 'create-admin' = 'products';

  // Productos y búsqueda
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchTerm: string = '';

  // Loading
  isLoading = false;

  // Formulario de producto (crear/editar)
  isEditing = false;
  currentProduct: Partial<Product> = {
    name: '',
    description: '',
    price: 0,
    category: '',
    stock: 0,
    is_available: true,
    images: []
  };
  imageFile: File | null = null;
  imagePreview: string | null = null;

  constructor(
    public authService: AuthService,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  // CARGAR PRODUCTOS
  loadProducts(): void {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = [...data]; // inicializa el filtro
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando productos', err);
        this.isLoading = false;
      }
    });
  }

  // FILTRAR PRODUCTOS (se llama desde el input con (input))
  filterProducts(): void {
    if (!this.searchTerm.trim()) {
      this.filteredProducts = [...this.products];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredProducts = this.products.filter(p =>
        p.name.toLowerCase().includes(term) ||
        (p.description && p.description.toLowerCase().includes(term))
      );
    }
  }

  // OBTENER PRIMERA IMAGEN
  getFirstImage(product: Product): string {
    if (product.images && product.images.length > 0) {
      // Cambia esta línea:
      return `http://localhost:8000/storage/${product.images[0]}`;
    }
    return 'assets/img/no-image.jpg';
  }
  // ABRIR FORMULARIO PARA CREAR PRODUCTO NUEVO
  openCreateProductModal(): void {
    this.isEditing = false;
    this.resetForm();
    this.activeTab = 'products'; // Asegura que estemos en la pestaña correcta
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // SELECCIONAR IMAGEN
  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.imageFile = file;
      this.imagePreview = URL.createObjectURL(file);
    }
  }

  // ENVIAR FORMULARIO (CREAR O EDITAR)
  async submitProduct(): Promise<void> {
    if (!this.currentProduct.name || !this.currentProduct.price || this.currentProduct.price <= 0) {
      alert('Por favor completa nombre y precio');
      return;
    }

    this.isLoading = true;
    const formData = new FormData();
    formData.append('name', this.currentProduct.name);
    formData.append('description', this.currentProduct.description || '');
    formData.append('price', this.currentProduct.price.toString());
    formData.append('category', this.currentProduct.category || '');
    formData.append('stock', this.currentProduct.stock?.toString() || '0');
    formData.append('is_available', this.currentProduct.is_available ? '1' : '0');
    if (this.imageFile) {
      formData.append('images[]', this.imageFile);
    }

    try {
      if (this.isEditing && this.currentProduct.id) {
        await this.productService.updateProduct(this.currentProduct.id as number, formData).toPromise();
        alert('Producto actualizado con éxito');
      } else {
        await this.productService.createProduct(formData).toPromise();
        alert('Producto creado con éxito');
      }
      this.loadProducts();
      this.resetForm();
    } catch (err: any) {
      console.error(err);
      alert(err.error?.message || 'Error al guardar el producto');
    } finally {
      this.isLoading = false;
    }
  }

  // EDITAR PRODUCTO
  editProduct(product: Product): void {
    this.currentProduct = { ...product };
    this.isEditing = true;
    this.imagePreview = product.images && product.images.length > 0
      ? `http://localhost:8000/storage/${product.images[0]}`
      : null;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ELIMINAR PRODUCTO (acepta string | number)
  deleteProduct(id: number | string): void {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.loadProducts();
          alert('Producto eliminado');
        },
        error: () => alert('Error al eliminar el producto')
      });
    }
  }

  // RESETEAR FORMULARIO
  resetForm(): void {
    this.currentProduct = {
      name: '', description: '', price: 0, category: '', stock: 0, is_available: true, images: []
    };
    this.isEditing = false;
    this.imageFile = null;
    this.imagePreview = null;
  }

  // EXPORTAR A EXCEL
  exportToExcel(): void {
    const data = this.filteredProducts.map(p => ({
      Nombre: p.name,
      Descripción: p.description,
      Precio: p.price,
      Categoría: p.category || 'Sin categoría',
      Stock: p.stock,
      Disponible: p.is_available ? 'Sí' : 'No'
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Productos");
    XLSX.writeFile(wb, `productos_encanto_${new Date().toISOString().slice(0, 10)}.xlsx`);
  }

  // EXPORTAR A PDF
  exportToPDF(): void {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Productos - Encanto Repostería', 14, 20);
    doc.setFontSize(11);
    doc.text(`Generado el: ${new Date().toLocaleString()}`, 14, 30);

    const rows = this.filteredProducts.map(p => [
      p.name,
      p.description || '-',
      `$${p.price}`,
      p.category || 'Sin categoría',
      p.stock.toString(),
      p.is_available ? 'Sí' : 'No'
    ]);

    (doc as any).autoTable({
      head: [['Nombre', 'Descripción', 'Precio', 'Categoría', 'Stock', 'Disponible']],
      body: rows,
      startY: 40,
      theme: 'striped'
    });

    doc.save(`productos_encanto_${new Date().toISOString().slice(0, 10)}.pdf`);
  }

  // CERRAR SESIÓN
  logout(): void {
    this.authService.logout().subscribe({
      next: () => window.location.href = '/',
      error: () => window.location.href = '/'
    });
  }
}