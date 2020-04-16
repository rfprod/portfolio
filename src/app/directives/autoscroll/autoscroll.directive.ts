import { AfterContentInit, Directive, ElementRef, HostListener, Input } from '@angular/core';

/**
 * Autoscroll directive.
 */
@Directive({
  selector: '[appAutoscroll]',
})
export class AutoscrollDirective implements AfterContentInit {
  @Input() public lockYOffset = 10;
  @Input() public observeAttributes = false;

  private lockAutoscroll = false;
  private mutationObserver: MutationObserver;
  private nativeElement: HTMLElement;

  /**
   * Constructor.
   * @param el Element reference
   */
  constructor(private readonly el: ElementRef) {}

  public getObserveAttributes(): boolean {
    return this.observeAttributes;
  }

  public ngAfterContentInit(): void {
    this.nativeElement = this.el.nativeElement;
    this.mutationObserver = new MutationObserver(() => {
      if (!this.lockAutoscroll) {
        this.scrollDown();
      }
    });
    this.mutationObserver.observe(this.nativeElement, {
      childList: true,
      subtree: true,
      attributes: this.getObserveAttributes(),
    });
  }

  public ngOnDestroy(): void {
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
  }

  public isLocked(): boolean {
    return this.lockAutoscroll;
  }

  @HostListener('scroll')
  public scrollHandler(): void {
    const scrollFromBottom =
      this.nativeElement.scrollHeight -
      this.nativeElement.scrollTop -
      this.nativeElement.clientHeight;
    this.lockAutoscroll = scrollFromBottom > this.lockYOffset;
  }

  private scrollDown(): void {
    this.nativeElement.scrollTop = this.nativeElement.scrollHeight;
  }
}
