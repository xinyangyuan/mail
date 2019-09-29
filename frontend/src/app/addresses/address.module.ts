import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularMaterialModule } from '../core/angular-material/angular-material.module';
import { AddressRoutingModule } from './address-routing.module';

import { AddressCardComponent } from './address-card/address-card.component';
import { AddressCreateComponent } from './address-create/address-create.component';
import { AddressSelectFormComponent } from './address-select-form/address-select-form.component';

@NgModule({
  declarations: [AddressCardComponent, AddressCreateComponent, AddressSelectFormComponent],
  imports: [
    AddressRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    AngularMaterialModule
  ],
  exports: [AddressSelectFormComponent]
})
export class AddressModule {}
