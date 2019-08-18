import {
  Component,
  Inject,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';

import {
  FormBuilder,
  Validators,
  ValidatorFn
} from '@angular/forms';

import {
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material';

import { EventEmitterService } from 'src/app/services/emitter/event-emitter.service';
import { CustomDeferredService } from 'src/app/services/deferred/custom-deferred.service';
import { SendEmailService } from 'src/app/services/send-email/send-email.service';

import { IContactForm } from 'src/app/interfaces/index';

/**
 * Application contact component.
 */
@Component({
  selector: 'app-contact',
  templateUrl: './app-contact.component.html',
  host: {
    class: 'mat-body-1'
  },
  changeDetection: ChangeDetectionStrategy.Default
})
export class AppContactComponent implements OnInit, OnDestroy {

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
    private fb: FormBuilder,
    private emitter: EventEmitterService,
    private sendEmailService: SendEmailService
  ) {}

  /**
   * Contact form.
   */
  public contactForm: IContactForm;
  /**
   * Common text validator.
   */
  private textValidator: ValidatorFn = Validators.pattern(/[a-zA-Zа-яА-Я\s-.]{3,}/);
  /**
   * Text input error message.
   */
  public inputError: string = 'Invalid input, allowed characters: a-z A-Z а-я А-Я - . spacebar';
  /**
   * Resets contact form.
   */
  private resetForm(): void {
    this.contactForm = this.fb.group({
      name: ['', Validators.compose([Validators.required, this.textValidator])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      header: ['', Validators.compose([Validators.required, this.textValidator])],
      message: ['', Validators.compose([Validators.required, this.textValidator])],
      domain: [ this.data.domain, Validators.compose([Validators.required])]
    }) as IContactForm;
  }

  /**
   * Submits contact form.
   */
  public submitForm(): void {
    if (this.contactForm.valid && !this.contactForm.pristine) {
      this.sendMessage();
    }
  }

  /**
   * Sends message.
   */
  public sendMessage(): Promise<boolean> {
    this.emitter.emitSpinnerStartEvent();
    const def = new CustomDeferredService<any>();
    const formData: any = this.contactForm.value;
    this.sendEmailService.sendEmail(formData).subscribe(
      (data: any) => {
        this.emitter.emitSpinnerStopEvent();
        def.resolve(true);
        this.closeDialog();
      },
      (error: any) => {
        this.emitter.emitSpinnerStopEvent();
        def.reject(error);
      }
    );
    return def.promise;
  }

  /**
   * Closes dialog.
   * Report result if it was commonly closed, or modified and closed, deleted,
   * or optionally use result provided via param.
   * Parent controller should listen to this event
   * @param [result] result returned to parent component
   */
  public closeDialog(result?: any) {
    result = (result) ? result : 'closed';
    this.dialogRef.close(result);
  }

  /**
   * Lifecycle hook called after component is initialized.
   */
  public ngOnInit(): void {
    this.resetForm();
  }

  /**
   * Lifecycle hook called after component is destroyed.
   */
  public ngOnDestroy(): void {}

}
