import { TestBed, waitForAsync } from '@angular/core/testing';

import { MocksCoreModule } from './mocks-core.module';

describe('MocksCoreModule', () => {
  beforeEach(
    waitForAsync(() => {
      void TestBed.configureTestingModule({
        imports: [MocksCoreModule],
      }).compileComponents();
    }),
  );

  it('should be defined', () => {
    expect(MocksCoreModule).toBeDefined();
  });
});
