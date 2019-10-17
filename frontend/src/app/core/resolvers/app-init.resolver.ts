import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngxs/store';
import * as AuthActions from '../../auth/store/auth.action';

@Injectable({
  providedIn: 'root'
})
export class AppInitResolver implements Resolve<any> {
  // Construtor:
  constructor(private store: Store) {}

  // Resolve Method:
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.store.dispatch(new AuthActions.AutoSignIn());
  }
}
