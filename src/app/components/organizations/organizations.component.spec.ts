import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, TestModuleMetadata, waitForAsync } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { DummyComponent } from 'src/app/mocks/components/dummy.component';

import { AppMaterialModule } from '../../modules/material/material.module';
import { AppOrganizationsComponent } from './organizations.component';

describe('AppOrganizationsComponent', () => {
  const testBedConfig: TestModuleMetadata = {
    declarations: [AppOrganizationsComponent, DummyComponent],
    imports: [
      BrowserDynamicTestingModule,
      NoopAnimationsModule,
      HttpClientTestingModule,
      AppMaterialModule,
      FlexLayoutModule,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  };

  let fixture: ComponentFixture<AppOrganizationsComponent>;
  let component: AppOrganizationsComponent;

  beforeEach(
    waitForAsync(() => {
      void TestBed.configureTestingModule(testBedConfig)
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(AppOrganizationsComponent);
          component = fixture.componentInstance;

          fixture.detectChanges();
        });
    }),
  );

  it('should be defined', () => {
    expect(component).toBeDefined();
  });
});
