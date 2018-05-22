import { Directive, ElementRef, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
	selector: '[autofocus]'
})
export class AutofocusDirective implements OnInit, OnChanges {

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
	public ngOnInit() {
		if (this.autofocusState || typeof this.autofocusState === 'undefined') {
			this.el.nativeElement.focus();
		}
	}
	/**
	 * Lifecycle hook called on input change.
	 */
	public ngOnChanges(changes: SimpleChanges) {
		if (this.autofocusState) {
			this.el.nativeElement.focus();
		}
	}

}
