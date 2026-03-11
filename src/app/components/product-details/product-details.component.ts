import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { ToastService } from '../../services/toast.service';
import { Product } from '../../models/product.models';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  product: Product | null = null;
  quantity = 1;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    public wishlistService: WishlistService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadProduct(id);
    }
  }

  loadProduct(id: number): void {
    this.isLoading = true;
    this.productService.getById(id).subscribe({
      next: (product) => {
        this.product = product;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.router.navigate(['/products']);
      }
    });
  }

  addToCart(): void {
    if (this.product && this.quantity > 0) {
      this.cartService.addToCart({ productId: this.product.id, quantity: this.quantity }).subscribe({
        next: () => {
          this.toastService.success(`${this.quantity} x ${this.product?.name} added to cart!`);
        },
        error: () => {
          this.toastService.error('Please login to add items to cart');
        }
      });
    }
  }

  incrementQuantity(): void {
    if (this.quantity < (this.product?.stock || 0)) {
      this.quantity++;
    }
  }

  decrementQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  toggleWatchlist(product: Product): void {
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
}
