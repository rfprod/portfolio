import { NgModule, ModuleWithProviders } from '@angular/core';
import {
  // form controls
  MatAutocompleteModule, MatCheckboxModule, MatDatepickerModule, MatNativeDateModule, MatInputModule, MatSelectModule, MatSliderModule, MatSlideToggleModule, MatRadioModule,
  // navigation
  MatMenuModule, MatSidenavModule, MatToolbarModule,
  // layout
  MatListModule, MatGridListModule, MatCardModule, MatStepperModule, MatTabsModule, MatExpansionModule,
  // buttons and indicators
  MatButtonModule, MatButtonToggleModule, MatChipsModule, MatIconModule, MatProgressSpinnerModule, MatProgressBarModule,
  // popups and modals
  MatDialogModule, MatSnackBarModule, MatTooltipModule, MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions,
  // data table
  MatTableModule, MatSortModule, MatPaginatorModule,
  // misc
  MatOptionModule, MatRippleModule,
  // divider
  MatDividerModule,
  // icons
  MatIconRegistry,
  // tree
  MatTreeModule
} from '@angular/material';

import { OverlayModule } from '@angular/cdk/overlay';

import { MatMomentDateModule } from '@angular/material-moment-adapter';

/**
 * Custom material module without providers.
 * Exports material modules only.
 * This module should be used in root application modules only, it contains data adaper, which should be singleton.
 */
@NgModule({
  imports: [
    // form controls
    MatAutocompleteModule, MatCheckboxModule, MatDatepickerModule, MatNativeDateModule, MatMomentDateModule,
    MatInputModule, MatSelectModule, MatSliderModule, MatSlideToggleModule, MatRadioModule,
    // navigation
    MatMenuModule, MatSidenavModule, MatToolbarModule,
    // layout
    MatListModule, MatGridListModule, MatCardModule, MatStepperModule, MatTabsModule, MatExpansionModule,
    // buttons and indicators
    MatButtonModule, MatButtonToggleModule, MatChipsModule, MatIconModule, MatProgressSpinnerModule, MatProgressBarModule,
    // popups and modals
    MatDialogModule, MatSnackBarModule, MatTooltipModule,
    // data table
    MatTableModule, MatSortModule, MatPaginatorModule,
    // misc
    MatOptionModule, MatRippleModule,
    // divider
    MatDividerModule,
    // tree
    MatTreeModule,
    // cdk
    OverlayModule
  ],
  exports: [
    // form controls
    MatAutocompleteModule, MatCheckboxModule, MatDatepickerModule, MatNativeDateModule, MatMomentDateModule,
    MatInputModule, MatSelectModule, MatSliderModule, MatSlideToggleModule, MatRadioModule,
    // navigation
    MatMenuModule, MatSidenavModule, MatToolbarModule,
    // layout
    MatListModule, MatGridListModule, MatCardModule, MatStepperModule, MatTabsModule, MatExpansionModule,
    // buttons and indicators
    MatButtonModule, MatButtonToggleModule, MatChipsModule, MatIconModule, MatProgressSpinnerModule,
    MatProgressBarModule,
    // popups and modals
    MatDialogModule, MatSnackBarModule, MatTooltipModule,
    // data table
    MatTableModule, MatSortModule, MatPaginatorModule,
    // misc
    MatOptionModule, MatRippleModule,
    // divider
    MatDividerModule,
    // tree
    MatTreeModule,
    // cdk
    OverlayModule
  ]
})
export class CustomMaterialModuleWithoutProviders {}

/**
 * Custom material module with providers.
 * Exports material modules, and provides services.
 */
export const CustomMaterialModule: ModuleWithProviders = {
  ngModule: CustomMaterialModuleWithoutProviders,
  providers: [
    MatIconRegistry,
    {
      provide: MAT_TOOLTIP_DEFAULT_OPTIONS,
      useValue: {
        showDelay: 1000,
        hideDelay: 1000,
        touchendHideDelay: 1000
      } as MatTooltipDefaultOptions
    }
  ]
};
