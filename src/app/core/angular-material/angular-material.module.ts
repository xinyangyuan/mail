import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatExpansionModule,
  MatIconModule,
  MatCardModule,
  MatInputModule,
  MatProgressBarModule,
  MatToolbarModule,
  MatSelectModule,
  MatOptionModule,
  MatTabsModule,
  MatMenuModule,
  MatSidenavModule,
  MatDividerModule,
  MatListModule,
  MatPaginatorModule,
  MatGridListModule,
  MatSnackBarModule,
  MatProgressSpinnerModule,
  MatRippleModule,
  MatCheckboxModule,
  MAT_SNACK_BAR_DEFAULT_OPTIONS
} from '@angular/material';
import { MatProgressButtonsModule } from 'mat-progress-buttons';

@NgModule({
  exports: [
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatProgressBarModule,
    MatToolbarModule,
    MatSelectModule,
    MatOptionModule,
    MatTabsModule,
    MatMenuModule,
    MatSidenavModule,
    MatDividerModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatGridListModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatRippleModule,
    MatCheckboxModule,
    MatProgressButtonsModule
  ],
  providers: [{ provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 1500 } }]
})
export class AngularMaterialModule {}
