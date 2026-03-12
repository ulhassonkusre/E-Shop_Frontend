import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OrderService, Order } from '../../services/order.service';

@Component({
  selector: 'app-order-success',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="success-container">
      <div class="success-card">
        <div class="success-icon">
          <span class="material-icons">check_circle</span>
        </div>

        <h1>Order Placed Successfully!</h1>

        <p class="success-message">
          Thank you for your order! Your order has been successfully placed and will be processed shortly.
        </p>

        <div *ngIf="isLoading" class="loading-order">
          <div class="spinner"></div>
          <p>Loading order details...</p>
        </div>

        <div *ngIf="!isLoading && order" class="order-info">
          <div class="info-row">
            <span class="material-icons">confirmation_number</span>
            <div>
              <strong>Order Number</strong>
              <p>#{{ order.orderNumber }}</p>
            </div>
          </div>
          <div class="info-row">
            <span class="material-icons">schedule</span>
            <div>
              <strong>Order Date</strong>
              <p>{{ order.createdAt | date:'yyyy-MM-dd HH:mm:ss' }}</p>
            </div>
          </div>
          <div class="info-row">
            <span class="material-icons">local_shipping</span>
            <div>
              <strong>Estimated Delivery</strong>
              <p>{{ estimatedDelivery | date:'fullDate' }}</p>
            </div>
          </div>
          <div class="info-row">
            <span class="material-icons">payments</span>
            <div>
              <strong>Order Total</strong>
              <p>\${{ order.totalAmount.toFixed(2) }}</p>
            </div>
          </div>
        </div>

        <div *ngIf="!isLoading && !order" class="no-order">
          <p>No order details found. Please continue shopping.</p>
        </div>

        <div class="success-actions">
          <a routerLink="/products" class="btn btn-primary">
            <span class="material-icons">storefront</span>
            Continue Shopping
          </a>
          <a routerLink="/orders" class="btn btn-outline">
            <span class="material-icons">shopping_bag</span>
            View My Orders
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .success-container {
      min-height: calc(100vh - 70px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .success-card {
      background: white;
      border-radius: 15px;
      padding: 50px;
      text-align: center;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      max-width: 500px;
      width: 100%;
      animation: slideUp 0.5s ease-out;
    }

    @keyframes slideUp {
      from {
        transform: translateY(30px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .success-icon {
      width: 100px;
      height: 100px;
      margin: 0 auto 25px;
      background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: scaleIn 0.5s ease-out 0.2s both;
    }

    @keyframes scaleIn {
      from {
        transform: scale(0);
      }
      to {
        transform: scale(1);
      }
    }

    .success-icon .material-icons {
      font-size: 60px;
      color: white;
    }

    .success-card h1 {
      color: #333;
      font-size: 28px;
      margin-bottom: 15px;
    }

    .success-message {
      color: #666;
      font-size: 16px;
      line-height: 1.6;
      margin-bottom: 30px;
    }

    .loading-order {
      padding: 30px;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .order-info {
      background: #f9f9f9;
      border-radius: 10px;
      padding: 25px;
      margin-bottom: 30px;
      text-align: left;
    }

    .no-order {
      background: #fff3cd;
      border-radius: 10px;
      padding: 20px;
      margin-bottom: 30px;
      color: #856404;
    }

    .info-row {
      display: flex;
      align-items: flex-start;
      gap: 15px;
      padding: 15px 0;
      border-bottom: 1px solid #e0e0e0;
    }

    .info-row:last-child {
      border-bottom: none;
    }

    .info-row .material-icons {
      color: #667eea;
      font-size: 24px;
    }

    .info-row strong {
      display: block;
      color: #333;
      font-size: 14px;
      margin-bottom: 5px;
    }

    .info-row p {
      color: #666;
      font-size: 15px;
      margin: 0;
    }

    .success-actions {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 14px 28px;
      border: none;
      border-radius: 8px;
      font-size: 15px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s;
      text-decoration: none;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
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

    .btn .material-icons {
      font-size: 20px;
    }

    @media (min-width: 480px) {
      .success-actions {
        flex-direction: row;
      }

      .success-actions .btn {
        flex: 1;
      }
    }
  `]
})
export class OrderSuccessComponent implements OnInit {
  order: Order | null = null;
  isLoading = true;
  orderDate: Date = new Date();
  estimatedDelivery: Date = new Date();

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.estimatedDelivery.setDate(this.estimatedDelivery.getDate() + 7);
    
    const orderId = this.route.snapshot.queryParamMap.get('orderId');
    if (orderId) {
      this.loadOrder(+orderId);
    } else {
      this.isLoading = false;
    }
  }

  loadOrder(id: number): void {
    this.isLoading = true;
    this.orderService.getOrderById(id).subscribe({
      next: (order) => {
        this.order = order;
        this.orderDate = new Date(order.createdAt);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.order = null;
      }
    });
  }
}
