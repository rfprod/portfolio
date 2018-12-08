import { Component } from '@angular/core';

/*
*	template note
*	input with autofocus attribute is needed for Autofocus directive testing
*/

@Component({
  selector: 'dummy-component',
  template: '<span> <input autofocus="true" /> </span>'
})
export class DummyComponent {}
