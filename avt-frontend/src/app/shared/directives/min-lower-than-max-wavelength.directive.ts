import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

/**
 * Validate if min is lower than max
 *
 * @param control AbstractControl
 *
 * @returns boolean
 */
export const minLowerThanMaxWaveLengthValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const minWaveLength = control.get('minWaveLength');
  const maxWaveLength = control.get('maxWaveLength');

  return minWaveLength && maxWaveLength && minWaveLength.value > maxWaveLength.value ? { minLowerThanMaxWaveLengthValidator: true } : null;
};
