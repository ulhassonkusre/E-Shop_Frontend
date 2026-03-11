import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { User } from '../../models/auth.models';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  user: User | null = null;
  cartCount = 0;
  showUserMenu = false;
  isLoginPage = false;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Check if current route is login page
    this.updateLoginPageStatus();
    
    // Listen for route changes
    this.router.events.subscribe(() => {
      this.updateLoginPageStatus();
    });

    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.user = user;
    });

    this.cartService.cart$.subscribe(cart => {
      this.cartCount = cart?.totalItems || 0;
    });

    // Initial cart count
    if (this.authService.isLoggedIn()) {
      this.cartService.getCart().subscribe();
    }
  }

  updateLoginPageStatus(): void {
    this.isLoginPage = this.router.url === '/login' || this.router.url === '/signup';
  }

  logout(): void {
    this.authService.logout();
    this.showUserMenu = false;
    this.router.navigate(['/login']);
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  hideUserMenu(): void {
    this.showUserMenu = false;
  }

  getInitials(): string {
    if (!this.user?.username) return 'U';
    const names = this.user.username.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return this.user.username.substring(0, 2).toUpperCase();
  }

  getUserAvatar(): string {
    // Generate avatar using UI Avatars API
    const name = this.user?.username || 'User';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=128&background=667eea&color=fff&bold=true`;
  }
}
