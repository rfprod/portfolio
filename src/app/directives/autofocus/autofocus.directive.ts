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
  public autofocusState = false;

  public nativeElement?: HTMLElement;

  /**
   * Constructor.
   * @param el Element reference
   */
  constructor(public readonly el: ElementRef) {}

  /**
   * Autofocus setter.
   * @param state current autofocus state
   */
  @Input() public set autofocus(state: boolean) {
    this.autofocusState = state ? true : false;
  }

  /**
   * Lifecycle hook called after directive is initialized.
   */
  public ngOnInit(): void {
    this.nativeElement = this.el.nativeElement;
    if (typeof this.nativeElement !== 'undefined' && this.autofocusState) {
      this.nativeElement.focus();
    }
  }

  /**
   * Lifecycle hook called on input change.
   */
  public ngOnChanges(changes: SimpleChanges): void {
    if (typeof this.nativeElement !== 'undefined' && this.autofocusState) {
      this.nativeElement.focus();
    }
  }
}
