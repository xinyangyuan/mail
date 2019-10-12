import { NgModule } from '@angular/core';
import { MatProgressButtonsModule } from 'mat-progress-buttons';
import {
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
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
  MatAutocompleteModule,
  MatSlideToggleModule,
  MatDialogModule,
  MatTooltipModule
} from '@angular/material';

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
    MatProgressButtonsModule,
    MatAutocompleteModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatTooltipModule
  ],
  providers: [{ provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 1500 } }]
})
export class AngularMaterialModule {}
