import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { LoginService } from './services/login.service';
import { User } from '../account/user';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  constructor(
    public fb: FormBuilder,
    private auth: AuthService,
    private loginService: LoginService,
    private router: Router
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  /**
   * On init
   *
   * @returns void
   */
  ngOnInit(): void {
    if (this.auth.getToken()) {
      this.router.navigate(['measurements']);
    }
  }

  /**
   * Login with loginService and redirect to measurements
   *
   * @returns void
   */
  login(): void {
    const formValues = this.form.value;
    if (this.form.valid) {
      this.loginService.login(formValues).subscribe(
        (res: any) => {
          if (res.accessToken) {
            this.setResponseInLocalStorage(res);
            this.router.navigate(['measurements']);
          }
        }, err => {
          console.log(err);
        }
      );
    }
  }

  /**
   * Set response data in local storage
   * @param res any
   */
  setResponseInLocalStorage(res: any): any {
    this.auth.setDataInLocalStorage('accessToken', res.accessToken);
    this.auth.setDataInLocalStorage('timer', JSON.stringify(Date.now() + 60 * 60 * 1000));
    const user: User = { id: res.id, username: res.username, email: res.email, isAdmin: res.isAdmin, createdAt: res.createdAt };
    this.auth.setUserInLocalStorage(user);
  }
}
