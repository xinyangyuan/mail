import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { CardInlineComponent } from './card-inline/card-inline.component';
import { ImageLoadingSpinnerComponent } from './image-loading-spinner/image-loading-spinner.component';
import { LoadingSpinnerCubeComponent } from './loading-spinner-cube/loading-spinner-cube.component';

@NgModule({
  declarations: [CardInlineComponent, ImageLoadingSpinnerComponent, LoadingSpinnerCubeComponent],
  imports: [CommonModule, FlexLayoutModule],
  exports: [CardInlineComponent, ImageLoadingSpinnerComponent, LoadingSpinnerCubeComponent]
})
export class UiModule {}
