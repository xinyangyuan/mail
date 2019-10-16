import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Store, Select } from '@ngxs/store';

import { AuthState } from '../../store/auth.state';
import * as AuthAction from '../../store/auth.action';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  // Attributes
  form: FormGroup;
  @Select(AuthState.authError) authError$: Observable<string>;

  // Constructor
  constructor(private fb: FormBuilder, private routerService: Router, private store: Store) {}

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
    this.store
      .dispatch(new AuthAction.SignIn({ email: this.email.value, password: this.password.value }))
      .subscribe(() => this.routerService.navigate(['mails']));
  }

  // Method: call send email verification service
  onResend() {
    this.store.dispatch(new AuthAction.ResendEmailConfirmation(this.email.value));
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
