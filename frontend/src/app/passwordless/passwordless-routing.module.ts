import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainLayoutComponent } from '../layout/main-layout/main-layout.component';
import { PasswordlessMailUpdateComponent } from './passwordless-mail-update/passwordless-mail-update.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [{ path: 'update-mail/:id/:emailToken', component: PasswordlessMailUpdateComponent }]
  }
];

@NgModule({ imports: [RouterModule.forRoot(routes)], exports: [RouterModule] })
export class PasswordlessRoutingModule {}
