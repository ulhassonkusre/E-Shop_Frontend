import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Order {
  id: string;
  date: Date;
  status: 'delivered' | 'processing' | 'shipped' | 'cancelled';
  total: number;
  items: number;
  products: OrderProduct[];
  shippingInfo: ShippingInfo;
}

export interface OrderProduct {
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface ShippingInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly STORAGE_KEY = 'ecommerce_orders';
  private readonly CURRENT_ORDER_KEY = 'ecommerce_current_order';

  constructor() { }

  /**
   * Get all orders from session storage
   */
  getOrders(): Order[] {
    const ordersStr = sessionStorage.getItem(this.STORAGE_KEY);
    if (!ordersStr) {
      return this.getDefaultOrders();
    }
    const orders = JSON.parse(ordersStr) as Order[];
    // Convert date strings back to Date objects
    return orders.map(order => ({
      ...order,
      date: new Date(order.date)
    }));
  }

  /**
   * Save orders to session storage
   */
  private saveOrders(orders: Order[]): void {
    sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(orders));
  }

  /**
   * Add a new order
   */
  addOrder(order: Omit<Order, 'id' | 'date' | 'status'> & { shippingInfo: ShippingInfo }): Observable<Order> {
    const orders = this.getOrders();
    
    const newOrder: Order = {
      ...order,
      id: this.generateOrderId(),
      date: new Date(),
      status: 'processing'
    };

    orders.unshift(newOrder); // Add to beginning of array
    this.saveOrders(orders);

    // Store current order for success page
    sessionStorage.setItem(this.CURRENT_ORDER_KEY, JSON.stringify(newOrder));

    return of(newOrder);
  }

  /**
   * Get current order (for success page)
   */
  getCurrentOrder(): Order | null {
    const orderStr = sessionStorage.getItem(this.CURRENT_ORDER_KEY);
    if (!orderStr) {
      return null;
    }
    const order = JSON.parse(orderStr) as Order;
    return {
      ...order,
      date: new Date(order.date)
    };
  }

  /**
   * Clear current order
   */
  clearCurrentOrder(): void {
    sessionStorage.removeItem(this.CURRENT_ORDER_KEY);
  }

  /**
   * Get order by ID
   */
  getOrderById(id: string): Order | null {
    const orders = this.getOrders();
    return orders.find(order => order.id === id) || null;
  }

  /**
   * Update order status
   */
  updateOrderStatus(id: string, status: Order['status']): boolean {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === id);
    if (!order) {
      return false;
    }
    order.status = status;
    this.saveOrders(orders);
    return true;
  }

  /**
   * Cancel order
   */
  cancelOrder(id: string): boolean {
    return this.updateOrderStatus(id, 'cancelled');
  }

  /**
   * Clear all orders (for demo/testing)
   */
  clearAllOrders(): void {
    sessionStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * Generate unique order ID
   */
  private generateOrderId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 7);
    return `ORD-${timestamp}${random}`.toUpperCase();
  }

  /**
   * Get default/sample orders for first-time users
   */
  private getDefaultOrders(): Order[] {
    const defaultOrders: Order[] = [
      {
        id: 'ORD-001234',
        date: new Date('2024-01-15'),
        status: 'delivered',
        total: 249.98,
        items: 2,
        products: [
          { name: 'Wireless Headphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200', price: 199.99, quantity: 1 },
          { name: 'Phone Stand', image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=200', price: 19.99, quantity: 2 }
        ],
        shippingInfo: {
          fullName: 'John Doe',
          email: 'john@example.com',
          phone: '1234567890',
          address: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'United States'
        }
      },
      {
        id: 'ORD-001235',
        date: new Date('2024-01-20'),
        status: 'processing',
        total: 429.98,
        items: 2,
        products: [
          { name: 'Smart Watch', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200', price: 299.99, quantity: 1 },
          { name: 'Mechanical Keyboard', image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=200', price: 129.99, quantity: 1 }
        ],
        shippingInfo: {
          fullName: 'John Doe',
          email: 'john@example.com',
          phone: '1234567890',
          address: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'United States'
        }
      },
      {
        id: 'ORD-001236',
        date: new Date('2024-01-25'),
        status: 'shipped',
        total: 159.98,
        items: 2,
        products: [
          { name: 'Bluetooth Speaker', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=200', price: 79.99, quantity: 2 }
        ],
        shippingInfo: {
          fullName: 'John Doe',
          email: 'john@example.com',
          phone: '1234567890',
          address: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'United States'
        }
      }
    ];
    return defaultOrders;
  }
}
