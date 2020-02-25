import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { EventEmitterService } from 'src/app/services/emitter/event-emitter.service';

import { FlexLayoutModule } from '@angular/flex-layout';
import { CustomMaterialModule } from 'src/app/modules/material/custom-material.module';

import { DummyComponent } from 'src/mocks/index';

import { AppComponent } from './app.component';

describe('AppComponent', () => {

  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent|any;
  let emitter: EventEmitterService|any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppComponent, DummyComponent ],
      imports: [
        BrowserDynamicTestingModule, NoopAnimationsModule,
        CustomMaterialModule, FlexLayoutModule,
        RouterTestingModule.withRoutes([
          {path: '', component: DummyComponent},
        ]),
      ],
      providers: [
        { provide: 'Window', useValue: window },
        EventEmitterService,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(AppComponent);
      component = fixture.componentInstance;
      emitter = TestBed.inject(EventEmitterService);
    });
  }));

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should have variables and methods defined', () => {
    expect(component.showSpinner).toEqual(jasmine.any(Boolean));
    expect(component.showSpinner).toBeTruthy();
    expect(component.startSpinner).toEqual(jasmine.any(Function));
    expect(component.stopSpinner).toEqual(jasmine.any(Function));
    expect(component.setDatepickerLocale).toEqual(jasmine.any(Function));
    expect(component.ngOnInit).toEqual(jasmine.any(Function));
    expect(component.ngOnDestroy).toEqual(jasmine.any(Function));
  });

  it('should control spinner correctly', () => {
    component.stopSpinner();
    expect(component.showSpinner).toBeFalsy();
    component.startSpinner();
    expect(component.showSpinner).toBeTruthy();
    component.stopSpinner();
    expect(component.showSpinner).toBeFalsy();
  });

  it('should listen to event emitter and take action if message is correct', () => {
    component.ngOnInit();

    emitter.emitEvent({ spinner: 'stop' });
    expect(component.showSpinner).toBeFalsy();
    emitter.emitEvent({ spinner: 'start' });
    expect(component.showSpinner).toBeTruthy();
    emitter.emitEvent({ spinner: 'stop' });
    expect(component.showSpinner).toBeFalsy();
    emitter.emitEvent({ spinner: 'ziii' });
    expect(component.showSpinner).toBeFalsy(); // Nothing happens

    emitter.emitEvent({ unrecognized_key: 'value' }); //
    expect(component.showSpinner).toBeFalsy(); // Nothing happens
  });

});
