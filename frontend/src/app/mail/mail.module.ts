import { NgModule } from '@angular/core';
import { CoreModule } from '../core/core.module';
import { MailRoutingModule } from './mail-routing.module';
import { NgxsModule } from '@ngxs/store';

import { MailState } from './store/mail.state';
import { MailListComponent } from './components/mail-list/mail-list.component';
import { MailCreateComponent } from './components/mail-create/mail-create.component';
import { MailExpansionListItemComponent } from './components/mail-expansion-list-item/mail-expansion-list-item.component';
import { MailCardGridItemComponent } from './components/mail-card-grid-item/mail-card-grid-item.component';
import { MailCardListItemComponent } from './components/mail-card-list-item/mail-card-list-item.component';
import { MailUpdateComponent } from './components/mail-update/mail-update.component';
import { MailItemActionBarComponent } from './components/mail-item-action-bar/mail-item-action-bar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MailNavigationMenuComponent } from './components/mail-navigation-menu/mail-navigation-menu.component';
import { MailListPageComponent } from './pages/mail-list-page/mail-list-page.component';
import { MailCreatePageComponent } from './pages/mail-create-page/mail-create-page.component';
import { MailEditPageComponent } from './pages/mail-edit-page/mail-edit-page.component';
import { MailNavigationComponent } from './components/mail-navigation/mail-navigation.component';
import { MailGroupActionComponent } from './components/mail-group-action/mail-group-action.component';

@NgModule({
  declarations: [
    MailListComponent,
    MailCreateComponent,
    MailExpansionListItemComponent,
    MailCardGridItemComponent,
    MailCardListItemComponent,
    MailUpdateComponent,
    MailItemActionBarComponent,
    MailNavigationMenuComponent,
    MailListPageComponent,
    MailCreatePageComponent,
    MailEditPageComponent,
    MailNavigationComponent,
    MailGroupActionComponent
  ],
  imports: [MailRoutingModule, ReactiveFormsModule, CoreModule, NgxsModule.forFeature([MailState])],
  exports: []
})
export class MailModule {}
