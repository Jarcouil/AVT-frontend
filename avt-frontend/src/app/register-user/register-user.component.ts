import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../account/user';
import { MessagesService } from '../shared/messages/messages.service';
import { RegisterService } from './service/register.service';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css']
})
export class RegisterUserComponent implements OnInit {

  submit = false;
  registerForm: FormGroup;
  user!: User;

  constructor(
    private formBuilder: FormBuilder,
    private messagesService: MessagesService,
    private registerService: RegisterService,
    private router: Router
    ) {
    this.registerForm = this.createForm();
  }

  ngOnInit(): void {
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
      formData.append('isAdmin', this.getAdmin());
      formData.append('password', this.getPassword());

      this.registerService.register(formData).subscribe(user => {
        this.user = user;
        this.router.navigate(['/users']);
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
      isAdmin: [0, [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    },
    );
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
   * Get admin from formgroup
   *
   * @returns admin Formgroup
   */
   getAdmin(): FormGroup {
    return this.registerForm.get('isAdmin')?.value;
  }

  /**
   * Get password from formgroup
   *
   * @returns password Formgroup
   */
   getPassword(): FormGroup {
    return this.registerForm.get('password')?.value;
  }
}
