import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatExpansionModule,
  MatIconModule,
  MatCardModule,
  MatInputModule,
  MatProgressBarModule,
 } from '@angular/material';

@NgModule({
  exports: [
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatProgressBarModule,
  ]
})
export class AngularMaterialModule {}
