import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Integration } from './integration';

describe('Integration', () => {
  let service: Integration;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(Integration);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should call the local login API with username and password query params', () => {
    service.doLogin({ username: 'admin', password: 'admin123' }).subscribe();

    const req = httpMock.expectOne(
      (request) =>
        request.url === 'http://localhost:8080/api/login' &&
        request.params.get('username') === 'admin' &&
        request.params.get('password') === 'admin123' &&
        request.method === 'GET',
    );

    expect(req).toBeTruthy();
    req.flush({ token: 'abc123' });
  });
});
