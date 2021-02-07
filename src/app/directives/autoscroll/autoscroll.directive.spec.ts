import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { timer } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { DummyComponent } from 'src/app/mocks/components/dummy.component';

import { AutoscrollDirective } from './autoscroll.directive';

describe('AutoscrollDirective', () => {
  let fixture: ComponentFixture<DummyComponent>;
  let debugElement: DebugElement;
  let directive: AutoscrollDirective;

  beforeEach(
    waitForAsync(() => {
      void TestBed.configureTestingModule({
        declarations: [DummyComponent, AutoscrollDirective],
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(DummyComponent);
          debugElement = fixture.debugElement.query(By.directive(AutoscrollDirective));
          directive = debugElement.injector.get(AutoscrollDirective);
          fixture.detectChanges();
        });
    }),
  );

  it('should compile successfully', () => {
    expect(directive).toBeDefined();
  });

  it(
    'autoscroll should work correctly',
    waitForAsync(() => {
      const testingElement: HTMLElement = debugElement.nativeElement;
      const inputHeight = testingElement.querySelector('input')?.clientHeight ?? 0;
      const testingElementHeight = testingElement.clientHeight;
      const interval = 500;
      const elementsCount = 10;
      void timer(0, interval)
        .pipe(
          tap(() => {
            const newDiv = document.createElement('div');
            newDiv.innerText = 'new div';
            const newDivHeight = newDiv.clientHeight;
            testingElement.appendChild(newDiv);
            let scrollValue =
              testingElement.scrollHeight - testingElementHeight - newDivHeight - inputHeight - 1;
            scrollValue = scrollValue < 0 ? 0 : scrollValue;
            expect(testingElement.scrollTop).toEqual(scrollValue);
          }),
          take(elementsCount),
        )
        .subscribe();
    }),
  );
});
