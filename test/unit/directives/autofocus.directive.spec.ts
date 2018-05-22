import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { AutofocusDirective } from '../../../app/src/directives/autofocus.directive';

import { DummyComponent } from '../mocks/index';

describe('AutofocusDirective', () => {

	beforeEach((done: DoneFn) => {
		TestBed.configureTestingModule({
			declarations: [ DummyComponent, AutofocusDirective ]
		}).compileComponents().then(() => {
			this.fixture = TestBed.createComponent(DummyComponent);
			this.component = this.fixture.componentInstance;
			this.debugElement = this.fixture.debugElement.query(By.directive(AutofocusDirective));
			this.directive = this.debugElement.injector.get(AutofocusDirective) as AutofocusDirective;
			done();
		});
	});

	it('dummy component should compile successfully', () => {
		expect(this.directive).toBeDefined();
	});

	it('should have variables and methods defined', () => {
		expect(this.directive.el.nativeElement.autofocus).toBeTruthy();
		expect(this.directive.autofocusState).toEqual(jasmine.any(Boolean));
		expect(this.directive.ngOnInit).toEqual(jasmine.any(Function));
		expect(this.directive.ngOnChanges).toEqual(jasmine.any(Function));
	});

	it('ngOnInit should call directive renderer invokeElementMethod if autofocus condition is met', () => {
		spyOn(this.directive.el.nativeElement, 'focus');

		this.directive.autofocusState = null;
		this.directive.ngOnInit();
		expect(this.directive.el.nativeElement.focus).not.toHaveBeenCalled();

		this.directive.autofocusState = undefined;
		this.directive.ngOnInit();
		expect(this.directive.el.nativeElement.focus).toHaveBeenCalled();
	});

	it('autofocus method should set autofocusState property', () => {
		this.directive.autofocus = true;
		expect(this.directive.autofocusState).toBeTruthy();
		this.directive.autofocus = false;
		expect(this.directive.autofocusState).toBeFalsy();
	});

});
