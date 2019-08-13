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
import { MailState } from './mails/store/mail.state';
import { ngxsConfig } from './store/ngxs.config';
import { MailExpansionListItemComponent } from './mails/mail-expansion-list-item/mail-expansion-list-item.component';
import { MailCardListItemComponent } from './mails/mail-card-list-item/mail-card-list-item.component';
import { MailCardGridItemComponent } from './mails/mail-card-grid-item/mail-card-grid-item.component';
import { AuthState } from './auth/store/auth.state';
import { MailUpdateComponent } from './mails/mail-update/mail-update.component';
import { MailItemActionBarComponent } from './mails/mail-item-action-bar/mail-item-action-bar.component';

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
    ImageLoadingSpinnerComponent,
    MailExpansionListItemComponent,
    MailCardListItemComponent,
    MailCardGridItemComponent,
    MailUpdateComponent,
    MailItemActionBarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FlexLayoutModule,
    NgxsModule.forRoot([MailState, AuthState], ngxsConfig),
    NgxsLoggerPluginModule.forRoot()
  ],
  providers: [
    CookieService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
