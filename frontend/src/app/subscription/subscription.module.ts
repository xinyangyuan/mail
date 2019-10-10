import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxsModule } from '@ngxs/store';
import { CoreModule } from '../core/core.module';
import { SubscriptionRoutingModule } from './subscription-routing.module';

import { PaymentModule } from '../payment/payment.module';
import { PlanModule } from '../plans/plan.module';
import { AddressModule } from '../addresses/address.module';

import { SubscriptionState } from './store/subscription.state';
import { NewSubscriptionCheckoutComponent } from './new-subscription-checkout/new-subscription-checkout.component';
import { NewSubscriptionComponent } from './new-subscription/new-subscription.component';
import { NewSubscriptionSelectAddressComponent } from './new-subscription-select-address/new-subscription-select-address.component';
import { NewSubscriptionSelectPlanComponent } from './new-subscription-select-plan/new-subscription-select-plan.component';

@NgModule({
  declarations: [
    NewSubscriptionComponent,
    NewSubscriptionSelectAddressComponent,
    NewSubscriptionSelectPlanComponent,
    NewSubscriptionCheckoutComponent
  ],
  imports: [
    PaymentModule,
    PlanModule,
    AddressModule,
    ReactiveFormsModule,
    SubscriptionRoutingModule,
    CoreModule,
    NgxsModule.forFeature([SubscriptionState])
  ],
  entryComponents: [
    NewSubscriptionSelectPlanComponent,
    NewSubscriptionSelectAddressComponent,
    NewSubscriptionCheckoutComponent
  ]
})
export class SubscriptionModule {}
