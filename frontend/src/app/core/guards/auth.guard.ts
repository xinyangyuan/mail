import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { map } from 'rxjs/operators';

import { AuthState } from 'src/app/auth/store/auth.state';
import * as AuthActions from '../../auth/store/auth.action';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  // Constructor:
  constructor(private store: Store, private router: Router) {}

  // Method:
  canActivate(): boolean | Observable<boolean> {
    // check store:
    let isAuthenticated = this.store.selectSnapshot(AuthState.isAuthenticated);

    // try refresh token:
    if (isAuthenticated) {
      return true; // all good
    } else {
      return this.store.dispatch(new AuthActions.RefreshToken()).pipe(
        map(() => {
          isAuthenticated = this.store.selectSnapshot(AuthState.isAuthenticated);
          if (isAuthenticated) {
            return true;
          } else {
            this.router.navigate(['']);
            return false;
          }
        })
      );
    }
  }
}
