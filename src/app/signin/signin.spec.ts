import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';

import { Signin } from './signin';
import { Integration } from '../services/integration';

describe('Signin', () => {
  let component: Signin;
  let fixture: ComponentFixture<Signin>;
  let loginResponse: { role?: string; userRole?: string; roleName?: string };

  beforeEach(async () => {
    localStorage.removeItem('mdniy-auth-session');

    await TestBed.configureTestingModule({
      imports: [Signin],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        {
          provide: Integration,
          useValue: {
            doLogin: () => of(loginResponse),
          },
        },
      ],
    }).compileComponents();

    loginResponse = {};
    fixture = TestBed.createComponent(Signin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('rejects administrator accounts and keeps them out of user sign-in', () => {
    loginResponse = { role: 'ROLE_ADMIN' };
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    component.username = 'admin';
    component.password = 'admin123';

    component.submitLogin();

    expect(router.navigate).not.toHaveBeenCalled();
    expect(component.isLoggedIn).toBe(false);
    expect(component.loginError).toContain('admin login page');
    expect(localStorage.getItem('mdniy-auth-session')).toBeNull();
  });

  it('should normalize backend user roles and redirect users to the cart', () => {
    loginResponse = { role: 'ROLE_USER' };
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    component.username = 'customer';
    component.password = 'password';

    component.submitLogin();

    expect(router.navigate).toHaveBeenCalledWith(['/cart']);
    expect(localStorage.getItem('mdniy-auth-session')).toContain('"role":"user"');
  });

  it('allows switching away from a saved account on the sign-in page', () => {
    localStorage.setItem('mdniy-auth-session', JSON.stringify({ username: 'admin', role: 'admin' }));
    component.useAnotherAccount();

    expect(localStorage.getItem('mdniy-auth-session')).toBeNull();
    expect(component.isLoggedIn).toBe(false);
  });
});
