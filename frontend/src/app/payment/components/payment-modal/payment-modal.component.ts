import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';

import { PaymentStateModel } from '../../store/payment.state';
import { skipWhile } from 'rxjs/operators';

@Component({
  selector: 'app-payment-modal',
  templateUrl: './payment-modal.component.html',
  styleUrls: ['./payment-modal.component.css']
})
export class PaymentModalComponent implements OnInit {
  // Attributes:
  closeCountDown = 3;
  @Select(state => state.payment.paymentStatus) paymentStatus$: Observable<
    PaymentStateModel['paymentStatus']
  >;

  // Constructor:
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<PaymentModalComponent>,
    private dialog: MatDialog
  ) {}

  // Init Method:
  ngOnInit() {
    this.paymentStatus$.pipe(skipWhile(status => status !== 'pending')).subscribe(status => {
      switch (status) {
        case 'pending':
          this.dialogRef.disableClose = true;
          break;
        case 'requires_action':
          this.dialogRef.close(); // close dialog, the 3d secure modal will pop-up
          break;
        case 'error':
        case 'success':
          if (this.noPaymentDialog) {
            this.dialog.open(PaymentModalComponent); // open dialog, if none is opened
          }
          this.closeDialog();
      }
    });
  }

  // Method:
  closeDialog() {
    setTimeout(() => (this.closeCountDown -= 1), 1000); // update count-down
    setTimeout(() => this.dialogRef.close(), 3000); // close dialog
  }

  // Method:
  noPaymentDialog(): boolean {
    const paymentDialogs = this.dialog.openDialogs
      .map(dialog => dialog.componentInstance)
      .filter(dialogInstance => dialogInstance instanceof PaymentModalComponent);
    return paymentDialogs.length === 0;
  }
}
