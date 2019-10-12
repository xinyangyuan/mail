import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { MailNavigationMenuComponent } from './mail/components/mail-navigation-menu/mail-navigation-menu.component';
import { DashboardLayoutComponent } from './layout/dashboard-layout/dashboard-layout.component';

const routes: Routes = [{ path: '', redirectTo: 'signin', pathMatch: 'full' }];

// const routes: Routes = [
//   {
//     path: '',
//     component: DashboardPageComponent,
//     children: [{ path: '', component: MailListComponent }]
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
