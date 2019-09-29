import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularMaterialModule } from '../core/angular-material/angular-material.module';
import { ReactiveFormsModule } from '@angular/forms';

import { UiModule } from '../ui/ui.module';
import { PlanCardComponent } from './plan-card/plan-card.component';
import { PlanListComponent } from './plan-list/plan-list.component';

@NgModule({
  declarations: [PlanCardComponent, PlanListComponent],
  imports: [CommonModule, ReactiveFormsModule, UiModule, FlexLayoutModule, AngularMaterialModule],
  exports: [PlanListComponent]
})
export class PlanModule {}
