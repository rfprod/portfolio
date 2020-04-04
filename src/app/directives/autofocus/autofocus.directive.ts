import { Directive, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

/**
 * Autofocus directive.
 */
@Directive({
  selector: '[appAutofocus]',
})
export class AutofocusDirective implements OnInit, OnChanges {
  /**
   * Autofocus state.
   */
  private autofocusState = false;

  /**
   * Constructor.
   * @param el Element reference
   */
  constructor(private readonly el: ElementRef) {}

  /**
   * Autofocus setter.
   * @param state current autofocus state
   */
  @Input() set autofocus(state: boolean) {
    this.autofocusState = state ? true : false;
  }

  /**
   * Lifecycle hook called after directive is initialized.
   */
  public ngOnInit(): void {
    if (this.autofocusState || typeof this.autofocusState === 'undefined') {
      this.el.nativeElement.focus();
    }
  }

  /**
   * Lifecycle hook called on input change.
   */
  public ngOnChanges(changes: SimpleChanges): void {
    if (this.autofocusState) {
      this.el.nativeElement.focus();
    }
  }
}
