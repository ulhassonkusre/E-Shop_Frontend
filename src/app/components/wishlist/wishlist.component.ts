import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { User } from '../../models/auth.models';
import { Product } from '../../models/product.models';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="wishlist-container">
      <h1>My Wishlist</h1>
      
      <div class="wishlist-content">
        <div class="wishlist-sidebar">
          <nav class="wishlist-nav">
            <a routerLink="/account" class="nav-item">
              <span class="material-icons">person</span>
              Profile
            </a>
            <a routerLink="/orders" class="nav-item">
              <span class="material-icons">shopping_bag</span>
              My Orders
            </a>
            <a routerLink="/wishlist" routerLinkActive="active" class="nav-item">
              <span class="material-icons">favorite</span>
              Wishlist
            </a>
          </nav>
        </div>

        <div class="wishlist-main">
          <div *ngIf="wishlistItems.length === 0" class="no-wishlist">
            <span class="material-icons">favorite_border</span>
            <h2>Your wishlist is empty</h2>
            <p>Save items you love to your wishlist</p>
            <a routerLink="/products" class="btn btn-primary">Browse Products</a>
          </div>

          <div *ngIf="wishlistItems.length > 0" class="wishlist-grid">
            <div class="wishlist-header">
              <span>{{ wishlistItems.length }} items</span>
              <button class="btn btn-outline btn-sm" (click)="addAllToCart()">
                <span class="material-icons">add_shopping_cart</span>
                Add All to Cart
              </button>
            </div>

            <div *ngFor="let item of wishlistItems" class="wishlist-card">
              <button class="remove-btn" (click)="removeFromWishlist(item.id)">
                <span class="material-icons">close</span>
              </button>
              
              <div class="product-image">
                <img [src]="item.imageUrl" [alt]="item.name">
              </div>
              
              <div class="product-info">
                <span class="product-category">{{ item.category }}</span>
                <h3 class="product-name">{{ item.name }}</h3>
                <p class="product-description">{{ item.description }}</p>
                <div class="product-footer">
                  <span class="product-price">\${{ item.price.toFixed(2) }}</span>
                  <button class="btn btn-primary btn-sm" (click)="addToCart(item)">
                    <span class="material-icons">add_shopping_cart</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .wishlist-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .wishlist-container h1 {
      color: #333;
      margin-bottom: 30px;
    }

    .wishlist-content {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 30px;
    }

    .wishlist-sidebar {
      background: white;
      border-radius: 10px;
      padding: 25px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      height: fit-content;
    }

    .wishlist-nav {
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

    .wishlist-main {
      background: white;
      border-radius: 10px;
      padding: 30px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .no-wishlist {
      text-align: center;
      padding: 60px 20px;
    }

    .no-wishlist .material-icons {
      font-size: 80px;
      color: #ccc;
      margin-bottom: 20px;
    }

    .no-wishlist h2 {
      color: #333;
      margin-bottom: 10px;
    }

    .no-wishlist p {
      color: #666;
      margin-bottom: 25px;
    }

    .wishlist-grid {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .wishlist-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 15px;
      border-bottom: 2px solid #f0f0f0;
    }

    .wishlist-header span {
      font-weight: 600;
      color: #666;
    }

    .btn-sm {
      padding: 8px 16px;
      font-size: 13px;
      display: inline-flex;
      align-items: center;
      gap: 5px;
    }

    .btn-sm .material-icons {
      font-size: 18px;
    }

    .wishlist-card {
      display: grid;
      grid-template-columns: 200px 1fr auto;
      gap: 20px;
      padding: 20px;
      border: 2px solid #e0e0e0;
      border-radius: 10px;
      position: relative;
      transition: border-color 0.3s;
    }

    .wishlist-card:hover {
      border-color: #667eea;
    }

    .remove-btn {
      position: absolute;
      top: 15px;
      right: 15px;
      background: none;
      border: none;
      color: #999;
      cursor: pointer;
      padding: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 5px;
      transition: all 0.3s;
    }

    .remove-btn:hover {
      background: #fee;
      color: #dc3545;
    }

    .remove-btn .material-icons {
      font-size: 20px;
    }

    .product-image {
      width: 200px;
      height: 200px;
      border-radius: 10px;
      overflow: hidden;
      background: #f5f5f5;
    }

    .product-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .product-info {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .product-category {
      display: inline-block;
      background: #f0f0f0;
      color: #666;
      padding: 4px 10px;
      border-radius: 15px;
      font-size: 12px;
      margin-bottom: 10px;
      align-self: flex-start;
    }

    .product-name {
      font-size: 18px;
      color: #333;
      margin-bottom: 8px;
    }

    .product-description {
      color: #666;
      font-size: 14px;
      margin-bottom: 15px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .product-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: auto;
    }

    .product-price {
      font-size: 22px;
      font-weight: 700;
      color: #667eea;
    }

    .btn {
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
    }

    .btn-outline {
      background: transparent;
      border: 2px solid #667eea;
      color: #667eea;
    }

    .btn-outline:hover {
      background: #667eea;
      color: white;
    }

    @media (max-width: 768px) {
      .wishlist-content {
        grid-template-columns: 1fr;
      }

      .wishlist-card {
        grid-template-columns: 1fr;
      }

      .product-image {
        width: 100%;
        height: 200px;
      }
    }
  `]
})
export class WishlistComponent implements OnInit {
  user: User | null = null;
  wishlistItems: Product[] = [];

  constructor(
    private authService: AuthService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.user = user;
        this.loadWishlist();
      }
    });
  }

  loadWishlist(): void {
    // Sample wishlist data
    this.wishlistItems = [
      {
        id: 1,
        name: 'Wireless Headphones',
        description: 'Premium noise-canceling wireless headphones with 30-hour battery life.',
        price: 199.99,
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
        stock: 50,
        category: 'Electronics'
      },
      {
        id: 3,
        name: 'Laptop Stand',
        description: 'Ergonomic aluminum laptop stand for better posture.',
        price: 49.99,
        imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
        stock: 100,
        category: 'Accessories'
      },
      {
        id: 10,
        name: 'Bluetooth Speaker',
        description: 'Portable Bluetooth speaker with 360-degree sound.',
        price: 79.99,
        imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400',
        stock: 70,
        category: 'Electronics'
      }
    ];
  }

  removeFromWishlist(productId: number): void {
    this.wishlistItems = this.wishlistItems.filter(item => item.id !== productId);
    this.toastService.success('Removed from wishlist');
  }

  addToCart(product: Product): void {
    this.toastService.success(`${product.name} added to cart!`);
  }

  addAllToCart(): void {
    this.toastService.success(`Added ${this.wishlistItems.length} items to cart!`);
  }
}
