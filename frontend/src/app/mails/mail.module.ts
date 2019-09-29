import { NgModule } from '@angular/core';
import { AngularMaterialModule } from '../core/angular-material/angular-material.module';

import { DebounceClickDirective } from '../core/directives/debounce-click.directive';

import { MailListComponent } from './mail-list/mail-list.component';
import { MailCreateComponent } from './mail-create/mail-create.component';
import { MailExpansionListItemComponent } from './mail-expansion-list-item/mail-expansion-list-item.component';
import { MailCardGridItemComponent } from './mail-card-grid-item/mail-card-grid-item.component';
import { MailCardListItemComponent } from './mail-card-list-item/mail-card-list-item.component';
import { MailUpdateComponent } from './mail-update/mail-update.component';
import { MailItemActionBarComponent } from './mail-item-action-bar/mail-item-action-bar.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { UiModule } from '../ui/ui.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MailRoutingModule } from './mail-routing.module';

@NgModule({
  declarations: [
    DebounceClickDirective,
    MailListComponent,
    MailCreateComponent,
    MailExpansionListItemComponent,
    MailCardGridItemComponent,
    MailCardListItemComponent,
    MailUpdateComponent,
    MailItemActionBarComponent
  ],
  imports: [
    MailRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    UiModule,
    FlexLayoutModule,
    AngularMaterialModule
  ],
  exports: []
})
export class MailModule {}
