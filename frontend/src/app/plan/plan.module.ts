import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxsModule } from '@ngxs/store';
import { CoreModule } from '../core/core.module';

import { PlanState } from './store/plan.state';
import { PlanCardComponent } from './components/plan-card/plan-card.component';
import { PlanListComponent } from './components/plan-list/plan-list.component';

@NgModule({
  declarations: [PlanCardComponent, PlanListComponent],
  imports: [ReactiveFormsModule, CoreModule, NgxsModule.forFeature([PlanState])],
  exports: [PlanListComponent]
})
export class PlanModule {}
