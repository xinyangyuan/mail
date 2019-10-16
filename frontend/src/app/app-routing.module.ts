import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardLayoutComponent } from './layout/dashboard-layout/dashboard-layout.component';
import { MailGroupActionComponent } from './mail/components/mail-group-action/mail-group-action.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

const routes: Routes = [{ path: '', redirectTo: 'signin', pathMatch: 'full' }];

// const routes: Routes = [
//   {
//     path: '',
//     component: MainLayoutComponent,
//     children: [{ path: '', component: MailGroupActionComponent }]
//   }
// ];

// const routes: Routes = [
//   {
//     path: '',
//     component: DashboardLayoutComponent
//     // children: [{ path: '', component: MailNavigationMenuComponent }]
//   }
// ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
