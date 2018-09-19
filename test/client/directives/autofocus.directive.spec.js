"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var platform_browser_1 = require("@angular/platform-browser");
var autofocus_directive_1 = require("../../../public/src/directives/autofocus.directive");
var index_1 = require("../mocks/index");
describe('AutofocusDirective', function () {
    beforeEach(function (done) {
        testing_1.TestBed.configureTestingModule({
            declarations: [index_1.DummyComponent, autofocus_directive_1.AutofocusDirective]
        }).compileComponents().then(function () {
            _this.fixture = testing_1.TestBed.createComponent(index_1.DummyComponent);
            _this.component = _this.fixture.componentInstance;
            _this.debugElement = _this.fixture.debugElement.query(platform_browser_1.By.directive(autofocus_directive_1.AutofocusDirective));
            _this.directive = _this.debugElement.injector.get(autofocus_directive_1.AutofocusDirective);
            done();
        });
    });
    it('dummy component should compile successfully', function () {
        expect(_this.directive).toBeDefined();
    });
    it('should have variables and methods defined', function () {
        expect(_this.directive.el.nativeElement.autofocus).toBeTruthy();
        expect(_this.directive.autofocusState).toEqual(jasmine.any(Boolean));
        expect(_this.directive.ngOnInit).toEqual(jasmine.any(Function));
        expect(_this.directive.ngOnChanges).toEqual(jasmine.any(Function));
    });
    it('ngOnInit should call directive renderer invokeElementMethod if autofocus condition is met', function () {
        spyOn(_this.directive.el.nativeElement, 'focus');
        _this.directive.autofocusState = null;
        _this.directive.ngOnInit();
        expect(_this.directive.el.nativeElement.focus).not.toHaveBeenCalled();
        _this.directive.autofocusState = undefined;
        _this.directive.ngOnInit();
        expect(_this.directive.el.nativeElement.focus).toHaveBeenCalled();
    });
    it('autofocus method should set autofocusState property', function () {
        _this.directive.autofocus = true;
        expect(_this.directive.autofocusState).toBeTruthy();
        _this.directive.autofocus = false;
        expect(_this.directive.autofocusState).toBeFalsy();
    });
});
//# sourceMappingURL=autofocus.directive.spec.js.map