import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Actions, ofActionSuccessful } from '@ngxs/store';

import * as PaymentActions from './payment.action';
import { PaymentModalComponent } from '../payment-modal/payment-modal.component';

@Injectable()
export class PaymentEffect {
  // Attributes:
  private paymentDialog: MatDialogRef<PaymentModalComponent>;

  constructor(private dialog: MatDialog, private actions$: Actions) {
    // this.actions$
    //   .pipe(ofActionSuccessful(RouteNavigate))
    //   .subscribe(({ payload }) => this.router.navigate([payload]));
  }
}
