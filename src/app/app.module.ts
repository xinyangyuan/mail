import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularMaterialModule } from './core/angular-material/angular-material.module';
import { CookieService } from 'ngx-cookie-service';
import { NgxsModule } from '@ngxs/store';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { UiSwitchModule } from 'ngx-ui-switch';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { MailCreateComponent } from './mails/mail-create/mail-create.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { HeaderComponent } from './navigation/header/header.component';
import { NavigationListComponent } from './navigation/navigation-list/navigation-list.component';
import { DashboardPageComponent } from './layout/dashboard-page/dashboard-page.component';
import { MailListComponent } from './mails/mail-list/mail-list.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { HeaderPublicComponent } from './navigation/header-public/header-public.component';
import { AddressCardComponent } from './addresses/address-card/address-card.component';
import { AddressCreateComponent } from './addresses/address-create/address-create.component';
import { SignUpConfirmationComponent } from './auth/sign-up-confirmation/sign-up-confirmation.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { DebounceClickDirective } from './core/directives/debounce-click.directive';
import { ImageLoadingSpinnerComponent } from './ui/image-loading-spinner/image-loading-spinner.component';
import { MailState } from './mails/store/mail.state';
import { ngxsConfig } from './store/ngxs.config';
import { MailExpansionListItemComponent } from './mails/mail-expansion-list-item/mail-expansion-list-item.component';
import { MailCardListItemComponent } from './mails/mail-card-list-item/mail-card-list-item.component';
import { MailCardGridItemComponent } from './mails/mail-card-grid-item/mail-card-grid-item.component';
import { AuthState } from './auth/store/auth.state';
import { MailUpdateComponent } from './mails/mail-update/mail-update.component';
import { MailItemActionBarComponent } from './mails/mail-item-action-bar/mail-item-action-bar.component';
import { PasswordlessMailUpdateComponent } from './passwordless/passwordless-mail-update/passwordless-mail-update.component';
import { PasswordlessSate } from './passwordless/store/passwordless.state';
import { PaymentRequestComponent } from './payment/payment-request/payment-request.component';
import { PaymentCheckoutComponent } from './payment/payment-checkout/payment-checkout.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { AddressState } from './addresses/store/address.state';
import { AddressSelectFormComponent } from './addresses/address-select-form/address-select-form.component';
import { PlanCardComponent } from './plans/plan-card/plan-card.component';
import { PlanState } from './plans/store/plan.state';
import { LoadingSpinnerCubeComponent } from './ui/loading-spinner-cube/loading-spinner-cube.component';
import { NewSubscriptionCheckoutComponent } from './subscription/new-subscription-checkout/new-subscription-checkout.component';
import { NewSubscriptionSelectPlanComponent } from './subscription/new-subscription-select-plan/new-subscription-select-plan.component';
import { NewSubscriptionSelectAddressComponent } from './subscription/new-subscription-select-address/new-subscription-select-address.component';
import { PlanListComponent } from './plans/plan-list/plan-list.component';
import { NewSubscriptionComponent } from './subscription/new-subscription/new-subscription.component';
import { CardInlineComponent } from './ui/card-inline/card-inline.component';
import { PaymentModalComponent } from './payment/payment-modal/payment-modal.component';
import { PaymentState } from './payment/state/payment.state';

@NgModule({
  declarations: [
    AppComponent,
    MailListComponent,
    UserListComponent,
    MailCreateComponent,
    SignUpComponent,
    HeaderComponent,
    NavigationListComponent,
    DashboardPageComponent,
    HeaderPublicComponent,
    AddressCardComponent,
    AddressCreateComponent,
    SignUpConfirmationComponent,
    SignInComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    DebounceClickDirective,
    ImageLoadingSpinnerComponent,
    MailExpansionListItemComponent,
    MailCardListItemComponent,
    MailCardGridItemComponent,
    MailUpdateComponent,
    MailItemActionBarComponent,
    PasswordlessMailUpdateComponent,
    PaymentRequestComponent,
    PaymentCheckoutComponent,
    MainLayoutComponent,
    AddressSelectFormComponent,
    PlanCardComponent,
    LoadingSpinnerCubeComponent,
    NewSubscriptionCheckoutComponent,
    NewSubscriptionSelectPlanComponent,
    NewSubscriptionSelectAddressComponent,
    PlanListComponent,
    NewSubscriptionComponent,
    CardInlineComponent,
    PaymentModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    UiSwitchModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FlexLayoutModule,
    NgxsModule.forRoot(
      [MailState, AuthState, PasswordlessSate, AddressState, PlanState, PaymentState],
      ngxsConfig
    ),
    NgxsLoggerPluginModule.forRoot()
  ],
  providers: [
    CookieService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  entryComponents: [
    NewSubscriptionSelectPlanComponent,
    NewSubscriptionSelectAddressComponent,
    NewSubscriptionCheckoutComponent,
    PaymentModalComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
