import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../core/angular-material/angular-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { UiSwitchModule } from 'ngx-ui-switch';

import { SubscriptionRoutingModule } from './subscription-routing.module';
import { PaymentModule } from '../payment/payment.module';
import { UiModule } from '../ui/ui.module';
import { PlanModule } from '../plans/plan.module';
import { AddressModule } from '../addresses/address.module';

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
    CommonModule,
    PaymentModule,
    PlanModule,
    AddressModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    UiSwitchModule,
    UiModule,
    AngularMaterialModule,
    SubscriptionRoutingModule
  ],
  entryComponents: [
    NewSubscriptionSelectPlanComponent,
    NewSubscriptionSelectAddressComponent,
    NewSubscriptionCheckoutComponent
  ]
})
export class SubscriptionModule {}
