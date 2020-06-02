import { Component } from '@angular/core';

@Component({
  selector: 'app-dummy-component',
  template: '<div appAutoscroll class="scrollable"><input autofocus="true" appAutofocus /></div>',
  styles: [
    `
      .scrollable {
        display: block;
        min-height: 50px;
        height: 50px;
        max-height: 50px;
        overflow-y: scroll;
      }
    `,
  ],
})
export class DummyComponent {}
