import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder, 
    private authService: AuthenticationService, 
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;
      
      this.authService.login(loginData).subscribe({
        next: (response) => {
          {
            localStorage.setItem('token', response.token); // 🔹 Store JWT token
            this.router.navigate(['/dashboard']); // 🔹 Redirect to dashboard
            console.log('login successful', response)
          } 
        },
        error: (error) => {
          this.errorMessage = 'Login failed. Please try again.';
          console.error(error);
        }}
      );
    } else {
      this.errorMessage = 'Please fill in valid login details.';
    }
  }
}
