import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product, CreateProductDto, UpdateProductDto } from '../models/product.models';
import { ImageCacheService } from './image-cache.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:5000/api/products';

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

  getAll(searchTerm?: string): Observable<Product[]> {
    const url = searchTerm
      ? `${this.apiUrl}?search=${encodeURIComponent(searchTerm)}`
      : this.apiUrl;
    return this.http.get<Product[]>(url).pipe(
      map(products => products.map(product => ({
        ...product,
        imageUrl: this.imageCacheService.addCacheBuster(product.imageUrl)
      })))
    );
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
      map(product => ({
        ...product,
        imageUrl: this.imageCacheService.addCacheBuster(product.imageUrl)
      }))
    );
  }

  create(dto: CreateProductDto): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, dto, { headers: this.getHeaders() });
  }

  update(id: number, dto: UpdateProductDto): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, dto, { headers: this.getHeaders() });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
