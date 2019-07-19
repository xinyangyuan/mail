import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
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
  async onSignIn() {
    await this.authService._signIn(this.email.value, this.password.value).toPromise();
    this.routerService.navigate(['mails']);
  }

  // Getters
  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }
}
