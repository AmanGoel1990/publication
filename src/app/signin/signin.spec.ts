import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';

import { Signin } from './signin';
import { Integration } from '../services/integration';

describe('Signin', () => {
  let component: Signin;
  let fixture: ComponentFixture<Signin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Signin],
      providers: [
        provideHttpClient(),
        {
          provide: Integration,
          useValue: {
            doLogin: () => of({}),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Signin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect to cart after successful login', () => {
    const router = { navigate: jasmine.createSpy('navigate') };
    (component as any).router = router;
    component.username = 'admin';
    component.password = 'admin123';

    component.submitLogin();

    expect(router.navigate).toHaveBeenCalledWith(['/cart']);
  });
});
