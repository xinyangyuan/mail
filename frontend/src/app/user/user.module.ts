import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CoreModule } from '../core/core.module';

import { UserListComponent } from './user-list/user-list.component';

@NgModule({
  imports: [RouterModule, CoreModule],
  exports: [],
  declarations: [UserListComponent],
  providers: []
})
export class NameModule {}
