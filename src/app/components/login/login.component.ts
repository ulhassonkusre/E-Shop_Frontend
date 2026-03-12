import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  showPassword = false;
  errorMessage = '';
  isLoading = false;
  returnUrl = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Get the return URL from query params
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';
  }

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.isLoading = false;
        // Redirect to the intended URL or default to products
        const redirectUrl = this.returnUrl || '/products';
        this.router.navigateByUrl(redirectUrl);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Login failed. Please try again.';
      }
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  goToSignup(): void {
    this.router.navigate(['/signup']);
  }

  goToForgotPassword(): void {
    this.router.navigate(['/forgot-password']);
  }
}
