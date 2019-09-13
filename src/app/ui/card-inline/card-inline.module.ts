import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardInlineComponent } from './card-inline.component';
import { CardInlineHeaderComponent } from './card-inline-header/card-inline-header.component';
import { CardInlineTailComponent } from './card-inline-tail/card-inline-tail.component';
import { CardInlineBodyComponent } from './card-inline-body/card-inline-body.component';

@NgModule({
  declarations: [
    CardInlineComponent,
    CardInlineHeaderComponent,
    CardInlineTailComponent,
    CardInlineBodyComponent
  ],
  imports: [CommonModule],
  exports: [
    CardInlineComponent,
    CardInlineHeaderComponent,
    CardInlineTailComponent,
    CardInlineBodyComponent
  ]
})
export class CardInlineModule {}
