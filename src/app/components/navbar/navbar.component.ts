import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
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

  constructor(
    private authService: AuthService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
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

  logout(): void {
    this.authService.logout();
  }
}
