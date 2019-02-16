import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { EventEmitterService } from '../services/emitter/event-emitter.service';

import { FlexLayoutModule } from '@angular/flex-layout';
import { CustomMaterialModule } from '../modules/material/custom-material.module';

import { DummyComponent } from '../../mocks/index';

import { AppComponent } from './app.component';
import { UtilsService } from '../services/utils/utils.service';

describe('AppComponent', () => {

  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let emitter: EventEmitterService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppComponent, DummyComponent ],
      imports: [
        BrowserDynamicTestingModule, NoopAnimationsModule,
        CustomMaterialModule, FlexLayoutModule,
        RouterTestingModule.withRoutes([
          {path: '', component: DummyComponent},
        ])
      ],
      providers: [
        { provide: 'Window', useValue: window },
        EventEmitterService,
        UtilsService
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(AppComponent);
      component = fixture.componentInstance;
      emitter = TestBed.get(EventEmitterService) as EventEmitterService;
    });
  }));

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should have variables and methods defined', function() {
    this.component = component;

    expect(this.component.subscriptions).toEqual(jasmine.any(Array));
    expect(this.component.showSpinner).toEqual(jasmine.any(Boolean));
    expect(this.component.showSpinner).toBeFalsy();
    expect(this.component.startSpinner).toEqual(jasmine.any(Function));
    expect(this.component.stopSpinner).toEqual(jasmine.any(Function));
    expect(this.component.setDatepickerLocale).toEqual(jasmine.any(Function));
    expect(this.component.ngOnInit).toEqual(jasmine.any(Function));
    expect(this.component.ngOnDestroy).toEqual(jasmine.any(Function));
  });

  it('should control spinner correctly', function() {
    this.component = component;

    expect(this.component.showSpinner).toBeFalsy();
    this.component.startSpinner();
    expect(this.component.showSpinner).toBeTruthy();
    this.component.stopSpinner();
    expect(this.component.showSpinner).toBeFalsy();
  });

  it('should listen to event emitter and take action if message is correct', function() {
    this.component = component;
    this.emitter = emitter;
    
    this.component.ngOnInit();

    expect(this.component.showSpinner).toBeFalsy();
    this.emitter.emitEvent({ spinner: 'start' });
    expect(this.component.showSpinner).toBeTruthy();
    this.emitter.emitEvent({ spinner: 'stop' });
    expect(this.component.showSpinner).toBeFalsy();
    this.emitter.emitEvent({ spinner: 'ziii' });
    expect(this.component.showSpinner).toBeFalsy(); // nothing happens

    this.emitter.emitEvent({ unrecognized_key: 'value' }); //
    expect(this.component.showSpinner).toBeFalsy(); // nothing happens
  });

  it('should be properly destroyed', function() {
    this.component = component;

    this.component.ngOnInit();

    for (const sub of this.component.subscriptions) {
      spyOn(sub, 'unsubscribe').and.callThrough();
    }
    component.ngOnDestroy();
    for (const sub of this.component.subscriptions) {
      expect(sub.unsubscribe).toHaveBeenCalled();
    }
  });
});
