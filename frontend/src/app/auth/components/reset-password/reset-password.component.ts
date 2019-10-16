import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';

import * as AuthActions from '../../store/auth.action';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  // Attributes
  form: FormGroup;
  emailToken: string;
  hide = true;

  // Constructor
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store
  ) {}

  // Init Method
  ngOnInit() {
    // get url parameters
    this.emailToken = this.route.snapshot.paramMap.get('emailToken');
    console.log(this.emailToken);
    // this.route.paramMap.subscribe(paramsMap => {
    //   this.emailToken = paramsMap.get('emailToken');
    // });

    // reactive form
    this.form = this.fb.group({
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$')
        ]
      ]
    });
  }

  // Method: verify password reset
  onReset() {
    this.store
      .dispatch(
        new AuthActions.VerifyPasswordReset({
          password: this.password.value,
          emailToken: this.emailToken
        })
      )
      .subscribe(() => this.router.navigate(['mails']));
  }

  // Getters
  get password() {
    return this.form.get('password');
  }
}
