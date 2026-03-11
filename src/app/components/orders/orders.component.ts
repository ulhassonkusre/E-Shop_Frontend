import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { OrderService, Order } from '../../services/order.service';
import { User } from '../../models/auth.models';

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
          <div *ngIf="isLoading" class="loading">
            <span class="material-icons spin">sync</span>
            <p>Loading orders...</p>
          </div>

          <div *ngIf="!isLoading && orders.length === 0" class="no-orders">
            <span class="material-icons">inventory_2</span>
            <h2>No orders yet</h2>
            <p>Start shopping to see your orders here</p>
            <a routerLink="/products" class="btn btn-primary">Browse Products</a>
          </div>

          <div *ngIf="!isLoading && orders.length > 0" class="orders-list">
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
                  <button class="btn btn-outline" (click)="viewDetails(order)">View Details</button>
                  <button *ngIf="order.status === 'delivered' || order.status === 'cancelled'" class="btn btn-primary" (click)="reorder(order)">Reorder</button>
                  <button *ngIf="order.status === 'processing'" class="btn btn-danger" (click)="cancelOrder(order)">Cancel Order</button>
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

    .loading {
      text-align: center;
      padding: 60px 20px;
    }

    .loading .material-icons.spin {
      font-size: 48px;
      color: #667eea;
      animation: spin 1s linear infinite;
      margin-bottom: 15px;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .loading p {
      color: #666;
      font-size: 16px;
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

    .btn-danger {
      background: #dc3545;
      color: white;
    }

    .btn-danger:hover {
      background: #c82333;
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

      .order-actions {
        width: 100%;
        justify-content: stretch;
      }

      .order-actions .btn {
        flex: 1;
      }
    }
  `]
})
export class OrdersComponent implements OnInit {
  user: User | null = null;
  orders: Order[] = [];
  isLoading = true;

  constructor(
    private authService: AuthService,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
      this.loadOrders();
    });
  }

  loadOrders(): void {
    this.isLoading = true;
    // Load orders from session storage
    const orders = this.orderService.getOrders();
    this.orders = orders;
    this.isLoading = false;
  }

  viewDetails(order: Order): void {
    // For now, just show an alert with order details
    const productsList = order.products.map(p => 
      `${p.name} (x${p.quantity}) - $${(p.price * p.quantity).toFixed(2)}`
    ).join('\n');
    
    alert(`Order #${order.id}\n\n` +
      `Date: ${order.date.toLocaleString()}\n` +
      `Status: ${order.status}\n\n` +
      `Products:\n${productsList}\n\n` +
      `Total: $${order.total.toFixed(2)}\n\n` +
      `Shipping to:\n${order.shippingInfo.fullName}\n${order.shippingInfo.address}\n${order.shippingInfo.city}, ${order.shippingInfo.state} ${order.shippingInfo.zipCode}`
    );
  }

  reorder(order: Order): void {
    // Navigate to products page - in a real app, this would add items to cart
    alert('Reorder functionality would add these items to your cart');
  }

  cancelOrder(order: Order): void {
    if (confirm(`Are you sure you want to cancel order #${order.id}?`)) {
      const success = this.orderService.cancelOrder(order.id);
      if (success) {
        order.status = 'cancelled';
        alert('Order cancelled successfully');
      } else {
        alert('Failed to cancel order');
      }
    }
  }
}
