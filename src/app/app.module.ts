import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularMaterialModule } from './core/angular-material/angular-material.module';
import { CookieService } from 'ngx-cookie-service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MailCreateComponent } from './mails/mail-create/mail-create.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { HeaderComponent } from './navigation/header/header.component';
import { NavigationListComponent } from './navigation/navigation-list/navigation-list.component';
import { SignupPageComponent } from './layout/signup-page/signup-page.component';
import { DashboardPageComponent } from './layout/dashboard-page/dashboard-page.component';
import { MailListComponent } from './mails/mail-list/mail-list.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { HeaderPublicComponent } from './navigation/header-public/header-public.component';
import { AddressSelectComponent } from './addresses/address-select/address-select.component';
import { AddressCardComponent } from './addresses/address-card/address-card.component';
import { AddressCreateComponent } from './addresses/address-create/address-create.component';
import { SignUpConfirmationComponent } from './auth/sign-up-confirmation/sign-up-confirmation.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { DebounceClickDirective } from './core/directives/debounce-click.directive';
import { ImageLoadingSpinnerComponent } from './ui/image-loading-spinner/image-loading-spinner.component';

@NgModule({
  declarations: [
    AppComponent,
    MailListComponent,
    UserListComponent,
    MailCreateComponent,
    SignUpComponent,
    HeaderComponent,
    NavigationListComponent,
    SignupPageComponent,
    DashboardPageComponent,
    HeaderPublicComponent,
    AddressSelectComponent,
    AddressCardComponent,
    AddressCreateComponent,
    SignUpConfirmationComponent,
    SignInComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    DebounceClickDirective,
    ImageLoadingSpinnerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
    FlexLayoutModule
  ],
  providers: [
    CookieService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
