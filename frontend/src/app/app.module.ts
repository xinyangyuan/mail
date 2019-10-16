import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxsModule } from '@ngxs/store';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';

import { CoreModule } from './core/core.module';
import { AppRoutingModule } from './app-routing.module';
import { AuthModule } from './auth/auth.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { PaymentModule } from './payment/payment.module';
import { PlanModule } from './plan/plan.module';
import { AddressModule } from './address/address.module';
import { MailModule } from './mail/mail.module';
import { PasswordlessModule } from './passwordless/passwordless.module';

import { ngxsConfig } from './store/ngxs.config';
import { AuthState } from './auth/store/auth.state';
import { AccountState } from './account/store/account.state';

import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';

import { AppComponent } from './app.component';
import { HeaderComponent } from './navigation/header/header.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { HeaderNewComponent } from './navigation/header-new/header-new.component';
import { DashboardLayoutComponent } from './layout/dashboard-layout/dashboard-layout.component';
import { AccountModule } from './account/account.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HeaderNewComponent,
    MainLayoutComponent,
    DashboardLayoutComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    AuthModule,
    AccountModule,
    PaymentModule,
    PlanModule,
    SubscriptionModule,
    AddressModule,
    MailModule,
    PasswordlessModule,
    CoreModule,
    NgxsModule.forRoot([AuthState, AccountState], ngxsConfig),
    NgxsLoggerPluginModule.forRoot()
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
