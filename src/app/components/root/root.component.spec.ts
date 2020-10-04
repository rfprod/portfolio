import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';
import { UiState } from 'src/app/modules/state/ui/ui.store';
import { UserState } from 'src/app/modules/state/user/user.store';

import { DummyComponent } from '../../../mocks/components/dummy.component.mock';
import { AppMaterialModule } from '../../modules/material/material.module';
import { HttpHandlersService } from '../../services/http-handlers/http-handlers.service';
import { WINDOW } from '../../services/providers.config';
import { AppRootComponent } from './root.component';

describe('AppRootComponent', () => {
  const testBedConfig: TestModuleMetadata = {
    declarations: [AppRootComponent, DummyComponent],
    imports: [
      BrowserDynamicTestingModule,
      NoopAnimationsModule,
      AppMaterialModule.forRoot(),
      FlexLayoutModule,
      NgxsModule.forRoot([UserState, UiState]),
      RouterTestingModule.withRoutes([{ path: '', component: DummyComponent }]),
    ],
    providers: [
      { provide: WINDOW, useValue: window },
      {
        provide: MatSnackBar,
        useValue: {
          open: (): null => null,
        },
      },
      {
        provide: HttpHandlersService,
        useFactory: (snackBar: MatSnackBar) => new HttpHandlersService(snackBar),
        deps: [MatSnackBar],
      },
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  };

  let fixture: ComponentFixture<AppRootComponent>;
  let component: AppRootComponent;

  beforeEach(async(() => {
    void TestBed.configureTestingModule(testBedConfig)
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(AppRootComponent);
        component = fixture.componentInstance;
      });
  }));

  it('should be defined', () => {
    expect(component).toBeDefined();
  });
});
