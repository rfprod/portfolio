import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { AutofocusDirective } from './autofocus.directive';

import { DummyComponent } from '../../../mocks/index';

describe('AutofocusDirective', () => {

  let fixture: ComponentFixture<DummyComponent>;
  let component: DummyComponent;
  let debugElement: DebugElement;
  let directive: AutofocusDirective;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DummyComponent, AutofocusDirective ]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(DummyComponent);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement.query(By.directive(AutofocusDirective));
      directive = debugElement.injector.get(AutofocusDirective) as AutofocusDirective;
    });
  }));

  it('dummy component should compile successfully', () => {
    expect(directive).toBeDefined();
  });

  it('should have variables and methods defined', function() {
    this.directive = directive;

    expect(this.directive.el.nativeElement.autofocus).toBeTruthy();
    expect(this.directive.autofocusState).toEqual(jasmine.any(Boolean));
    expect(this.directive.ngOnInit).toEqual(jasmine.any(Function));
    expect(this.directive.ngOnChanges).toEqual(jasmine.any(Function));
  });

  it('ngOnInit should call directive renderer invokeElementMethod if autofocus condition is met', function() {
    this.directive = directive;

    spyOn(this.directive.el.nativeElement, 'focus');

    this.directive.autofocusState = null;
    this.directive.ngOnInit();
    expect(this.directive.el.nativeElement.focus).not.toHaveBeenCalled();

    this.directive.autofocusState = undefined;
    this.directive.ngOnInit();
    expect(this.directive.el.nativeElement.focus).toHaveBeenCalled();
  });

  it('autofocus method should set autofocusState property', function() {
    this.directive = directive;

    this.directive.autofocus = true;
    expect(this.directive.autofocusState).toBeTruthy();
    this.directive.autofocus = false;
    expect(this.directive.autofocusState).toBeFalsy();
  });

});
