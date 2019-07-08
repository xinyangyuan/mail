import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';

import { AuthService } from '../auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Get the auth token from  authservice
    const authToken = this.authService.getAuthToken();

    // Clone the request and handel the cloned request with auth header
    const authRequest = req.clone({
      setHeaders: { Authorization: 'Bearer ' + authToken }
    });
    return next.handle(authRequest);
  }
}
