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

  it('fetches books from the local books API', () => {
    service.getBooks().subscribe((books) => {
      expect(books).toHaveLength(1);
      expect(books[0].title).toBe('Java Programming');
    });

    const req = httpMock.expectOne('http://localhost:8080/api/books');
    expect(req.request.method).toBe('GET');
    req.flush([{ title: 'Java Programming', price: 599.99 }]);
  });

  it('uploads a book PDF and returns its public path', () => {
    const file = new File(['book contents'], 'book.pdf', { type: 'application/pdf' });
    let result: { pdfUrl: string } | undefined;

    service.uploadBookPdf(file).subscribe((response) => {
      result = response;
    });

    const req = httpMock.expectOne('/uploads/books');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.get('book')).toBe(file);
    req.flush({ pdfUrl: '/books/book-id.pdf' });

    expect(result).toEqual({ pdfUrl: '/books/book-id.pdf' });
  });

  it('posts a book using the API JSON field names', () => {
    service.addBook({
      title: 'Java Programming',
      author: 'John Smith',
      description: 'Java programming book',
      type: 'new',
      price: '599.99',
      pdf: '/books/java-programming.pdf',
    }).subscribe();

    const req = httpMock.expectOne('http://localhost:8080/api/books');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      title: 'Java Programming',
      author: 'John Smith',
      description: 'Java programming book',
      type: 'new',
      price: 599.99,
      pdfFileName: 'java-programming.pdf',
    });
    req.flush({
      title: 'Java Programming',
      author: 'John Smith',
      description: 'Java programming book',
      type: 'new',
      price: 599.99,
      pdfFileName: 'java-programming.pdf',
    });
  });
});
