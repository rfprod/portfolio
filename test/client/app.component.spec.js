"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var testing_2 = require("@angular/platform-browser-dynamic/testing");
var animations_1 = require("@angular/platform-browser/animations");
var testing_3 = require("@angular/router/testing");
var event_emitter_service_1 = require("../../public/src/services/event-emitter.service");
var flex_layout_1 = require("@angular/flex-layout");
require("../../node_modules/hammerjs/hammer.js");
var custom_material_module_1 = require("../../public/src/modules/custom-material.module");
var index_1 = require("./mocks/index");
var app_component_1 = require("../../public/src/app.component");
describe('AppComponent', function () {
    beforeEach(function (done) {
        testing_1.TestBed.configureTestingModule({
            declarations: [app_component_1.AppComponent, index_1.DummyComponent],
            imports: [testing_2.BrowserDynamicTestingModule, animations_1.NoopAnimationsModule, custom_material_module_1.CustomMaterialModule, flex_layout_1.FlexLayoutModule, testing_3.RouterTestingModule.withRoutes([
                    { path: '', component: index_1.DummyComponent },
                ])],
            providers: [
                { provide: 'Window', useValue: window },
                event_emitter_service_1.EventEmitterService
            ],
            schemas: [core_1.CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents().then(function () {
            _this.fixture = testing_1.TestBed.createComponent(app_component_1.AppComponent);
            _this.component = _this.fixture.componentInstance;
            _this.emitterService = testing_1.TestBed.get(event_emitter_service_1.EventEmitterService);
            done();
        });
    });
    it('should be defined', function () {
        expect(_this.component).toBeDefined();
    });
    it('should have variables and methods defined', function () {
        expect(_this.component.subscriptions).toEqual(jasmine.any(Array));
        expect(_this.component.showSpinner).toEqual(jasmine.any(Boolean));
        expect(_this.component.showSpinner).toBeFalsy();
        expect(_this.component.startSpinner).toEqual(jasmine.any(Function));
        expect(_this.component.stopSpinner).toEqual(jasmine.any(Function));
        expect(_this.component.setDatepickerLocale).toEqual(jasmine.any(Function));
        expect(_this.component.ngOnInit).toEqual(jasmine.any(Function));
        expect(_this.component.ngOnDestroy).toEqual(jasmine.any(Function));
    });
    it('should control spinner correctly', function () {
        expect(_this.component.showSpinner).toBeFalsy();
        _this.component.startSpinner();
        expect(_this.component.showSpinner).toBeTruthy();
        _this.component.stopSpinner();
        expect(_this.component.showSpinner).toBeFalsy();
    });
    it('should listen to event emitter and take action if message is correct', function () {
        _this.component.ngOnInit();
        expect(_this.component.showSpinner).toBeFalsy();
        _this.emitterService.emitter.emit({ spinner: 'start' });
        expect(_this.component.showSpinner).toBeTruthy();
        _this.emitterService.emitter.emit({ spinner: 'stop' });
        expect(_this.component.showSpinner).toBeFalsy();
        _this.emitterService.emitter.emit({ spinner: 'ziii' });
        expect(_this.component.showSpinner).toBeFalsy();
        _this.emitterService.emitter.emit({ unrecognized_key: 'value' });
        expect(_this.component.showSpinner).toBeFalsy();
    });
    it('should be properly destroyed', function () {
        _this.component.ngOnInit();
        for (var _i = 0, _a = _this.component.subscriptions; _i < _a.length; _i++) {
            var sub = _a[_i];
            spyOn(sub, 'unsubscribe').and.callThrough();
        }
        _this.component.ngOnDestroy();
        for (var _b = 0, _c = _this.component.subscriptions; _b < _c.length; _b++) {
            var sub = _c[_b];
            expect(sub.unsubscribe).toHaveBeenCalled();
        }
    });
});
//# sourceMappingURL=app.component.spec.js.map