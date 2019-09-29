import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiModule } from '../ui/ui.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularMaterialModule } from '../core/angular-material/angular-material.module';

import { PasswordlessRoutingModule } from './passwordless-routing.module';
import { PasswordlessMailUpdateComponent } from './passwordless-mail-update/passwordless-mail-update.component';

@NgModule({
  declarations: [PasswordlessMailUpdateComponent],
  imports: [
    PasswordlessRoutingModule,
    CommonModule,
    UiModule,
    FlexLayoutModule,
    AngularMaterialModule
  ]
})
export class PasswordlessModule {}
