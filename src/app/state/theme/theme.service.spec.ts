import { TestBed, TestModuleMetadata, waitForAsync } from '@angular/core/testing';

import { getTestBedConfig, newTestBedMetadata } from '../../mocks/utils/test-bed-config.mock';
import { AppThemeService } from './theme.service';

describe('AppThemeService', () => {
  let service: AppThemeService;

  const testBedMetadata: TestModuleMetadata = newTestBedMetadata({});
  const testBedConfig: TestModuleMetadata = getTestBedConfig(testBedMetadata);

  beforeEach(
    waitForAsync(() => {
      void TestBed.configureTestingModule(testBedConfig)
        .compileComponents()
        .then(() => {
          service = TestBed.inject(AppThemeService);
        });
    }),
  );

  it('should be created', () => {
    expect(service).toBeDefined();
  });
});
