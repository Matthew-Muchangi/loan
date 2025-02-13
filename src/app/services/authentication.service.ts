import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private loginUrl = 'http://172.16.8.24:8080/auth/login'; 
  private registerUrl = 'http://172.16.8.24:8080/auth/register'; 

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
