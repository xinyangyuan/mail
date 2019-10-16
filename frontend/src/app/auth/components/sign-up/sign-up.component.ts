import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { Subscription } from 'rxjs';

import * as AuthActions from '../../store/auth.action';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit, OnDestroy {
  // Attributes
  accountTypes = ['USER', 'SENDER'];
  form: FormGroup;
  firstNameSub: Subscription;
  lastNameSub: Subscription;

  // ui:
  hide = true;

  // Constructor
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private routerService: Router,
    private store: Store
  ) {}

  // Static method
  static titleCase(text: string) {
    return text.toLowerCase().replace('/\bS/g', t => {
      return t.toUpperCase();
    });
  }

  // Init Method
  ngOnInit() {
    // activate sender account registration
    const senderEnabled = this.route.snapshot.fragment && this.route.snapshot.fragment.length > 5;

    // initialize the reactive form
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern('^[a-zA-Zs\\-]*$')]],
      lastName: ['', [Validators.required, Validators.pattern('^[a-zA-Zs\\-]*$')]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$')
        ]
      ],
      accountType: [{ value: 'USER', disabled: !senderEnabled }, Validators.required],
      isAgreed: [false, Validators.requiredTrue]
    });

    // auto captilize firstName's first letter
    this.firstNameSub = this.firstName.valueChanges.subscribe(val => {
      this.firstName.setValue(this.transformToUpperCase(val, ['-']), { emitEvent: false });
    });

    // auto capitalize lastName's first letter
    this.lastNameSub = this.lastName.valueChanges.subscribe(val => {
      this.lastName.setValue(this.transformToUpperCase(val, ['-']), { emitEvent: false });
    });
  }

  // Method: dispatch sign-up action
  onSignUp() {
    this.store
      .dispatch(
        new AuthActions.SignUp({
          firstName: this.firstName.value,
          lastName: this.lastName.value,
          email: this.email.value,
          password: this.password.value,
          role: this.accountType.value,
          code: this.route.snapshot.fragment
        })
      )
      .subscribe(() => this.routerService.navigate(['']));
  }

  // Destroy Method:
  ngOnDestroy() {
    this.firstNameSub.unsubscribe();
    this.lastNameSub.unsubscribe();
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

  get isAgreed() {
    return this.form.get('isAgreed');
  }

  // Helper:
  transformToUpperCase(str, separators) {
    separators = separators || [' '];
    const regex = new RegExp('(^|[' + separators.join('') + '])(\\w)', 'g');
    return str.replace(regex, x => {
      return x.toUpperCase();
    });
  }
}
