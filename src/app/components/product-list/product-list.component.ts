import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
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
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getAll().subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = products;
        this.categories = ['All', ...new Set(products.map(p => p.category))];
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  search(): void {
    if (this.searchTerm.trim()) {
      this.productService.getAll(this.searchTerm).subscribe({
        next: (products) => {
          this.filteredProducts = products;
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
}
