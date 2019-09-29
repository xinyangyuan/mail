import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  // Attributes
  form: FormGroup;

  // Constructor
  constructor(private fb: FormBuilder, private router: Router, public authService: AuthService) {}

  // Init Method
  ngOnInit() {
    // reactive form
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  // Method: call signUp serivce
  async onSubmit() {
    // async request: send email confirmation request to server
    await this.authService._resetPassword(this.email.value).subscribe(_ => {
      this.router.navigate(['']);
    });
  }

  // Getters
  get email() {
    return this.form.get('email');
  }
}
