import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';

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
    public authService: AuthService
  ) {}

  // Init Method
  ngOnInit() {
    // get url parameters
    this.route.paramMap.subscribe(paramsMap => {
      this.emailToken = paramsMap.get('emailToken');
    });

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

  // Method: call signUp serivce
  async onReset() {
    // async request: send email confirmation request to server
    await this.authService
      ._verifyReset(this.password.value, this.emailToken)
      .subscribe(() => this.router.navigate(['mails']));
  }

  // Getters
  get password() {
    return this.form.get('password');
  }
}
