import { CartService } from './../../services/cart.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
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

  userId = '';

  constructor(
    private fb: FormBuilder,
    private as: AuthService,
    private alert: AlertService,
    private router: Router,
    private cartService: CartService,
    private messageService: MessageService,
  ) { }

  ngOnInit() {
    this.initLoginForm();
    this.initOtpForm();
  }

  initLoginForm() {
    this.loginForm = this.fb.group({
      // userName: ['ranjith@cloudinlabs.com', [Validators.required, Validators.email]],
      // password: ['?1ionLrUV', [Validators.required, Validators.minLength(8), Validators.pattern(/^\S*$/)]],
      // googleUser: [false],
      // showPassword: [false],
      number: [null, [Validators.required, Validators.pattern(/^[6-9]\d{9}$/), Validators.maxLength(10), Validators.minLength(10)]]
    });
  }
  get loginFormControl(): any {
    return this.loginForm['controls'];
  }


  initOtpForm() {
    this.otpForm = this.fb.group({
      user_id: [null, [Validators.required]],
      otp: [null, [Validators.required]]
    });
  }
  get otpFormControl(): any {
    return this.otpForm['controls'];
  }

  login() {
    if (this.loginForm.invalid) {
      this.isSubmitted = true;
      // console.log(this.loginForm.value);
      return;
    }
    this.as.verifyNumber(this.loginForm.value).subscribe((r: any) => {
      if (r.status) {
        // this.alert.fireToastS(r.message);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: r.message
        })

        this.otpSent = true;
        this.otpFormControl.user_id.setValue(r.response.user_id);

        this.userId = r.response.user_id;

        // localStorage.setItem('accessToken', r.response.accessToken);
        // localStorage.setItem('userId', r.response.userId);
        // if (localStorage.getItem('next_p') === 'cart') {
        //   this.router.navigate(['/cart']);
        // } else this.router.navigate(['/']);
        // window.location.reload();
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
    if ($event.value != null && $event.value.toString().length == 10) {
      this.btnLogin = false;
    }
  }

  validateOtp($event: any) {
    if ($event.value != null && $event.value.toString().length == 6) {
      this.btnOtp = false;
    }
  }

  otpVerify() {
    if (this.otpForm.invalid) {
      // this.alert.fireToastF('Invalid OTP');
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Invalid OTP'
      })
    }
    this.as.verifyOtp(this.otpForm.value).subscribe((r: any) => {
      if (r.status) {
        // this.alert.fireToastS(r.message);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: r.message
        })

        localStorage.setItem('accessToken', r.response.access_token);
        localStorage.setItem('userId', r.response.user_id);

        if (localStorage.getItem('next_url') && localStorage.getItem('next_url') != 'undefined') {
          this.router.navigate([localStorage.getItem('next_url')]);
          localStorage.removeItem('next_url');
          setTimeout(() => {
            localStorage.removeItem('next_url');
            window.location.reload();
          }, 100)
        } else {
          window.location.reload();
        }
      }
    });
  }

  resendOtp() {
    let data = {
      user_id: this.userId
    }
    this.as.resendOTP(data).subscribe((r: any) => {
      if (r.status) {
        // this.alert.fireToastS(r.message[0]);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: r.message[0]
        })
      }
    })
  }

}


