import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';

import { UiState } from './ui.store';

@NgModule({
  imports: [NgxsModule.forFeature([UiState])],
})
export class UiStoreModule {}
