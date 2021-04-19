import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { LoginService } from './services/login.service';
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

  ngOnInit(): void {
    if (this.auth.getToken()) {
      this.router.navigate(['measurement']);
    }
  }

  login(): void {
    const formValues = this.form.value;
    if (this.form.valid) {
      this.loginService.login(formValues).subscribe(
        (res: any) => {
          if (res.token) {
            this.auth.setDataInLocalStorage('token', res.access_token);
            this.router.navigate(['measurements']);
          }
        }, err => {
          console.log(err);
        }
      );
    }
  }

  logout(): void {
    this.auth.logout();
  }
}
