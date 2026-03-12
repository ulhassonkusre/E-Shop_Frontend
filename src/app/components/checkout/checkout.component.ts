import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { OrderService, ShippingInfo } from '../../services/order.service';
import { ToastService } from '../../services/toast.service';
import { Cart, CartItem } from '../../models/cart.models';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  cart: Cart | null = null;
  isLoading = true;
  isSubmitting = false;

  shippingForm: ShippingInfo = {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  };

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private toastService: ToastService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.isLoading = true;
    this.cartService.getCart().subscribe({
      next: (cart) => {
        this.cart = cart;
        this.isLoading = false;
        if (cart.items.length === 0) {
          this.toastService.info('Your cart is empty');
          this.router.navigate(['/products']);
        }
      },
      error: () => {
        this.isLoading = false;
        this.toastService.error('Failed to load cart');
      }
    });
  }

  placeOrder(): void {
    if (!this.validateForm()) {
      this.toastService.error('Please fill in all required fields');
      return;
    }

    if (!this.cart || this.cart.items.length === 0) {
      this.toastService.error('Your cart is empty');
      return;
    }

    this.isSubmitting = true;

    // Create order via API
    this.orderService.createOrder(this.shippingForm).subscribe({
      next: (order) => {
        this.isSubmitting = false;
        // Clear cart after successful order
        this.cartService.clearCart().subscribe();
        this.toastService.success('Order placed successfully!');
        // Navigate to order success with order details
        this.router.navigate(['/order-success'], { queryParams: { orderId: order.id } });
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Order error:', err);
        console.error('Error details:', err.error);
        
        let errorMessage = 'Failed to place order. Please try again.';
        
        if (err.status === 400 && err.error) {
          // Handle validation errors
          if (typeof err.error === 'object') {
            const errors = Object.values(err.error).flat();
            errorMessage = errors.join(' ');
          } else if (typeof err.error === 'string') {
            errorMessage = err.error;
          } else if (err.error.message) {
            errorMessage = err.error.message;
          }
        }
        
        this.toastService.error(errorMessage);
      }
    });
  }

  validateForm(): boolean {
    return (
      this.shippingForm.fullName.trim() !== '' &&
      this.shippingForm.email.trim() !== '' &&
      this.shippingForm.phone.trim() !== '' &&
      this.shippingForm.address.trim() !== '' &&
      this.shippingForm.city.trim() !== '' &&
      this.shippingForm.state.trim() !== '' &&
      this.shippingForm.zipCode.trim() !== ''
    );
  }

  getTotal(): number {
    return this.cart?.totalAmount || 0;
  }
}
