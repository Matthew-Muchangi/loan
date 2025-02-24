import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  getToken() {
    throw new Error('Method not implemented.');
  }
  private loginUrl = 'http://172.16.8.12:8000/auth/login'; 
  private registerUrl = 'http://172.16.12.24:8000/auth/register'; 

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post<any>(this.loginUrl, credentials);
  }

  register(userData: {
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
  }): Observable<any> {
    return this.http.post<any>(this.registerUrl, userData);
  }

  logout(): void {
    localStorage.removeItem('userToken'); // Remove authentication token
    this.router.navigate(['/login']); // Redirect to login page
  }
}
