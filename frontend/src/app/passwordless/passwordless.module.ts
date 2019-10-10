import { NgModule } from '@angular/core';
import { CoreModule } from '../core/core.module';
import { NgxsModule } from '@ngxs/store';

import { PasswordlessSate } from './store/passwordless.state';
import { PasswordlessRoutingModule } from './passwordless-routing.module';
import { PasswordlessMailUpdateComponent } from './passwordless-mail-update/passwordless-mail-update.component';

@NgModule({
  declarations: [PasswordlessMailUpdateComponent],
  imports: [PasswordlessRoutingModule, CoreModule, NgxsModule.forFeature([PasswordlessSate])]
})
export class PasswordlessModule {}
