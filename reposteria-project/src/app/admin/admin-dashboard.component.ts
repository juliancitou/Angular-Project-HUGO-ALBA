// src/app/admin/admin-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router'; // ← Router agregado
import { ProductService } from '../services/product.service';
import { AuthService } from '../services/auth.service';
import { Product } from '../models/product.model';

// LIBRERÍAS PARA EXPORTAR
import * as XLSX from 'xlsx';
import { FooterComponent } from "../components/footer/footer.component";

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

  // Formulario de producto (crear/editar) → ya no lo usas aquí, puedes eliminarlo si quieres
  isEditing = false;
  currentProduct: Partial<Product> = {
    name: '', description: '', price: 0, category: '', stock: 0, is_available: true, images: []
  };
  imageFile: File | null = null;
  imagePreview: string | null = null;

  constructor(
    public authService: AuthService,
    private productService: ProductService,
    private router: Router  // ← Inyectado aquí
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  // ==================== CARGA Y FILTRO ====================
  loadProducts(): void {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = [...data];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando productos', err);
        this.isLoading = false;
      }
    });
  }

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

  // ==================== IMAGEN ====================
  getFirstImage(product: Product): string {
    if (product.images && product.images.length > 0) {
      return `http://localhost:8000/storage/${product.images[0]}`;
    }
    return 'assets/img/no-image.jpg';
  }

  // ==================== NAVEGACIÓN (ESTO ES LO NUEVO) ====================
  goToEditProduct(id: number | string): void {
    this.router.navigate(['/admin/edit-product', id]);
  }

  // ==================== ELIMINAR ====================
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

  // ==================== EXPORTAR EXCEL ====================
  exportToExcel(): void {
    const data = this.filteredProducts.map(p => ({
      Nombre: p.name,
      Descripción: p.description,
      Precio: p.price,
      Categoría: this.getCategoryName(p),
      Stock: p.stock,
      Disponible: p.is_available ? 'Sí' : 'No'
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Productos");
    XLSX.writeFile(wb, `productos_encanto_${new Date().toISOString().slice(0, 10)}.xlsx`);
  }

  // ==================== EXPORTAR PDF ====================
  exportToPDF(): void {
    if (this.filteredProducts.length === 0) {
      alert('No hay productos para exportar');
      return;
    }
    import('jspdf').then(jsPDFModule => {
      import('jspdf-autotable').then(autoTableModule => {
        const { jsPDF } = jsPDFModule;
        const autoTable = autoTableModule.default;
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text('Productos - Encanto Repostería', 14, 20);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Generado el: ${new Date().toLocaleString('es-MX')}`, 14, 30);

        const rows = this.filteredProducts.map(p => [
          p.name.substring(0, 25),
          (p.description || '-').substring(0, 30),
          `$${Number(p.price).toFixed(2)}`,
          this.getCategoryName(p).substring(0, 15),
          p.stock.toString(),
          p.is_available ? 'Sí' : 'No'
        ]);

        autoTable(doc, {
          head: [['Nombre', 'Descripción', 'Precio', 'Categoría', 'Stock', 'Disponible']],
          body: rows,
          startY: 40,
          theme: 'grid',
          headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold', halign: 'center' },
          styles: { fontSize: 8, cellPadding: 3, overflow: 'linebreak' },
          columnStyles: {
            0: { cellWidth: 25 }, 1: { cellWidth: 35 }, 2: { cellWidth: 18 },
            3: { cellWidth: 20 }, 4: { cellWidth: 10 }, 5: { cellWidth: 15 }
          },
          margin: { left: 14, right: 14 }
        });

        doc.save(`productos_encanto_${new Date().toISOString().slice(0, 10)}.pdf`);
      });
    }).catch(err => {
      console.error('Error generando PDF', err);
      alert('Error al generar PDF');
    });
  }

  private showPdfError(): void {
    alert('No se pudo generar el PDF. Verifica que tengas productos cargados.');
  }

  // ==================== CERRAR SESIÓN ====================
  logout(): void {
    this.authService.logout().subscribe({
      next: () => window.location.href = '/',
      error: () => window.location.href = '/'
    });
  }

  // ==================== CATEGORÍA ====================
  getCategoryName(product: any): string {
    if (!product.category) return 'Sin categoría';
    if (product.category && typeof product.category === 'object') {
      return product.category.name || 'Sin categoría';
    }
    return product.category.toString();
  }

  // ==================== MÉTODOS ANTIGUOS (puedes eliminar si no los usas) ====================
  // editProduct, submitProduct, resetForm, etc. → ya no se usan porque edit es en otro componente
}