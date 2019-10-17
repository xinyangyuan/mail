import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MailStatus } from './models/mail-status.model';

import { DashboardLayoutComponent } from '../layout/dashboard-layout/dashboard-layout.component';
import { MailListPageComponent } from './pages/mail-list-page/mail-list-page.component';
import { MailCreatePageComponent } from './pages/mail-create-page/mail-create-page.component';
import { MailEditPageComponent } from './pages/mail-edit-page/mail-edit-page.component';
import { AuthGuard } from '../core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'mails', component: MailListPageComponent },
      { path: 'stared', component: MailListPageComponent, data: { star: true } },
      { path: 'unread', component: MailListPageComponent, data: { read: false } },
      { path: 'scanning', component: MailListPageComponent, data: { status: MailStatus.SCANNING } },
      { path: 'scanned', component: MailListPageComponent, data: { status: MailStatus.SCANNED } },
      {
        path: 'skip-scanned',
        component: MailListPageComponent,
        data: { status: MailStatus.SCAN_REJECTED }
      },
      { path: 'create', component: MailCreatePageComponent },
      { path: 'edit', component: MailEditPageComponent },
      { path: 'upload-pdf', component: MailEditPageComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MailRoutingModule {}
