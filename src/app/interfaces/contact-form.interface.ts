import { AbstractControl, FormGroup } from '@angular/forms';

/**
 * Contact form interface.
 */
export interface IContactForm extends FormGroup {
  controls: {
    name: AbstractControl;
    email: AbstractControl;
    header: AbstractControl;
    message: AbstractControl;
    domain: AbstractControl;
  };
}
