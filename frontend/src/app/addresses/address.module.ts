import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxsModule } from '@ngxs/store';
import { AddressRoutingModule } from './address-routing.module';
import { CoreModule } from '../core/core.module';

import { AddressState } from './store/address.state';
import { AddressCardComponent } from './address-card/address-card.component';
import { AddressCreateComponent } from './address-create/address-create.component';
import { AddressSelectFormComponent } from './address-select-form/address-select-form.component';

@NgModule({
  declarations: [AddressCardComponent, AddressCreateComponent, AddressSelectFormComponent],
  imports: [
    AddressRoutingModule,
    ReactiveFormsModule,
    CoreModule,
    NgxsModule.forFeature([AddressState])
  ],
  exports: [AddressSelectFormComponent]
})
export class AddressModule {}
