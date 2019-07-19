import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  // Attributes
  accountTypes = ['user', 'sender'];
  form: FormGroup;
  authServiceStatusSub: Subscription;

  // Constructor
  constructor(
    private fb: FormBuilder,
    private routerService: Router,
    private authService: AuthService // need to be public ?
  ) {}

  // Init Method
  ngOnInit() {
    // initialize the reactive form
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern('^[a-zA-Zs]*$')]],
      lastName: ['', [Validators.required, Validators.pattern('^[a-zA-Zs]*$')]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$')
        ]
      ],
      accountType: ['user', Validators.required]
    });
  }

  // Method: call signUp serivce
  onSignUp() {
    // async operations: add user and add user to the address receiver list
    this.authService
      ._signUp(
        this.firstName.value,
        this.lastName.value,
        this.email.value,
        this.password.value,
        this.accountType.value === 'sender'
      )
      .subscribe();

    // immediately re-direct the user to sign-in page without listening to the server cb
    this.routerService.navigate(['']);
  }

  // Getters
  get firstName() {
    return this.form.get('firstName');
  }

  get lastName() {
    return this.form.get('lastName');
  }

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

  get accountType() {
    return this.form.get('accountType');
  }
}
