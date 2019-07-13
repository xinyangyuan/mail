import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MailListComponent } from './mails/mail-list/mail-list.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { MailCreateComponent } from './mails/mail-create/mail-create.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/signin',
    pathMatch: 'full'
  },
  {
    path: 'mails',
    component: MailListComponent
  },
  {
    path: 'users',
    component: UserListComponent
  },
  {
    path: 'create',
    component: MailCreateComponent
  },
  {
    path: 'signup',
    component: SignUpComponent
  },
  {
    path: 'signin',
    component: SignInComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
export const routingComponents = [MailListComponent, UserListComponent];
