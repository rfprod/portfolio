import {
  Directive,
  ElementRef,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';

/**
 * Autofocus directive.
 */
@Directive({
  selector: '[autofocus]'
})
export class AutofocusDirective implements OnInit, OnChanges {

  /**
   * Constructor.
   * @param el Element reference
   */
  constructor(
    private el: ElementRef
  ) {}

  /**
   * Autofocus state.
   */
  private autofocusState: boolean = false;

  /**
   * Autofocus setter.
   * @param state current autofocus state
   */
  @Input() set autofocus(state: boolean) {
    this.autofocusState = (state) ? true : false;
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
