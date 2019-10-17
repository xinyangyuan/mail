import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import * as jwtDecode from 'jwt-decode';

import { AuthService } from 'src/app/auth/auth.service';
import * as AuthActions from '../../auth/store/auth.action';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private store: Store, private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // case 1: refresh token request
    if (req.url.includes('refresh_token')) {
      return next.handle(req);
    }

    // case 2:
    try {
      const { exp } = jwtDecode(this.store.selectSnapshot(state => state.auth.token));
      if (Date.now() < exp * 1000) {
        return next.handle(this.generateAuthRequest(req));
      }
    } catch {
      return next.handle(req);
    }

    // case 3:
    return this.store.dispatch(new AuthActions.RefreshToken()).pipe(
      mergeMap(() => {
        return next.handle(this.generateAuthRequest(req));
      })
    );
  }

  private generateAuthRequest(req: HttpRequest<any>) {
    const authToken = this.store.selectSnapshot(state => state.auth.token);
    return req.clone({ setHeaders: { Authorization: 'Bearer ' + authToken } });
  }
}
