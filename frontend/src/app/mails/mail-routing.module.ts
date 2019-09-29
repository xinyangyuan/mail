import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardPageComponent } from '../layout/dashboard-page/dashboard-page.component';
import { MailListComponent } from './mail-list/mail-list.component';
import { MailStatus } from './mail.model';
import { MailCreateComponent } from './mail-create/mail-create.component';
import { MailUpdateComponent } from './mail-update/mail-update.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardPageComponent,
    children: [
      { path: 'mails', component: MailListComponent },
      { path: 'stared', component: MailListComponent, data: { star: true } },
      { path: 'unread', component: MailListComponent, data: { read: false } },
      { path: 'scanning', component: MailListComponent, data: { status: MailStatus.SCANNING } },
      { path: 'scanned', component: MailListComponent, data: { status: MailStatus.SCANNED } },
      {
        path: 'skip-scanned',
        component: MailListComponent,
        data: { status: MailStatus.SCAN_REJECTED }
      },
      { path: 'create', component: MailCreateComponent },
      { path: 'edit', component: MailUpdateComponent },
      { path: 'upload-pdf', component: MailUpdateComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MailRoutingModule {}
