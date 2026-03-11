import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Product } from '../models/product.models';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private readonly STORAGE_KEY = 'ecommerce_wishlist';
  private wishlistSubject = new BehaviorSubject<Product[]>([]);
  public wishlist$ = this.wishlistSubject.asObservable();

  constructor() {
    this.loadWishlist();
  }

  /**
   * Load wishlist from localStorage
   */
  private loadWishlist(): void {
    const wishlistStr = localStorage.getItem(this.STORAGE_KEY);
    if (wishlistStr) {
      const wishlist = JSON.parse(wishlistStr) as Product[];
      this.wishlistSubject.next(wishlist);
    }
  }

  /**
   * Save wishlist to localStorage
   */
  private saveWishlist(wishlist: Product[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(wishlist));
    this.wishlistSubject.next(wishlist);
  }

  /**
   * Add product to wishlist
   */
  addToWishlist(product: Product): Observable<boolean> {
    const currentWishlist = this.wishlistSubject.value;
    
    // Check if already in wishlist
    if (currentWishlist.some(p => p.id === product.id)) {
      return of(false);
    }

    const newWishlist = [...currentWishlist, product];
    this.saveWishlist(newWishlist);
    return of(true);
  }

  /**
   * Remove product from wishlist
   */
  removeFromWishlist(productId: number): Observable<boolean> {
    const currentWishlist = this.wishlistSubject.value;
    const newWishlist = currentWishlist.filter(p => p.id !== productId);
    this.saveWishlist(newWishlist);
    return of(true);
  }

  /**
   * Toggle product in wishlist (add if not present, remove if present)
   */
  toggleWishlist(product: Product): Observable<boolean> {
    const currentWishlist = this.wishlistSubject.value;
    const exists = currentWishlist.some(p => p.id === product.id);
    
    if (exists) {
      return this.removeFromWishlist(product.id);
    } else {
      return this.addToWishlist(product);
    }
  }

  /**
   * Check if product is in wishlist
   */
  isInWishlist(productId: number): boolean {
    return this.wishlistSubject.value.some(p => p.id === productId);
  }

  /**
   * Get all wishlist items
   */
  getWishlist(): Product[] {
    return this.wishlistSubject.value;
  }

  /**
   * Get wishlist count
   */
  getCount(): number {
    return this.wishlistSubject.value.length;
  }

  /**
   * Clear entire wishlist
   */
  clearWishlist(): void {
    this.saveWishlist([]);
  }
}
