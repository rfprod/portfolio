import {
  AfterContentInit,
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
} from '@angular/core';

const defaultLockYOffset = 10;

/**
 * Autoscroll directive.
 */
@Directive({
  selector: '[appAutoscroll]',
})
export class AutoscrollDirective implements AfterContentInit, OnDestroy {
  @Input() public lockYOffset = defaultLockYOffset;

  @Input() public observeAttributes = false;

  private lockAutoscroll = false;

  private mutationObserver: MutationObserver;

  private nativeElement: HTMLElement;

  /**
   * Constructor.
   * @param el Element reference
   */
  constructor(private readonly el: ElementRef) {}

  /**
   * Observe attributes getter.
   */
  public getObserveAttributes(): boolean {
    return this.observeAttributes;
  }

  /**
   * Lifecycle hook.
   */
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

  /**
   * Lifecycle hook.
   */
  public ngOnDestroy(): void {
    if (Boolean(this.mutationObserver)) {
      this.mutationObserver.disconnect();
    }
  }

  /**
   * Resolves if autoscroll is locked.
   */
  public isLocked(): boolean {
    return this.lockAutoscroll;
  }

  /**
   * Host scroll listener and handler.
   */
  @HostListener('scroll')
  public scrollHandler(): void {
    const scrollFromBottom =
      this.nativeElement.scrollHeight -
      this.nativeElement.scrollTop -
      this.nativeElement.clientHeight;
    this.lockAutoscroll = scrollFromBottom > this.lockYOffset;
  }

  /**
   * Forces scroll down.
   */
  private scrollDown(): void {
    this.nativeElement.scrollTop = this.nativeElement.scrollHeight;
  }
}
