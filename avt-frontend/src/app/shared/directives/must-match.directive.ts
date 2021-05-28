import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

/**
 * Validate if password equals confirmed password
 *
 * @param control AbstractControl
 *
 * @returns boolean
 */
export const mustMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    return password && confirmPassword && password.value !== confirmPassword.value ? { mustMatchValidator: true } : null;
};
