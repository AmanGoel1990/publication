import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { LoginResponse } from '../models/login-response';
import { LoginRequest } from '../models/login-request';
import { Observable, map } from 'rxjs';

const LOGIN_API_URL = 'http://localhost:8080/api/login';
const REGISTER_API_URL = 'http://localhost:8080/api/register';

@Injectable({
  providedIn: 'root',
})
export class Integration {
  constructor(private http: HttpClient) {}

  doLogin(request: LoginRequest): Observable<LoginResponse> {
    const params = new HttpParams()
      .set('username', request.username ?? '')
      .set('password', request.password ?? '');

    return this.http.get<LoginResponse>(LOGIN_API_URL, { params, observe: 'response' }).pipe(
      map((response) => {
        if (response.status !== 200) {
          throw new Error('Login failed');
        }

        return response.body ?? {};
      }),
    );
  }

  doRegister(request: {
    fullName: string;
    username: string;
    email: string;
    phone: string;
    password: string;
  }): Observable<{ message?: string }> {
    return this.http.post<{ message?: string }>(REGISTER_API_URL, request, { observe: 'response' }).pipe(
      map((response) => {
        if (response.status !== 200) {
          throw new Error('Registration failed');
        }

        return response.body ?? { message: 'Registration successful' };
      }),
    );
  }
}
