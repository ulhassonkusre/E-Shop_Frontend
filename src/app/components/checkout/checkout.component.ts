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

  // Shipping form
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

    // Prepare order products
    const orderProducts = this.cart.items.map(item => ({
      name: item.productName,
      image: item.productImage,
      price: item.price,
      quantity: item.quantity
    }));

    // Create order
    const orderData = {
      total: this.cart.totalAmount,
      items: this.cart.totalItems,
      products: orderProducts,
      shippingInfo: { ...this.shippingForm }
    };

    // Save order to session storage
    this.orderService.addOrder(orderData).subscribe({
      next: (order) => {
        // Clear cart on backend
        this.cartService.clearCart().subscribe({
          next: () => {
            this.isSubmitting = false;
            this.toastService.success('Order placed successfully!');
            this.router.navigate(['/order-success']);
          },
          error: () => {
            this.isSubmitting = false;
            this.toastService.error('Order placed but failed to clear cart');
            this.router.navigate(['/order-success']);
          }
        });
      },
      error: (err) => {
        this.isSubmitting = false;
        this.toastService.error('Failed to place order');
        console.error('Order error:', err);
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
