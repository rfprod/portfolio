import { OverlayModule } from '@angular/cdk/overlay';
import { ModuleWithProviders, NgModule } from '@angular/core';
import {
  MatMomentDateModule,
} from '@angular/material-moment-adapter';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import {
  MatNativeDateModule,
  MatOptionModule,
  MatRippleModule,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import {
  MAT_TOOLTIP_DEFAULT_OPTIONS,
  MatTooltipDefaultOptions,
  MatTooltipModule,
} from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import 'node_modules/hammerjs/hammer.js';

/**
 * Custom material module without providers.
 * Exports material modules only.
 * This module should be used in root application modules only, it contains data adaper, which should be singleton.
 */
@NgModule({
  imports: [

    MatAutocompleteModule, MatCheckboxModule, MatDatepickerModule, MatNativeDateModule, MatMomentDateModule,
    MatInputModule, MatSelectModule, MatSliderModule, MatSlideToggleModule, MatRadioModule,

    MatMenuModule, MatSidenavModule, MatToolbarModule,

    MatListModule, MatGridListModule, MatCardModule, MatStepperModule, MatTabsModule, MatExpansionModule,

    MatButtonModule, MatButtonToggleModule, MatChipsModule, MatIconModule, MatProgressSpinnerModule, MatProgressBarModule,

    MatDialogModule, MatSnackBarModule, MatTooltipModule,

    MatTableModule, MatSortModule, MatPaginatorModule,

    MatOptionModule, MatRippleModule,

    MatDividerModule,

    MatTreeModule,

    OverlayModule,
  ],
  exports: [

    MatAutocompleteModule, MatCheckboxModule, MatDatepickerModule, MatNativeDateModule, MatMomentDateModule,
    MatInputModule, MatSelectModule, MatSliderModule, MatSlideToggleModule, MatRadioModule,

    MatMenuModule, MatSidenavModule, MatToolbarModule,

    MatListModule, MatGridListModule, MatCardModule, MatStepperModule, MatTabsModule, MatExpansionModule,

    MatButtonModule, MatButtonToggleModule, MatChipsModule, MatIconModule, MatProgressSpinnerModule,
    MatProgressBarModule,

    MatDialogModule, MatSnackBarModule, MatTooltipModule,

    MatTableModule, MatSortModule, MatPaginatorModule,

    MatOptionModule, MatRippleModule,
    MatDividerModule,
    MatTreeModule,
    OverlayModule,
  ],
})
export class CustomMaterialModule {

  /**
   * Provides services.
   */
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: CustomMaterialModule,
      providers: [
        MatIconRegistry,
        {
          provide: MAT_TOOLTIP_DEFAULT_OPTIONS,
          useValue: {
            showDelay: 1000,
            hideDelay: 1000,
            touchendHideDelay: 1000,
          } as MatTooltipDefaultOptions,
        },
      ],
    };
  }

}
