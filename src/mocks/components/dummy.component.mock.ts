import { Component } from '@angular/core';

/**
 * @note
 * input with autofocus attribute is needed for Autofocus directive testing
 */
@Component({
  selector: 'app-dummy-component',
  template: '<span> <input autofocus="true" /> </span>',
})
export class DummyComponent {}
