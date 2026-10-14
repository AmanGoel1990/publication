import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { Admin } from './admin';
import { Integration } from '../services/integration';

describe('Admin', () => {
  let component: Admin;
  let fixture: ComponentFixture<Admin>;
  let loginResponse: { role?: string };

  beforeEach(async () => {
    loginResponse = {};

    await TestBed.configureTestingModule({
      imports: [Admin],
      providers: [
        provideRouter([]),
        {
          provide: Integration,
          useValue: { doLogin: () => of(loginResponse) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Admin);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows a dedicated administrator login instead of customer sign-in options', () => {
    expect(fixture.nativeElement.textContent).toContain('Administration portal');
    expect(fixture.nativeElement.textContent).toContain('Administrator sign in');
    expect(fixture.nativeElement.textContent).not.toContain('Register');
    expect(fixture.nativeElement.textContent).not.toContain('Forgot password?');
  });

  it('rejects accounts that are not administrators', () => {
    loginResponse = { role: 'user' };
    component.loginForm.setValue({ username: 'customer', password: 'password' });

    component.submitLogin();

    expect(component.loginError()).toBe('This account is not authorized for admin access.');
  });
});
