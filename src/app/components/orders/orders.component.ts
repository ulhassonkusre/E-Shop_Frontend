import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/auth.models';

interface Order {
  id: string;
  date: Date;
  status: 'delivered' | 'processing' | 'shipped' | 'cancelled';
  total: number;
  items: number;
  products: OrderProduct[];
}

interface OrderProduct {
  name: string;
  image: string;
  price: number;
  quantity: number;
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="orders-container">
      <h1>My Orders</h1>
      
      <div class="orders-content">
        <div class="orders-sidebar">
          <nav class="orders-nav">
            <a routerLink="/account" class="nav-item">
              <span class="material-icons">person</span>
              Profile
            </a>
            <a routerLink="/orders" routerLinkActive="active" class="nav-item">
              <span class="material-icons">shopping_bag</span>
              My Orders
            </a>
            <a routerLink="/wishlist" class="nav-item">
              <span class="material-icons">favorite</span>
              Wishlist
            </a>
          </nav>
        </div>

        <div class="orders-main">
          <div *ngIf="orders.length === 0" class="no-orders">
            <span class="material-icons">inventory_2</span>
            <h2>No orders yet</h2>
            <p>Start shopping to see your orders here</p>
            <a routerLink="/products" class="btn btn-primary">Browse Products</a>
          </div>

          <div *ngIf="orders.length > 0" class="orders-list">
            <div *ngFor="let order of orders" class="order-card">
              <div class="order-header">
                <div class="order-info">
                  <span class="order-id">Order #{{ order.id }}</span>
                  <span class="order-date">{{ order.date | date:'medium' }}</span>
                </div>
                <span class="order-status status-{{ order.status }}">
                  {{ order.status | titlecase }}
                </span>
              </div>

              <div class="order-products">
                <div *ngFor="let product of order.products" class="order-product">
                  <img [src]="product.image" [alt]="product.name">
                  <div class="product-details">
                    <h4>{{ product.name }}</h4>
                    <p>Qty: {{ product.quantity }}</p>
                  </div>
                  <span class="product-price">\${{ (product.price * product.quantity).toFixed(2) }}</span>
                </div>
              </div>

              <div class="order-footer">
                <span class="order-total">Total: \${{ order.total.toFixed(2) }}</span>
                <div class="order-actions">
                  <button class="btn btn-outline">View Details</button>
                  <button *ngIf="order.status === 'delivered'" class="btn btn-primary">Reorder</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .orders-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .orders-container h1 {
      color: #333;
      margin-bottom: 30px;
    }

    .orders-content {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 30px;
    }

    .orders-sidebar {
      background: white;
      border-radius: 10px;
      padding: 25px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      height: fit-content;
    }

    .orders-nav {
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

    .orders-main {
      background: white;
      border-radius: 10px;
      padding: 30px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .no-orders {
      text-align: center;
      padding: 60px 20px;
    }

    .no-orders .material-icons {
      font-size: 80px;
      color: #ccc;
      margin-bottom: 20px;
    }

    .no-orders h2 {
      color: #333;
      margin-bottom: 10px;
    }

    .no-orders p {
      color: #666;
      margin-bottom: 25px;
    }

    .orders-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .order-card {
      border: 2px solid #e0e0e0;
      border-radius: 10px;
      overflow: hidden;
      transition: border-color 0.3s;
    }

    .order-card:hover {
      border-color: #667eea;
    }

    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      background: #f9f9f9;
      border-bottom: 2px solid #e0e0e0;
    }

    .order-info {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .order-id {
      font-weight: 700;
      color: #333;
      font-size: 16px;
    }

    .order-date {
      color: #666;
      font-size: 14px;
    }

    .order-status {
      padding: 6px 15px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-delivered {
      background: #d4edda;
      color: #155724;
    }

    .status-processing {
      background: #fff3cd;
      color: #856404;
    }

    .status-shipped {
      background: #cce5ff;
      color: #004085;
    }

    .status-cancelled {
      background: #f8d7da;
      color: #721c24;
    }

    .order-products {
      padding: 20px;
    }

    .order-product {
      display: flex;
      align-items: center;
      gap: 15px;
      padding: 15px 0;
      border-bottom: 1px solid #f0f0f0;
    }

    .order-product:last-child {
      border-bottom: none;
    }

    .order-product img {
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: 5px;
    }

    .product-details {
      flex: 1;
    }

    .product-details h4 {
      color: #333;
      margin-bottom: 5px;
    }

    .product-details p {
      color: #666;
      font-size: 14px;
    }

    .product-price {
      font-weight: 700;
      color: #667eea;
    }

    .order-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      background: #fafafa;
      border-top: 2px solid #e0e0e0;
    }

    .order-total {
      font-size: 18px;
      font-weight: 700;
      color: #333;
    }

    .order-actions {
      display: flex;
      gap: 10px;
    }

    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s;
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

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
    }

    @media (max-width: 768px) {
      .orders-content {
        grid-template-columns: 1fr;
      }

      .order-header {
        flex-direction: column;
        gap: 15px;
        align-items: flex-start;
      }

      .order-footer {
        flex-direction: column;
        gap: 15px;
      }
    }
  `]
})
export class OrdersComponent implements OnInit {
  user: User | null = null;
  orders: Order[] = [];

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.user = user;
        this.loadOrders();
      }
    });
  }

  loadOrders(): void {
    // Sample orders data
    this.orders = [
      {
        id: 'ORD-001234',
        date: new Date('2024-01-15'),
        status: 'delivered',
        total: 249.98,
        items: 2,
        products: [
          { name: 'Wireless Headphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200', price: 199.99, quantity: 1 },
          { name: 'Phone Stand', image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=200', price: 19.99, quantity: 2 }
        ]
      },
      {
        id: 'ORD-001235',
        date: new Date('2024-01-20'),
        status: 'processing',
        total: 429.98,
        items: 2,
        products: [
          { name: 'Smart Watch', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200', price: 299.99, quantity: 1 },
          { name: 'Mechanical Keyboard', image: 'https://images.unsplash.com/photo-1587829741301-dc798b91a603?w=200', price: 129.99, quantity: 1 }
        ]
      },
      {
        id: 'ORD-001236',
        date: new Date('2024-01-25'),
        status: 'shipped',
        total: 159.98,
        items: 2,
        products: [
          { name: 'Bluetooth Speaker', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=200', price: 79.99, quantity: 2 }
        ]
      }
    ];
  }
}
