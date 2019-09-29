import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiModule } from '../ui/ui.module';

import { PaymentRequestComponent } from './payment-request/payment-request.component';
import { PaymentModalComponent } from './payment-modal/payment-modal.component';
import { PaymentCheckoutComponent } from './payment-checkout/payment-checkout.component';

@NgModule({
  declarations: [PaymentRequestComponent, PaymentModalComponent, PaymentCheckoutComponent],
  imports: [CommonModule, UiModule],
  exports: [PaymentRequestComponent, PaymentCheckoutComponent],
  entryComponents: [PaymentModalComponent]
})
export class PaymentModule {}
