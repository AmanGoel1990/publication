import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { CartService } from './cart.service';
import { Home } from './home/home';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App, Home],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should add an item to the cart when Add to cart is clicked', () => {
    const fixture = TestBed.createComponent(Home);
    const cartService = TestBed.inject(CartService);
    const home = fixture.componentInstance;

    home.addToCart(home.featuredBooks[0]);

    expect(cartService.cartCount).toBe(1);
    expect(cartService.items[0].title).toBe('Marmacikitsa');
  });
});
