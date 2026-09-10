import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should show login before checkout when user is not logged in', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const addButton = Array.from(compiled.querySelectorAll('button')).find(
      (button) => button.textContent?.includes('Add to cart')
    ) as HTMLButtonElement | undefined;

    addButton?.click();
    fixture.detectChanges();

    expect(compiled.textContent).toContain('Login to continue');
    expect(compiled.textContent).toContain('Email');
  });
});
