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

  private nativeElement: HTMLElement;

  /**
   * Constructor.
   * @param el Element reference
   */
  constructor(private readonly el: ElementRef) {}

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
    if (this.autofocusState || typeof this.autofocusState === 'undefined') {
      this.nativeElement.focus();
    }
  }

  /**
   * Lifecycle hook called on input change.
   */
  public ngOnChanges(changes: SimpleChanges): void {
    if (this.autofocusState) {
      this.nativeElement.focus();
    }
  }
}
