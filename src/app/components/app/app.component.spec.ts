import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { DummyComponent } from '../../../mocks/components/dummy.component.mock';
import { CustomMaterialModule } from '../../modules/material/custom-material.module';
import { CustomHttpHandlersService } from '../../services/http-handlers/custom-http-handlers.service';
import { WINDOW } from '../../services/providers.config';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent | any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent, DummyComponent],
      imports: [
        BrowserDynamicTestingModule,
        NoopAnimationsModule,
        CustomMaterialModule,
        FlexLayoutModule,
        RouterTestingModule.withRoutes([{ path: '', component: DummyComponent }]),
      ],
      providers: [
        { provide: WINDOW, useValue: window },
        {
          provide: CustomHttpHandlersService,
          useFactory: () => new CustomHttpHandlersService(),
          deps: [],
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
      });
  }));

  it('should be defined', () => {
    expect(component).toBeDefined();
  });
});
