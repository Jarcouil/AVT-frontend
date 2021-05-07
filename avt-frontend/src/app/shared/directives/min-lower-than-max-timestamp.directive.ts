import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

/**
 * Validate if min is lower than max
 *
 * @param control AbstractControl
 *
 * @returns boolean
 */
export const minLowerThanMaxTimestampValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const minTimestamp = control.get('minTimestamp');
  const maxTimestamp = control.get('maxTimestamp');

  return minTimestamp && maxTimestamp && minTimestamp.value > maxTimestamp.value ? { minLowerThanMaxTimestampValidator: true } : null;
};
