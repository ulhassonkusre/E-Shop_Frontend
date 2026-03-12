import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    }
    // Store the attempted URL for redirecting after login
    const returnUrl = route.url.join('/');
    this.router.navigate(['/login'], { queryParams: { returnUrl } });
    return false;
  }
}
