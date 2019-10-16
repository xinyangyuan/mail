import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Actions, ofActionDispatched } from '@ngxs/store';

import * as PaymentActions from './payment.action';
import { PaymentModalComponent } from '../components/payment-modal/payment-modal.component';

@Injectable({
  providedIn: 'root'
})
export class PaymentEffect {
  // Attributes:
  private paymentDialog: MatDialogRef<PaymentModalComponent>;

  constructor(private dialog: MatDialog, private actions$: Actions) {
    /*
      Open Payment:
    */

    this.actions$.pipe(ofActionDispatched(PaymentActions.OpenPayment)).subscribe(action => {
      console.log(action);
      console.log('hello');
    });

    // this.actions$
    //   .pipe(ofActionSuccessful(RouteNavigate))
    //   .subscribe(({ payload }) => this.router.navigate([payload]));
  }
}
