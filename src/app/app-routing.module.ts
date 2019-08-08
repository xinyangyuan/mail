import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignupPageComponent } from './layout/signup-page/signup-page.component';
import { DashboardPageComponent } from './layout/dashboard-page/dashboard-page.component';

import { MailListComponent } from './mails/mail-list/mail-list.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { MailCreateComponent } from './mails/mail-create/mail-create.component';
import { AddressCreateComponent } from './addresses/address-create/address-create.component';
import { AddressSelectComponent } from './addresses/address-select/address-select.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { SignUpConfirmationComponent } from './auth/sign-up-confirmation/sign-up-confirmation.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';

const routes: Routes = [
  {
    path: '',
    component: SignupPageComponent,
    children: [
      { path: '', redirectTo: 'signin', pathMatch: 'full' },
      { path: 'signin', component: SignInComponent },
      { path: 'signup', component: SignUpComponent },
      { path: 'confirmation/:accountType/:emailToken', component: SignUpConfirmationComponent },
      { path: 'newAddress', component: AddressCreateComponent },
      { path: 'addAddress', component: AddressSelectComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'reset-password/:emailToken', component: ResetPasswordComponent }
    ]
  },
  {
    path: '',
    component: DashboardPageComponent,
    children: [
      { path: 'mails', component: MailListComponent }, // MailListComponent
      { path: 'stared', component: MailListComponent, data: { starFlag: true } },
      { path: 'unread', component: MailListComponent, data: { readFlag: false } },
      { path: 'users', component: UserListComponent },
      { path: 'create', component: MailCreateComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
