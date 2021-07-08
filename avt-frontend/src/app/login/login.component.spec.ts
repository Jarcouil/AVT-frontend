import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { LoginService } from './services/login.service';
import { RouterModule } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  const credentials = {
    username: 'test',
    password: '123456'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forRoot([])
      ],
      providers: [
        FormBuilder
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a login form', () => {
    fixture.detectChanges();
    const compiled: HTMLElement = fixture.nativeElement;
    const h2 = compiled.querySelector('h2');
    if (h2) {
      expect(h2.textContent).toEqual('Log in');
    }
  });

  it('should be an invalid form when empty', () => {
    expect(component.form.valid).toEqual(false);
  });
  
  it('should set the form and be valid', () => {
    component.form.controls['username'].setValue(credentials.username);
    component.form.controls['password'].setValue(credentials.password);
    expect(component.form.value['username']).toEqual(credentials.username);
    expect(component.form.value['password']).toEqual(credentials.password);
    expect(component.form.valid).toEqual(true);
  });

  it('should call login function of service with valid form', () => {
    const loginService = fixture.debugElement.injector.get(LoginService);
    const loginSpy = spyOn(loginService , 'login').and.callThrough();

    component.form.controls['username'].setValue(credentials.username);
    component.form.controls['password'].setValue(credentials.password);
    component.login();
    expect(loginSpy).toHaveBeenCalledTimes(1); // check that service is called once
  });
});
