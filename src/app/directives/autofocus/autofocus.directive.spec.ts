/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DummyComponent } from '../../../mocks/components/dummy.component.mock';
import { AutofocusDirective } from './autofocus.directive';

describe('AutofocusDirective', () => {
  let fixture: ComponentFixture<DummyComponent>;
  let debugElement: DebugElement;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let directive: AutofocusDirective | any;

  beforeEach(async(() => {
    void TestBed.configureTestingModule({
      declarations: [DummyComponent, AutofocusDirective],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(DummyComponent);
        debugElement = fixture.debugElement.query(By.directive(AutofocusDirective));
        directive = debugElement.injector.get(AutofocusDirective);
      });
  }));

  it('dummy component should compile successfully', () => {
    expect(directive).toBeDefined();
  });

  it('should have variables and methods defined', () => {
    expect(directive.el.nativeElement.autofocus).toBeTruthy();
    expect(directive.autofocusState).toEqual(jasmine.any(Boolean));
    expect(directive.ngOnInit).toEqual(jasmine.any(Function));
    expect(directive.ngOnChanges).toEqual(jasmine.any(Function));
  });

  it('ngOnInit should call directive renderer invokeElementMethod if autofocus condition is met', () => {
    spyOn(directive.el.nativeElement, 'focus');

    directive.autofocusState = false;
    directive.ngOnInit();
    expect(directive.el.nativeElement.focus).not.toHaveBeenCalled();

    directive.autofocusState = void 0;
    directive.ngOnInit();
    expect(directive.el.nativeElement.focus).not.toHaveBeenCalled();

    directive.autofocusState = true;
    directive.ngOnInit();
    expect(directive.el.nativeElement.focus).toHaveBeenCalled();
  });

  it('autofocus method should set autofocusState property', () => {
    directive.autofocus = true;
    expect(directive.autofocusState).toBeTruthy();
    directive.autofocus = false;
    expect(directive.autofocusState).toBeFalsy();
  });
});
