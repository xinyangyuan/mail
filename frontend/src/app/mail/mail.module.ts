import { NgModule } from '@angular/core';
import { CoreModule } from '../core/core.module';
import { MailRoutingModule } from './mail-routing.module';
import { NgxsModule } from '@ngxs/store';

import { MailState } from './store/mail.state';
import { MailListComponent } from './mail-list/mail-list.component';
import { MailCreateComponent } from './mail-create/mail-create.component';
import { MailExpansionListItemComponent } from './mail-expansion-list-item/mail-expansion-list-item.component';
import { MailCardGridItemComponent } from './mail-card-grid-item/mail-card-grid-item.component';
import { MailCardListItemComponent } from './mail-card-list-item/mail-card-list-item.component';
import { MailUpdateComponent } from './mail-update/mail-update.component';
import { MailItemActionBarComponent } from './mail-item-action-bar/mail-item-action-bar.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    MailListComponent,
    MailCreateComponent,
    MailExpansionListItemComponent,
    MailCardGridItemComponent,
    MailCardListItemComponent,
    MailUpdateComponent,
    MailItemActionBarComponent
  ],
  imports: [MailRoutingModule, ReactiveFormsModule, CoreModule, NgxsModule.forFeature([MailState])],
  exports: []
})
export class MailModule {}
