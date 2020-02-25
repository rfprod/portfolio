import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { AutofocusDirective } from 'src/app/directives/autofocus/autofocus.directive';

import { DummyComponent } from 'src/mocks/index';

describe('AutofocusDirective', () => {

  let fixture: ComponentFixture<DummyComponent>;
  let component: DummyComponent;
  let debugElement: DebugElement;
  let directive: AutofocusDirective|any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DummyComponent, AutofocusDirective ],
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(DummyComponent);
      component = fixture.componentInstance;
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

    directive.autofocusState = null;
    directive.ngOnInit();
    expect(directive.el.nativeElement.focus).not.toHaveBeenCalled();

    directive.autofocusState = undefined;
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
