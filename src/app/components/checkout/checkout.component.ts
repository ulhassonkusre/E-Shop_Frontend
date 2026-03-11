import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
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

  // Shipping form
  shippingForm = {
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

    this.isSubmitting = true;

    // Simulate order placement (no payment gateway)
    setTimeout(() => {
      this.cartService.clearCart().subscribe({
        next: () => {
          this.isSubmitting = false;
          this.toastService.success('Order placed successfully!');
          this.router.navigate(['/order-success']);
        },
        error: () => {
          this.isSubmitting = false;
          this.toastService.error('Failed to place order');
        }
      });
    }, 1500);
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
