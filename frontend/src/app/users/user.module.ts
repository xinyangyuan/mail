import { NgModule } from '@angular/core';

import { UserListComponent } from './user-list/user-list.component';
import { AngularMaterialModule } from '../core/angular-material/angular-material.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [CommonModule, RouterModule, AngularMaterialModule],
  exports: [],
  declarations: [UserListComponent],
  providers: []
})
export class NameModule {}
