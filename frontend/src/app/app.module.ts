import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxsModule } from '@ngxs/store';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';

import { AppRoutingModule } from './app-routing.module';
import { AuthModule } from './auth/auth.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { PaymentModule } from './payment/payment.module';
import { PlanModule } from './plans/plan.module';
import { AddressModule } from './addresses/address.module';
import { MailModule } from './mails/mail.module';
import { PasswordlessModule } from './passwordless/passwordless.module';

import { ngxsConfig } from './store/ngxs.config';
import { AuthState } from './auth/store/auth.state';

import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';

import { AppComponent } from './app.component';
import { HeaderComponent } from './navigation/header/header.component';
import { NavigationListComponent } from './navigation/navigation-list/navigation-list.component';
import { DashboardPageComponent } from './layout/dashboard-page/dashboard-page.component';
import { HeaderPublicComponent } from './navigation/header-public/header-public.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { CoreModule } from './core/core.module';

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
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    AuthModule,
    PaymentModule,
    PlanModule,
    SubscriptionModule,
    AddressModule,
    MailModule,
    PasswordlessModule,
    CoreModule,
    NgxsModule.forRoot([AuthState], ngxsConfig),
    NgxsLoggerPluginModule.forRoot()
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
