import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';

import { UserState } from './user.store';

@NgModule({
  imports: [NgxsModule.forFeature([UserState])],
})
export class UserStoreModule {}
