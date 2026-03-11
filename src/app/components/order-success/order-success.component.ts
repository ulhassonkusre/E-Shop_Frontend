import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
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

        <div *ngIf="order" class="order-info">
          <div class="info-row">
            <span class="material-icons">confirmation_number</span>
            <div>
              <strong>Order Number</strong>
              <p>#{{ order.id }}</p>
            </div>
          </div>
          <div class="info-row">
            <span class="material-icons">schedule</span>
            <div>
              <strong>Order Date</strong>
              <p>{{ order.date | date:'medium' }}</p>
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
              <p>\${{ order.total.toFixed(2) }}</p>
            </div>
          </div>
        </div>

        <div *ngIf="!order" class="no-order">
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
  orderNumber: string = '';
  orderDate: Date = new Date();
  estimatedDelivery: Date = new Date();

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.order = this.orderService.getCurrentOrder();
    
    if (this.order) {
      this.orderNumber = this.order.id;
      this.orderDate = this.order.date;
      this.estimatedDelivery.setDate(this.estimatedDelivery.getDate() + 7);
    } else {
      this.orderNumber = this.generateOrderNumber();
    }
  }

  private generateOrderNumber(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }
}
