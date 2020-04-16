import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { timer } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { DummyComponent } from '../../../mocks/components/dummy.component.mock';
import { AutoscrollDirective } from './autoscroll.directive';

describe('AutoscrollDirective', () => {
  let fixture: ComponentFixture<DummyComponent>;
  let debugElement: DebugElement;
  let directive: AutoscrollDirective | any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DummyComponent, AutoscrollDirective],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(DummyComponent);
        debugElement = fixture.debugElement.query(By.directive(AutoscrollDirective));
        directive = debugElement.injector.get(AutoscrollDirective);
        fixture.detectChanges();
      });
  }));

  it('should compile successfully', () => {
    expect(directive).toBeDefined();
  });

  it('autoscroll should work correctly', async(() => {
    const testingElement: HTMLElement = debugElement.nativeElement;
    const inputHeight = testingElement.querySelector('input').clientHeight;
    const testingElementHeight = testingElement.clientHeight;
    const interval = 500;
    const elementsCount = 10;
    timer(0, interval)
      .pipe(
        tap(_ => {
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
  }));
});