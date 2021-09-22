import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

/**
 * Validate if min is lower than max
 *
 * @param control AbstractControl
 *
 * @returns boolean
 */
export const minLowerThanMaxWavelengthValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const minWaveLength = control.get('minWavelength');
  const maxWaveLength = control.get('maxWavelength');

  return minWaveLength && maxWaveLength && minWaveLength.value > maxWaveLength.value ? { minLowerThanMaxWavelengthValidator: true } : null;
};
