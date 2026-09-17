import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginResponse } from '../models/login-response';
import { LoginRequest } from '../models/login-request';
import { Observable } from 'rxjs';

const API_URL = 'https://api.example.com/login';

@Injectable({
  providedIn: 'root',
})
export class Integration {
  constructor(private http: HttpClient) {}

  doLogin(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(API_URL, request);
  }
}
