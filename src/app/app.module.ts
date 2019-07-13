import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularMaterialModule } from './angular-material/angular-material.module';

import { CookieService } from 'ngx-cookie-service';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { MailCreateComponent } from './mails/mail-create/mail-create.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { HeaderComponent } from './header/header.component';
import { SignUpUserComponent } from './auth/sign-up/sign-up-user/sign-up-user.component';
import { SignUpSenderComponent } from './auth/sign-up/sign-up-sender/sign-up-sender.component';
import { NavigationListComponent } from './navigation-list/navigation-list.component';

@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    MailCreateComponent,
    SignInComponent,
    SignUpComponent,
    HeaderComponent,
    SignUpUserComponent,
    SignUpSenderComponent,
    NavigationListComponent
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
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
