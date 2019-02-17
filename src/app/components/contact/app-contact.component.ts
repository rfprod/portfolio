import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, ValidatorFn } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { EventEmitterService } from 'src/app/services/emitter/event-emitter.service';
import { CustomDeferredService } from 'src/app/services/deferred/custom-deferred.service';

import { SendEmailService } from 'src/app/services/send-email/send-email.service';

import { IContactForm } from 'src/app/interfaces/index';

/**
 * Application contact component.
 */
@Component({
  selector: 'app-contact',
  templateUrl: './app-contact.html',
  host: {
    class: 'mat-body-1'
  }
})
export class AppContactComponent implements OnInit, OnDestroy {

  /**
   * 
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
  ) {
    console.log('AppContactComponent constructor', this.data);
  }

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
        console.log('sendMessage:', data);
        this.emitter.emitSpinnerStopEvent();
        def.resolve(true);
        this.closeDialog();
      },
      (error: any) => {
        console.log('sendMessage error', error);
        this.emitter.emitSpinnerStopEvent();
        def.reject(error);
      }
    );
    return def.promise;
  }

  /**
   * Closes dialog.
   * @param [result] result returned to parent component
   */
  public closeDialog(result?: any) {
    /*
    *	report result if it was commonly closed, or modified and closed, deleted,
    *	or optional use result is provided
    *	parent controller should listen to this event
    */
    result = (result) ? result : 'closed';
    this.dialogRef.close(result);
  }

  /**
   * Lifecycle hook called after component is initialized.
   */
  public ngOnInit(): void {
    console.log('ngOnInit: AppContactComponent initialized');
    this.resetForm();
  }
  /**
   * Lifecycle hook called after component is destroyed.
   */
  public ngOnDestroy(): void {
    console.log('ngOnDestroy: AppContactComponent destroyed');
  }

}
