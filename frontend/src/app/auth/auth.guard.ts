import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Store } from '@ngxs/store';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private store: Store) {}
  canActivate() {
    const token = this.store.selectSnapshot(state => state.auth.token);
    return token.length;
  }
}
