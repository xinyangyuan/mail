import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  // Attributes
  form: FormGroup;
  needConfirmation = false;

  // Constructor
  constructor(
    private fb: FormBuilder,
    private routerService: Router,
    public authService: AuthService
  ) {}

  // Init Method
  ngOnInit() {
    // reactive form
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  // Method: call signUp serivce
  onSignIn() {
    this.authService._signIn(this.email.value, this.password.value).subscribe(
      // redirect user to dashboard
      () => this.routerService.navigate(['mails']),
      // error occured
      error => {
        if (error.error.message === 'Please verify your email address!') {
          this.needConfirmation = true;
        }
      }
    );
  }

  // Method: call send email verification service
  onResend() {
    this.needConfirmation = false;
    this.authService._sendEmailConfirmation(this.email.value).subscribe();
  }

  // Method: call forgot password
  onForgot() {
    this.routerService.navigate(['forgot-password']);
  }

  // Getters
  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }
}
