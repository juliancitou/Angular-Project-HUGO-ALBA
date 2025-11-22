import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminComponent } from './admin';
import { ProductService } from '../../services/product.service';
import { ImageService } from '../../services/image.service';
import { AuthService } from '../../services/auth.service';
import { of } from 'rxjs';

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;
  let productService: jasmine.SpyObj<ProductService>;
  let imageService: jasmine.SpyObj<ImageService>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const productServiceSpy = jasmine.createSpyObj('ProductService', [
      'getProducts', 'createProduct', 'updateProduct', 'deleteProduct'
    ]);
    const imageServiceSpy = jasmine.createSpyObj('ImageService', ['uploadImage']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getUser', 'logout']);

    await TestBed.configureTestingModule({
      imports: [AdminComponent],
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        { provide: ImageService, useValue: imageServiceSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    productService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    imageService = TestBed.inject(ImageService) as jasmine.SpyObj<ImageService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

    // Configurar mocks
    productService.getProducts.and.returnValue(of([]));
    authService.getUser.and.returnValue({ name: 'Test User', is_admin: true });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', () => {
    expect(productService.getProducts).toHaveBeenCalled();
  });

  it('should have empty product form initially', () => {
    expect(component.currentProduct.name).toBe('');
    expect(component.isEditing).toBeFalse();
  });
});