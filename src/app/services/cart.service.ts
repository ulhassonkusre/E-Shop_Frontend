import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { Cart, AddToCartDto, UpdateCartItemDto } from '../models/cart.models';
import { ImageCacheService } from './image-cache.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:5000/api/cart';
  private cartSubject = new BehaviorSubject<Cart | null>(null);
  public cart$ = this.cartSubject.asObservable();

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

  getCart(): Observable<Cart> {
    return this.http.get<Cart>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      map(cart => ({
        ...cart,
        items: cart.items.map(item => ({
          ...item,
          productImage: this.imageCacheService.addCacheBuster(item.productImage)
        }))
      })),
      tap(cart => this.cartSubject.next(cart))
    );
  }

  addToCart(dto: AddToCartDto): Observable<Cart> {
    return this.http.post<Cart>(`${this.apiUrl}/items`, dto, { headers: this.getHeaders() }).pipe(
      tap(() => this.getCart().subscribe())
    );
  }

  updateCartItem(itemId: number, dto: UpdateCartItemDto): Observable<Cart> {
    return this.http.put<Cart>(`${this.apiUrl}/items/${itemId}`, dto, { headers: this.getHeaders() }).pipe(
      tap(() => this.getCart().subscribe())
    );
  }

  removeFromCart(itemId: number): Observable<Cart> {
    return this.http.delete<Cart>(`${this.apiUrl}/items/${itemId}`, { headers: this.getHeaders() }).pipe(
      tap(() => this.getCart().subscribe())
    );
  }

  clearCart(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/clear`, { headers: this.getHeaders() }).pipe(
      tap(() => this.cartSubject.next(null))
    );
  }

  getCartCount(): Observable<number> {
    return new Observable<number>(observer => {
      const cart = this.cartSubject.value;
      if (cart) {
        observer.next(cart.totalItems);
      } else {
        this.getCart().subscribe(c => observer.next(c.totalItems));
      }
    });
  }

  getCurrentCart(): Cart | null {
    return this.cartSubject.value;
  }
}
