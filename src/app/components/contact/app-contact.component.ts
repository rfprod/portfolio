import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { finalize, tap } from 'rxjs/operators';
import { IContactForm } from 'src/app/interfaces/index';
import { EventEmitterService } from 'src/app/services/emitter/event-emitter.service';
import { SendEmailService } from 'src/app/services/send-email/send-email.service';

/**
 * Application contact component.
 */
@Component({
  selector: 'app-contact',
  templateUrl: './app-contact.component.html',
  host: {
    class: 'mat-body-1',
  },
})
export class AppContactComponent implements OnInit, OnDestroy {
  /**
   * Contact form.
   */
  public contactForm: IContactForm;
  /**
   * Text input error message.
   */
  public readonly inputError = 'Invalid input, allowed characters: a-z A-Z а-я А-Я - . spacebar';
  /**
   * Common text validator.
   */
  private readonly textValidator: ValidatorFn = Validators.pattern(/[a-zA-Zа-яА-Я\s-.]{3,}/);

  /**
   * Constructor.
   * @param data Dialog data
   * @param dialogRef Dialog reference
   * @param fb Form builder
   * @param emitter Event emitter service
   * @param sendEmailService Send email service
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AppContactComponent>,
    private readonly fb: FormBuilder,
    private readonly emitter: EventEmitterService,
    private readonly sendEmailService: SendEmailService,
  ) {}

  /**
   * Submits contact form.
   */
  public submitForm(): void {
    if (this.contactForm.valid && !this.contactForm.pristine) {
      this.sendMessage().subscribe();
    }
  }

  /**
   * Sends message.
   */
  public sendMessage() {
    this.emitter.emitSpinnerStartEvent();
    const formData: any = this.contactForm.value;
    return this.sendEmailService.sendEmail(formData).pipe(
      tap(() => {
        this.closeDialog();
      }),
      finalize(() => {
        this.emitter.emitSpinnerStopEvent();
      }),
    );
  }

  /**
   * Closes dialog.
   * Report result if it was commonly closed, or modified and closed, deleted,
   * or optionally use result provided via param.
   * Parent controller should listen to this event
   * @param [result] result returned to parent component
   */
  public closeDialog(result?: any) {
    this.dialogRef.close(result ? result : 'closed');
  }

  public ngOnInit(): void {
    this.resetForm();
  }

  public ngOnDestroy(): void {}

  /**
   * Resets contact form.
   */
  private resetForm(): void {
    this.contactForm = this.fb.group({
      name: ['', Validators.compose([Validators.required, this.textValidator])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      header: ['', Validators.compose([Validators.required, this.textValidator])],
      message: ['', Validators.compose([Validators.required, this.textValidator])],
      domain: [this.data.domain, Validators.compose([Validators.required])],
    }) as IContactForm;
  }
}
