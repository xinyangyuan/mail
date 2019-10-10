import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { CoreModule } from '../core/core.module';

import { PaymentState } from './state/payment.state';
import { PaymentRequestComponent } from './payment-request/payment-request.component';
import { PaymentModalComponent } from './payment-modal/payment-modal.component';
import { PaymentCheckoutComponent } from './payment-checkout/payment-checkout.component';

@NgModule({
  declarations: [PaymentRequestComponent, PaymentModalComponent, PaymentCheckoutComponent],
  imports: [CoreModule, NgxsModule.forFeature([PaymentState])],
  exports: [PaymentRequestComponent, PaymentCheckoutComponent],
  entryComponents: [PaymentModalComponent]
})
export class PaymentModule {}
