import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ImageCacheService } from './image-cache.service';

export interface Order {
  id: number;
  orderNumber: string;
  userId: number;
  totalAmount: number;
  status: string;
  shippingFullName: string;
  shippingEmail: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingZipCode: string;
  shippingCountry: string;
  createdAt: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
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
  private apiUrl = 'http://localhost:5000/api/orders';

  constructor(
    private http: HttpClient,
    private imageCacheService: ImageCacheService
  ) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  /**
   * Get all orders for the current user
   */
  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      map(orders => orders.map(order => ({
        ...order,
        items: order.items.map(item => ({
          ...item,
          productImage: this.imageCacheService.addCacheBuster(item.productImage)
        }))
      })))
    );
  }

  /**
   * Get order by ID
   */
  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      map(order => ({
        ...order,
        items: order.items.map(item => ({
          ...item,
          productImage: this.imageCacheService.addCacheBuster(item.productImage)
        }))
      }))
    );
  }

  /**
   * Create a new order
   */
  createOrder(shippingInfo: ShippingInfo): Observable<Order> {
    // Map camelCase to PascalCase for backend
    const orderData = {
      ShippingFullName: shippingInfo.fullName,
      ShippingEmail: shippingInfo.email,
      ShippingPhone: shippingInfo.phone,
      ShippingAddress: shippingInfo.address,
      ShippingCity: shippingInfo.city,
      ShippingState: shippingInfo.state,
      ShippingZipCode: shippingInfo.zipCode,
      ShippingCountry: shippingInfo.country
    };
    return this.http.post<Order>(this.apiUrl, orderData, { headers: this.getHeaders() });
  }

  /**
   * Cancel an order
   */
  cancelOrder(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/cancel`, {}, { headers: this.getHeaders() });
  }
}
