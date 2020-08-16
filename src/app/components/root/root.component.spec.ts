import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { DummyComponent } from '../../../mocks/components/dummy.component.mock';
import { AppMaterialModule } from '../../modules/material/material.module';
import { HttpHandlersService } from '../../services/http-handlers/http-handlers.service';
import { WINDOW } from '../../services/providers.config';
import { AppRootComponent } from './root.component';

describe('AppRootComponent', () => {
  let fixture: ComponentFixture<AppRootComponent>;
  let component: AppRootComponent;

  beforeEach(async(() => {
    void TestBed.configureTestingModule({
      declarations: [AppRootComponent, DummyComponent],
      imports: [
        BrowserDynamicTestingModule,
        NoopAnimationsModule,
        AppMaterialModule.forRoot(),
        FlexLayoutModule,
        RouterTestingModule.withRoutes([{ path: '', component: DummyComponent }]),
      ],
      providers: [
        { provide: WINDOW, useValue: window },
        {
          provide: MatSnackBar,
          useValue: {
            open: (): void => null,
          },
        },
        {
          provide: HttpHandlersService,
          useFactory: (snackBar: MatSnackBar) => new HttpHandlersService(snackBar),
          deps: [MatSnackBar],
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
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
