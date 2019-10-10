import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { UiSwitchModule } from 'ngx-ui-switch';

import { UiModule } from './ui/ui.module';
import { AngularMaterialModule } from './angular-material/angular-material.module';

import { DebounceClickDirective } from './directives/debounce-click.directive';

@NgModule({
  declarations: [DebounceClickDirective],
  exports: [
    CommonModule,
    FlexLayoutModule,
    UiSwitchModule,
    UiModule,
    AngularMaterialModule,
    DebounceClickDirective
  ]
})
export class CoreModule {}
