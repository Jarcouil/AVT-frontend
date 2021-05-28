import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../account/user';
import { MessagesService } from '../shared/messages/messages.service';
import { RegisterService } from './service/register.service';
import { mustMatchValidator } from './../shared/directives/must-match.directive';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css']
})
export class RegisterUserComponent {

  registerForm: FormGroup;
  submit = false;
  user!: User;

  constructor(
    private formBuilder: FormBuilder,
    private messagesService: MessagesService,
    private registerService: RegisterService,
    private router: Router
    ) {
    this.registerForm = this.createForm();
  }

  /**
   * Check if uploadform is valid and submit form
   *
   * @returns void
   */
   onSubmit(): void {
    this.submit = true;
    if (this.registerForm.valid) {
      const formData: any = new FormData();
      formData.append('username', this.getUsername());
      formData.append('email', this.getEmail());
      formData.append('password', this.getPassword());
      formData.append('confirmPassword', this.getConfirmPassword());

      this.registerService.register(formData).subscribe(user => {
        this.user = user;
        this.router.navigate(['/login']);
      });
    }
  }

  /**
   * Create form
   *
   * @returns Formgroup
   */
  createForm(): FormGroup {
    return this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    },
    { validator: mustMatchValidator });
  }

  /**
   * Get Username from formgroup
   *
   * @returns username Formgroup
   */
  getUsername(): FormGroup {
    return this.registerForm.get('username')?.value;
  }

  /**
   * Get email from formgroup
   *
   * @returns email Formgroup
   */
   getEmail(): FormGroup {
    return this.registerForm.get('email')?.value;
  }

  /**
   * Get password from formgroup
   *
   * @returns password Formgroup
   */
   getPassword(): FormGroup {
    return this.registerForm.get('password')?.value;
  }

  /**
   * Get confirmPassword from formgroup
   *
   * @returns confirmPassword Formgroup
   */
   getConfirmPassword(): FormGroup {
    return this.registerForm.get('confirmPassword')?.value;
  }
}
