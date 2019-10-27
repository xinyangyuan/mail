import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxsModule } from '@ngxs/store';
import { CoreModule } from '../core/core.module';
import { SubscriptionRoutingModule } from './subscription-routing.module';

import { PaymentModule } from '../payment/payment.module';
import { PlanModule } from '../plan/plan.module';
import { AddressModule } from '../address/address.module';

import { SubscriptionState } from './store/subscription.state';
import { NewSubscriptionCheckoutComponent } from './components/new-subscription-checkout/new-subscription-checkout.component';
import { NewSubscriptionComponent } from './components/new-subscription/new-subscription.component';
import { NewSubscriptionSelectAddressComponent } from './components/new-subscription-select-address/new-subscription-select-address.component';
import { NewSubscriptionSelectPlanComponent } from './components/new-subscription-select-plan/new-subscription-select-plan.component';

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
