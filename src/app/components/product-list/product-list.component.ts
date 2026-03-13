import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { ToastService } from '../../services/toast.service';
import { Product } from '../../models/product.models';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchTerm = '';
  isLoading = true;
  selectedCategory = 'All';
  categories: string[] = ['All'];

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    public wishlistService: WishlistService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.cdr.detectChanges();

    this.productService.getAll().subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = products;
        this.categories = ['All', ...new Set(products.map(p => p.category))];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
        this.toastService.error('Failed to load products');
      }
    });
  }

  search(): void {
    if (this.searchTerm.trim()) {
      this.isLoading = true;
      this.cdr.detectChanges();

      this.productService.getAll(this.searchTerm).subscribe({
        next: (products) => {
          this.filteredProducts = products;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.filteredProducts = this.products;
    }
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    if (category === 'All') {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter(p => p.category === category);
    }
  }

  addToCart(product: Product): void {
    this.cartService.addToCart({ productId: product.id, quantity: 1 }).subscribe({
      next: () => {
        this.toastService.success(`${product.name} added to cart!`);
      },
      error: () => {
        this.toastService.error('Please login to add items to cart');
      }
    });
  }

  toggleWatchlist(event: Event, product: Product): void {
    event.preventDefault();
    event.stopPropagation();

    const productName = product.name || 'Product';
    const wasInWishlist = this.wishlistService.isInWishlist(product.id);

    this.wishlistService.toggleWishlist(product).subscribe({
      next: (success) => {
        if (success) {
          if (!wasInWishlist) {
            this.toastService.success(`${productName} added to watchlist!`);
          } else {
            this.toastService.info(`${productName} removed from watchlist`);
          }
        }
      },
      error: () => {
        this.toastService.error('Failed to update watchlist');
      }
    });
  }

  handleImageError(event: any, product: Product): void {
    // Set a data URL for a simple gray placeholder
    event.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"%3E%3Crect fill="%23e0e0e0" width="300" height="200"/%3E%3Ctext fill="%23999" font-family="Arial" font-size="16" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
  }

  trackByProductId(index: number, product: Product): number {
    return product.id;
  }
}
