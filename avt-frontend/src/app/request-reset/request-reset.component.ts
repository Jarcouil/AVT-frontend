import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResetService } from '../reset/service/reset.service';

@Component({
  selector: 'app-request-reset',
  templateUrl: './request-reset.component.html',
  styleUrls: ['./request-reset.component.css']
})
export class RequestResetComponent {

  requestForm: FormGroup;
  submit = false;

  constructor(
    private formBuilder: FormBuilder,
    private resetService: ResetService,
    ) {
    this.requestForm = this.createForm();
  }

  /**
   * Check if uploadform is valid and submit form
   *
   * @returns void
   */
  onSubmit(): void {
    this.submit = true;
    if (this.requestForm.valid) {
      const formData: any = new FormData();
      formData.append('email', this.getEmail());

      this.resetService.requestReset(formData).subscribe();
    }
  }

  /**
   * Create form
   *
   * @returns Formgroup
   */
  createForm(): FormGroup {
    return this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  /**
   * Get email from formgroup
   *
   * @returns email Formgroup
   */
  getEmail(): FormGroup {
    return this.requestForm.get('email')?.value;
  }
}
