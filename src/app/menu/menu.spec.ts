import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { Menu } from './menu';
import { CartService } from '../cart.service';

describe('Menu', () => {
  let component: Menu;
  let fixture: ComponentFixture<Menu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Menu],
      providers: [provideRouter([{ path: '', component: Menu }])],
    }).compileComponents();

    fixture = TestBed.createComponent(Menu);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  afterEach(() => {
    localStorage.removeItem('mdniy-auth-session');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should keep cart items when navigating home from the logo', async () => {
    const cartService = TestBed.inject(CartService);
    const router = TestBed.inject(Router);
    cartService.addToCart({
      title: 'Marmacikitsa',
      price: '₹500',
      format: 'Hardcopy',
    });

    const logoLink = fixture.nativeElement.querySelector(
      '.logo-link',
    ) as HTMLAnchorElement;
    logoLink.click();
    await fixture.whenStable();

    expect(router.url).toBe('/');
    expect(cartService.cartCount).toBe(1);
    expect(cartService.items[0].title).toBe('Marmacikitsa');
  });

  it('should remove an item when decreasing its quantity from one', () => {
    const cartService = TestBed.inject(CartService);
    cartService.addToCart({
      title: 'Marmacikitsa',
      price: '₹500',
      format: 'Hardcopy',
    });

    component.decreaseQuantity(cartService.items[0]);

    expect(cartService.items).toEqual([]);
  });

  it('should close the cart popup when clicking outside it', () => {
    component.isCartOpen = true;
    fixture.detectChanges();

    const outsideButton = fixture.nativeElement.querySelector(
      '.menu-toggle',
    ) as HTMLButtonElement;
    outsideButton.click();

    expect(component.isCartOpen).toBeFalse();
  });

  it('should show logout only after opening the logged-in user menu', () => {
    localStorage.setItem(
      'mdniy-auth-session',
      JSON.stringify({ username: 'Asha', role: 'user' }),
    );
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Asha');
    expect(fixture.nativeElement.textContent).not.toContain('Logout');

    const userMenuButton = fixture.nativeElement.querySelector(
      '.user-name-btn',
    ) as HTMLButtonElement;
    userMenuButton.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Logout');
  });

  it('should keep the cart popup open when clicking inside it', () => {
    const cartService = TestBed.inject(CartService);
    cartService.addToCart({
      title: 'Marmacikitsa',
      price: '₹500',
      format: 'Hardcopy',
    });
    component.isCartOpen = true;
    fixture.detectChanges();

    const dropdown = fixture.nativeElement.querySelector(
      '.cart-dropdown',
    ) as HTMLElement;
    dropdown.click();

    expect(component.isCartOpen).toBeTrue();
  });

  // it('should expose publication books for the menu', () => {
  //   expect(component.publicationBooks.length).toBeGreaterThan(0);
  //   expect(component.publicationBooks[0].title).toContain('Yoga');

  //   const text = fixture.nativeElement.textContent;
  //   expect(text).toContain(component.publicationBooks[0].title);
  // });
});
