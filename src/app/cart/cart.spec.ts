import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { Cart } from './cart';
import { CartService } from '../cart.service';
import { Integration } from '../services/integration';

describe('Cart', () => {
  let component: Cart;
  let fixture: ComponentFixture<Cart>;
  let cartService: CartService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cart],
      providers: [
        CartService,
        provideRouter([]),
        { provide: Integration, useValue: { purchaseHardcopies: () => of([]) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Cart);
    component = fixture.componentInstance;
    cartService = TestBed.inject(CartService);
    cartService.items = [
      { title: 'Marmacikitsa', price: '₹500', format: 'Hardcopy', quantity: 1 },
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show cart items after login', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Marmacikitsa');
    expect(compiled.textContent).toContain('Hardcopy');
  });

  it('should remove an item when decreasing its quantity from one', () => {
    component.decrementQuantity('Marmacikitsa', 'Hardcopy');

    expect(cartService.items).toEqual([]);
  });

  it('should decrease an item quantity when it is greater than one', () => {
    cartService.updateQuantity('Marmacikitsa', 'Hardcopy', 2);

    component.decrementQuantity('Marmacikitsa', 'Hardcopy');

    expect(cartService.items[0].quantity).toBe(1);
  });

  it('should restore cart items after the service is recreated', () => {
    cartService.addToCart({
      title: 'Yoga',
      price: '₹300',
      format: 'E-book',
    });

    const restoredCartService = new CartService();

    expect(restoredCartService.items).toContain(
      jasmine.objectContaining({
        title: 'Yoga',
        format: 'E-book',
        quantity: 1,
      }),
    );
  });

  it('does not let the cart quantity exceed hardcopy stock', () => {
    cartService.items = [{
      bookId: 7,
      title: 'Yoga',
      price: '₹300',
      format: 'Hardcopy',
      quantity: 1,
      stock: 2,
    }];

    expect(cartService.addToCart({
      bookId: 7,
      title: 'Yoga',
      price: '₹300',
      format: 'Hardcopy',
      stock: 2,
    })).toBe(true);
    expect(cartService.addToCart({
      bookId: 7,
      title: 'Yoga',
      price: '₹300',
      format: 'Hardcopy',
      stock: 2,
    })).toBe(false);
    expect(cartService.items[0].quantity).toBe(2);
  });
});
