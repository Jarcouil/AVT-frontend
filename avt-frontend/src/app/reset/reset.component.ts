import { ResetService } from './service/reset.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { mustMatchValidator } from '../shared/directives/must-match.directive';
import { MessagesService } from '../shared/messages/messages.service';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent {
  resetForm: FormGroup;
  submit = false;
  resetToken = '';

  constructor(
    private formBuilder: FormBuilder,
    private resetService: ResetService,
    private router: Router,
    private route: ActivatedRoute,
    private messagesService: MessagesService,
    ) {
    this.resetForm = this.createForm();
    this.route.params.subscribe(params => {
      this.resetToken = params.token;
      this.VerifyToken();
    });
  }

  /**
   * Check if uploadform is valid and submit form
   *
   * @returns void
   */
   onSubmit(): void {
    this.submit = true;
    if (this.resetForm.valid) {
      this.resetService.updatePassword(this.getPassword().toString(), this.resetToken).subscribe(_ => {
        this.router.navigate(['/login']);
      });
    }
  }

  /**
   * 
   */
  VerifyToken(): void {
    this.resetService.ValidPasswordToken(this.resetToken).subscribe(result => {
      if (!result.message) {
        this.router.navigate(['/login']);
      }
    });
  }

  /**
   * Create form
   *
   * @returns Formgroup
   */
  createForm(): FormGroup {
    return this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    },
      { validator: mustMatchValidator });
  }

  /**
   * Get password from formgroup
   *
   * @returns password Formgroup
   */
   getPassword(): FormGroup {
    return this.resetForm.get('password')?.value;
  }

}
