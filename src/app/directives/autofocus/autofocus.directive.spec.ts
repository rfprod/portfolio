import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DummyComponent } from '../../../mocks/components/dummy.component.mock';
import { AutofocusDirective } from './autofocus.directive';

describe('AutofocusDirective', () => {
  let fixture: ComponentFixture<DummyComponent>;
  let debugElement: DebugElement;
  let directive: AutofocusDirective;

  beforeEach(
    waitForAsync(() => {
      void TestBed.configureTestingModule({
        declarations: [DummyComponent, AutofocusDirective],
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(DummyComponent);
          debugElement = fixture.debugElement.query(By.directive(AutofocusDirective));
          directive = debugElement.injector.get(AutofocusDirective);
        });
    }),
  );

  it('dummy component should compile successfully', () => {
    expect(directive).toBeDefined();
  });

  it('should have variables and methods defined', () => {
    expect(directive?.nativeElement?.autofocus).toBeUndefined();
    expect(directive.autofocusState).toEqual(expect.any(Boolean));
  });

  it('ngOnInit should call directive renderer invokeElementMethod if autofocus condition is met', () => {
    const focusSpy = spyOn(directive.el.nativeElement, 'focus');

    directive.autofocusState = false;
    directive.ngOnInit();
    expect(focusSpy).not.toHaveBeenCalled();

    directive.autofocusState = true;
    directive.ngOnInit();
    expect(focusSpy).toHaveBeenCalled();
  });

  it('autofocus method should set autofocusState property', () => {
    directive.autofocus = true;
    expect(directive.autofocusState).toBeTruthy();
    directive.autofocus = false;
    expect(directive.autofocusState).toBeFalsy();
  });
});
