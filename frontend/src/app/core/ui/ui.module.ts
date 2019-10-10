import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { CardInlineComponent } from './card-inline/card-inline.component';
import { ImageLoadingSpinnerComponent } from './image-loading-spinner/image-loading-spinner.component';
import { LoadingSpinnerCubeComponent } from './loading-spinner-cube/loading-spinner-cube.component';

@NgModule({
  imports: [CommonModule, FlexLayoutModule],
  declarations: [CardInlineComponent, ImageLoadingSpinnerComponent, LoadingSpinnerCubeComponent],
  exports: [CardInlineComponent, ImageLoadingSpinnerComponent, LoadingSpinnerCubeComponent]
})
export class UiModule {}
