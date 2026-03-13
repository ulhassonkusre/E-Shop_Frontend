import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageCacheService {
  private cacheBuster = Date.now();
  private readonly CACHE_BUSTER_KEY = 'imageCacheBuster';

  constructor() {
    // Load cache buster from localStorage if exists
    const stored = localStorage.getItem(this.CACHE_BUSTER_KEY);
    if (stored) {
      this.cacheBuster = parseInt(stored, 10);
    } else {
      // Initialize with current time if not exists
      this.clearCache();
    }
  }

  /**
   * Add cache buster to image URL to force browser to fetch fresh image
   * @param imageUrl The original image URL
   * @returns Image URL with cache buster timestamp
   */
  addCacheBuster(imageUrl: string): string {
    if (!imageUrl) {
      return imageUrl;
    }

    // Remove any existing cache buster first
    imageUrl = imageUrl.replace(/[?&]_t=\d+$/, '');

    // If URL already has query parameters, append with &
    const separator = imageUrl.includes('?') ? '&' : '?';
    return `${imageUrl}${separator}_t=${this.cacheBuster}`;
  }

  /**
   * Clear image cache by updating the cache buster timestamp
   * This will force all images to be reloaded
   */
  clearCache(): void {
    this.cacheBuster = Date.now();
    localStorage.setItem(this.CACHE_BUSTER_KEY, this.cacheBuster.toString());
    console.log('[ImageCacheService] Cache cleared, new buster:', this.cacheBuster);
  }

  /**
   * Get current cache buster value
   */
  getCacheBuster(): number {
    return this.cacheBuster;
  }

  /**
   * Force refresh all images by clearing cache and reloading
   */
  forceRefresh(): void {
    this.clearCache();
    // Force reload by adding a small delay to ensure all components pick up the new timestamp
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }
}
