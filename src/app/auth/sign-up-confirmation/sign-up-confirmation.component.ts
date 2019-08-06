import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sign-up-confirmation',
  templateUrl: './sign-up-confirmation.component.html',
  styleUrls: ['./sign-up-confirmation.component.css']
})
export class SignUpConfirmationComponent implements OnInit {
  // Attributes
  form: FormGroup;
  accountType: string;
  emailToken: string;

  // Constructor
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public authService: AuthService
  ) {}

  // Init Method
  ngOnInit() {
    // get url parameters
    this.route.paramMap.subscribe(paramsMap => {
      this.accountType = paramsMap.get('accountType');
      this.emailToken = paramsMap.get('emailToken');
    });

    // reactive form
    this.form = this.fb.group({
      password: ['', [Validators.required]]
    });
  }

  // Method: call signUp serivce
  async onConfirm() {
    // async request: send email confirmation request to server
    await this.authService
      ._verifyEmailConfirmation(this.password.value, this.emailToken)
      .toPromise();

    // redirect user to pick address or create address
    if (this.accountType === 'user') {
      this.router.navigate(['addAddress']);
    } else if (this.accountType === 'sender') {
      this.router.navigate(['newAddress']);
    }
  }

  // Getters
  get password() {
    return this.form.get('password');
  }
}