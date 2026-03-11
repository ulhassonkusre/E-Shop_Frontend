import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { User } from '../../models/auth.models';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="account-container">
      <h1>My Account</h1>
      
      <div class="account-content">
        <div class="account-sidebar">
          <div class="profile-summary">
            <img [src]="getUserAvatar()" [alt]="user?.username" class="profile-avatar">
            <h3>{{ user?.username }}</h3>
            <p>{{ user?.email }}</p>
          </div>
          <nav class="account-nav">
            <a routerLink="/account" routerLinkActive="active" class="nav-item">
              <span class="material-icons">person</span>
              Profile Information
            </a>
            <a routerLink="/orders" routerLinkActive="active" class="nav-item">
              <span class="material-icons">shopping_bag</span>
              My Orders
            </a>
            <a routerLink="/wishlist" routerLinkActive="active" class="nav-item">
              <span class="material-icons">favorite</span>
              Wishlist
            </a>
          </nav>
        </div>

        <div class="account-main">
          <div class="profile-card">
            <h2>Profile Information</h2>
            
            <form (ngSubmit)="updateProfile()" #profileForm="ngForm">
              <div class="form-row">
                <div class="form-group">
                  <label for="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    [(ngModel)]="profileFormModel.username"
                    name="username"
                    required
                  />
                </div>
                <div class="form-group">
                  <label for="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    [(ngModel)]="profileFormModel.email"
                    name="email"
                    required
                  />
                </div>
              </div>

              <div class="form-group">
                <label>Member Since</label>
                <p class="static-value">{{ memberSince | date:'fullDate' }}</p>
              </div>

              <div class="form-actions">
                <button type="submit" class="btn btn-primary" [disabled]="isSaving">
                  {{ isSaving ? 'Saving...' : 'Save Changes' }}
                </button>
              </div>
            </form>
          </div>

          <div class="password-card">
            <h2>Change Password</h2>
            
            <form (ngSubmit)="changePassword()" #passwordForm="ngForm">
              <div class="form-group">
                <label for="currentPassword">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  [(ngModel)]="passwordFormModel.currentPassword"
                  name="currentPassword"
                  required
                />
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label for="newPassword">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    [(ngModel)]="passwordFormModel.newPassword"
                    name="newPassword"
                    required
                    minlength="6"
                  />
                </div>
                <div class="form-group">
                  <label for="confirmPassword">Confirm New Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    [(ngModel)]="passwordFormModel.confirmPassword"
                    name="confirmPassword"
                    required
                    minlength="6"
                  />
                </div>
              </div>

              <div class="form-actions">
                <button type="submit" class="btn btn-primary" [disabled]="isSaving">
                  {{ isSaving ? 'Updating...' : 'Update Password' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .account-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .account-container h1 {
      color: #333;
      margin-bottom: 30px;
    }

    .account-content {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 30px;
    }

    .account-sidebar {
      background: white;
      border-radius: 10px;
      padding: 25px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      height: fit-content;
    }

    .profile-summary {
      text-align: center;
      padding-bottom: 25px;
      border-bottom: 2px solid #f0f0f0;
      margin-bottom: 20px;
    }

    .profile-avatar {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      margin-bottom: 15px;
      border: 4px solid #f0f0f0;
    }

    .profile-summary h3 {
      color: #333;
      margin-bottom: 5px;
    }

    .profile-summary p {
      color: #666;
      font-size: 14px;
    }

    .account-nav {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 15px;
      color: #666;
      text-decoration: none;
      border-radius: 8px;
      transition: all 0.3s;
    }

    .nav-item:hover {
      background: #f5f5f5;
      color: #667eea;
    }

    .nav-item.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .nav-item .material-icons {
      font-size: 20px;
    }

    .account-main {
      display: flex;
      flex-direction: column;
      gap: 25px;
    }

    .profile-card, .password-card {
      background: white;
      border-radius: 10px;
      padding: 30px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .profile-card h2, .password-card h2 {
      color: #333;
      margin-bottom: 25px;
      padding-bottom: 15px;
      border-bottom: 2px solid #f0f0f0;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      color: #333;
      font-weight: 500;
    }

    .form-group input {
      width: 100%;
      padding: 12px 15px;
      border: 2px solid #e0e0e0;
      border-radius: 5px;
      font-size: 14px;
      transition: border-color 0.3s;
    }

    .form-group input:focus {
      outline: none;
      border-color: #667eea;
    }

    .static-value {
      color: #666;
      padding: 12px 0;
    }

    .form-actions {
      margin-top: 25px;
    }

    .btn {
      padding: 12px 30px;
      border: none;
      border-radius: 5px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
    }

    .btn-primary:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    @media (max-width: 768px) {
      .account-content {
        grid-template-columns: 1fr;
      }

      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AccountComponent implements OnInit {
  user: User | null = null;
  memberSince: Date = new Date();
  isSaving = false;

  profileFormModel = {
    username: '',
    email: ''
  };

  passwordFormModel = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.user = user;
        this.profileFormModel.username = user.username;
        this.profileFormModel.email = user.email;
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  getUserAvatar(): string {
    const name = this.user?.username || 'User';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=256&background=667eea&color=fff&bold=true`;
  }

  updateProfile(): void {
    this.isSaving = true;
    // Simulate API call
    setTimeout(() => {
      this.isSaving = false;
      this.toastService.success('Profile updated successfully!');
    }, 1000);
  }

  changePassword(): void {
    if (this.passwordFormModel.newPassword !== this.passwordFormModel.confirmPassword) {
      this.toastService.error('Passwords do not match');
      return;
    }

    if (this.passwordFormModel.newPassword.length < 6) {
      this.toastService.error('Password must be at least 6 characters');
      return;
    }

    this.isSaving = true;
    // Simulate API call
    setTimeout(() => {
      this.isSaving = false;
      this.passwordFormModel.currentPassword = '';
      this.passwordFormModel.newPassword = '';
      this.passwordFormModel.confirmPassword = '';
      this.toastService.success('Password updated successfully!');
    }, 1000);
  }
}
