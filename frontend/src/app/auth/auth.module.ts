import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing.module';
import { CoreModule } from '../core/core.module';

import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignUpConfirmationComponent } from './sign-up-confirmation/sign-up-confirmation.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

@NgModule({
  declarations: [
    SignInComponent,
    SignUpComponent,
    SignUpConfirmationComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent
  ],
  imports: [CommonModule, ReactiveFormsModule, AuthRoutingModule, CoreModule]
})
export class AuthModule {}
