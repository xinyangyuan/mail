import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngxs/store';

import * as AccountActions from '../../account/store/account.acion';

@Injectable({
  providedIn: 'root'
})
export class AccountResolver implements Resolve<any> {
  constructor(private store: Store) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.store.dispatch(new AccountActions.GetAccountInfo());
  }
}
