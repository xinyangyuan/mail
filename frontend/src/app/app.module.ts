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

import { AppRoutingModule } from './app-routing.module';
import { AuthModule } from './auth/auth.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { UiModule } from './ui/ui.module';
import { PaymentModule } from './payment/payment.module';
import { PlanModule } from './plans/plan.module';
import { AddressModule } from './addresses/address.module';
import { MailModule } from './mails/mail.module';
import { PasswordlessModule } from './passwordless/passwordless.module';

import { ngxsConfig } from './store/ngxs.config';
import { AuthState } from './auth/store/auth.state';
import { MailState } from './mails/store/mail.state';
import { PasswordlessSate } from './passwordless/store/passwordless.state';
import { AddressState } from './addresses/store/address.state';
import { PlanState } from './plans/store/plan.state';
import { PaymentState } from './payment/state/payment.state';

import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';

import { AppComponent } from './app.component';
import { HeaderComponent } from './navigation/header/header.component';
import { NavigationListComponent } from './navigation/navigation-list/navigation-list.component';
import { DashboardPageComponent } from './layout/dashboard-page/dashboard-page.component';
import { HeaderPublicComponent } from './navigation/header-public/header-public.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NavigationListComponent,
    DashboardPageComponent,
    HeaderPublicComponent,
    MainLayoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,

    AuthModule,
    PaymentModule,
    PlanModule,
    SubscriptionModule,
    UiModule,
    AddressModule,
    MailModule,
    PasswordlessModule,

    BrowserAnimationsModule,
    AngularMaterialModule,
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
  entryComponents: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
