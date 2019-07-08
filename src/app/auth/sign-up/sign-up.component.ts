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
  form: FormGroup;

  // Constructor
  constructor(
    private fb: FormBuilder,
    private routerService: Router,
    public authService: AuthService // need to be public ?
  ) {}

  // Init Method
  ngOnInit() {
    // reactive form
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$')
        ]
      ]
    });
  }

  // Method: call signUp serivce
  onSignUp() {
    this.authService.signUp(this.email.value, this.password.value);
    this.routerService.navigate(['/mails']);
  }

  // Getters
  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }
}
