import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';

import * as AuthActions from '../../store/auth.action';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  // Attributes
  form: FormGroup;

  // Constructor
  constructor(private fb: FormBuilder, private router: Router, public store: Store) {}

  // Init Method
  ngOnInit() {
    // reactive form
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  // Method: call signUp serivce
  onSubmit() {
    this.store
      .dispatch(new AuthActions.ResetPassword(this.email.value))
      .subscribe(() => this.router.navigate(['']));
  }

  // Getters
  get email() {
    return this.form.get('email');
  }
}
