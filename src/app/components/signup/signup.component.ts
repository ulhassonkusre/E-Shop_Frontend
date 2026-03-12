import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  username = '';
  email = '';
  password = '';
  confirmPassword = '';
  showPassword = false;
  showConfirmPassword = false;
  errorMessage = '';
  isLoading = false;

  get passwordsMatch(): boolean {
    return this.confirmPassword !== '' && this.password === this.confirmPassword;
  }

  get passwordStrength(): number {
    const pwd = this.password;
    if (!pwd) return 0;
    
    let strength = 0;
    if (pwd.length >= 6) strength += 20;
    if (pwd.length >= 8) strength += 20;
    if (/[a-z]/.test(pwd)) strength += 20;
    if (/[A-Z]/.test(pwd)) strength += 20;
    if (/[0-9]/.test(pwd)) strength += 20;
    if (/[^a-zA-Z0-9]/.test(pwd)) strength += 20;
    
    return Math.min(strength, 100);
  }

  get strengthColor(): string {
    const strength = this.passwordStrength;
    if (strength < 40) return '#dc3545';
    if (strength < 70) return '#ffc107';
    return '#28a745';
  }

  get strengthText(): string {
    const strength = this.passwordStrength;
    if (strength < 40) return 'Weak';
    if (strength < 70) return 'Medium';
    return 'Strong';
  }

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  onSubmit(): void {
    if (!this.username || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.register({
      username: this.username,
      email: this.email,
      password: this.password
    }).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Registration failed. Please try again.';
      }
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
