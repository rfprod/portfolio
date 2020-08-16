import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { tap } from 'rxjs/operators';
import { IContactForm } from 'src/app/interfaces/index';
import { SendEmailService } from 'src/app/services/send-email/send-email.service';

/**
 * Application contact component.
 */
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppContactComponent {
  /**
   * Text input error message.
   */
  public readonly inputError = 'Invalid input, allowed characters: a-z A-Z а-я А-Я - . spacebar';

  /**
   * Common text validator.
   */
  private readonly textValidator: ValidatorFn = Validators.pattern(/[a-zA-Zа-яА-Я\s-.]{3,}/);

  /**
   * Contact form.
   */
  public readonly contactForm: IContactForm = this.fb.group({
    name: ['', Validators.compose([Validators.required, this.textValidator])],
    email: ['', Validators.compose([Validators.required, Validators.email])],
    header: ['', Validators.compose([Validators.required, this.textValidator])],
    message: ['', Validators.compose([Validators.required, this.textValidator])],
    domain: [this.data.domain, Validators.compose([Validators.required])],
  }) as IContactForm;

  /**
   * Constructor.
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { domain: string }, // TODO
    private readonly dialogRef: MatDialogRef<AppContactComponent>,
    private readonly fb: FormBuilder,
    private readonly sendEmailService: SendEmailService,
  ) {}

  /**
   * Submits contact form.
   */
  public submitForm(): void {
    if (this.contactForm.valid && !this.contactForm.pristine) {
      void this.sendMessage().subscribe();
    }
  }

  /**
   * Sends message.
   */
  public sendMessage() {
    const formData = this.contactForm.value;
    return this.sendEmailService.sendEmail(formData).pipe(
      tap(() => {
        this.closeDialog();
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
  public closeDialog(result?: unknown) {
    this.dialogRef.close(Boolean(result) ? result : 'closed');
  }
}
