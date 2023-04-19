import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  otpForm!: FormGroup;
  isSubmitted: boolean = false;
  showPwd: boolean = false;
  btnLogin: boolean = true;
  btnOtp: boolean = true;
  otpSent = false;

  constructor(
    private fb: FormBuilder,
    private as: AuthService,
    private alert: AlertService,
    private router: Router
  ) // private spinner: SpinnerVisibilityService
  {
    // spinner.hide();
  }

  ngOnInit() {
    this.initLoginForm();
    this.initOtpForm();
  }

  initLoginForm() {
    this.loginForm = this.fb.group({
      userName: ['ranjith@cloudinlabs.com', [Validators.required, Validators.email]],
      password: ['?1ionLrUV', [Validators.required, Validators.minLength(8), Validators.pattern(/^\S*$/)]],
      googleUser: [false],
      showPassword: [false],
      // number: [null, [Validators.required]]
    });
  }
  get loginFormControl(): any {
    return this.loginForm['controls'];
  }


  initOtpForm() {
    this.otpForm = this.fb.group({
      userId: [null, [Validators.required]],
      otp: [null, [Validators.required]]
    });
  }
  get otpFormControl(): any {
    return this.otpForm['controls'];
  }

  login() {
    if (this.loginForm.invalid) {
      this.isSubmitted = true;
      console.log(this.loginForm.value);
      return;
    }
    this.as.login(this.loginForm.value).subscribe((r: any) => {
      console.log(r);
      if (r.status) {
        this.alert.fireToastS(r.message);
        // this.otpSent = true;
        // this.otpFormControl.userId.setValue(r.response.userId);

        // localStorage.setItem('accessToken', r.response.accessToken);
        // if (localStorage.getItem('next_p') === 'cart') {
        //   this.router.navigate(['/cart']);
        // } else this.router.navigate(['/']);
      }
    });
  }

  validateForm(field: any) {
    if (((this.isSubmitted && this.loginForm.controls[field].invalid) || (this.loginForm.controls[field].invalid && (this.loginForm.controls[field].dirty || this.loginForm.controls[field].touched))) && this.loginForm.controls[field].errors) {
      return true;
    }
    return false;
  }

  validateNumber($event: any) {
    console.log($event);
    console.log($event.value.toString().length);
    if ($event.value != null && $event.value.toString().length == 10) {
      this.btnLogin = false;
    }
  }

  validateOtp($event: any) {
    console.log($event);
    console.log($event.value.toString().length);
    if ($event.value != null && $event.value.toString().length == 6) {
      this.btnOtp = false;
    }
  }

  otpVerify() {

  }
}


