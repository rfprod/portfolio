import { Directive, ElementRef, EventEmitter, OnInit, Input, Output } from '@angular/core';

@Directive({
	selector: '[checkImageLoad]'
})
export class CheckImageLoadDirective implements OnInit {

	constructor(
		private el: ElementRef
	) {
		console.log('this.el.nativeElement', this.el.nativeElement);
	}

	/**
	 * Indicates whether image loading should be checked.
	 */
	@Input('checkImageLoad') public checkImageLoad: boolean = false;

	/**
	 * Emits if image should be shown or not.
	 */
	@Output() public showImage: EventEmitter<boolean> = new EventEmitter<boolean>();

	/**
	 * Lifecycle hook called after directive is initialized.
	 */
	public ngOnInit() {
		if (this.checkImageLoad) {
			this.el.nativeElement.bind('load', () => {
				console.log('image loaded');
				this.showImage.emit(true);
			});
			this.el.nativeElement.bind('error', () => {
				console.log('image load error');
				this.showImage.emit(false);
			});
		}
	}

}
