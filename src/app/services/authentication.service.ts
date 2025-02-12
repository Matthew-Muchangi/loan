import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private loginUrl = 'http://172.16.8.24:8080/auth/login'; // 🔹 Login API URL
  private registerUrl = 'http://172.16.8.24:8080/auth/register'; // 🔹 Register API URL

  constructor(private http: HttpClient) {}

  // Login API call
  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post<any>(this.loginUrl, credentials);
  }

  // Register API call
  register(userData: {
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
  }): Observable<any> {
    return this.http.post<any>(this.registerUrl, userData);
  }
}
