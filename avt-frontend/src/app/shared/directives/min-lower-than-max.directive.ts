import { ValidatorFn, AbstractControl, ValidationErrors } from "@angular/forms";

export const minLowerThanMaxValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const minWaveLength = control.get('minWaveLength');
    const maxWaveLength = control.get('maxWaveLength');
  
    return minWaveLength && maxWaveLength && minWaveLength.value >= maxWaveLength.value ? { minLowerThanMaxValidator: true } : null;
  };