import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../auth.service';
import { AddressService } from 'src/app/addresses/address.service';
import { AddressInfo } from 'src/app/addresses/address-info.model';

@Component({
  selector: 'app-sign-up-sender',
  templateUrl: './sign-up-sender.component.html',
  styleUrls: ['./sign-up-sender.component.css']
})
export class SignUpSenderComponent implements OnInit {
  // Attributes
  form: FormGroup;
  myAddressInfo: any;

  // Constructor
  constructor(
    private fb: FormBuilder,
    private routerService: Router,
    public authService: AuthService, // need to be public ?
    private addressService: AddressService
  ) {}

  // Init Method
  ngOnInit() {
    // reactive form
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z]*$')]],
      lastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z]*$')]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$')
        ]
      ],
      address: ['', [Validators.required]],
      address2: ['', [Validators.required]],
      city: ['', [Validators.required]],
      zipCode: ['', [Validators.required]],
      country: ['US', Validators.required]
    });
  }

  // Method: call signUp serivce
  onSignUp() {
    // callback actions
    const addReceiver = this.addressService._createAddress(
      this.address.value,
      this.address2.value,
      this.city.value,
      this.zipCode.value,
      this.country.value
    );
    const redirect = () => this.routerService.navigate(['mails']);

    // sign-up service
    this.authService._signUp(this.email.value, this.password.value, true).subscribe(() => {
      addReceiver.subscribe(redirect);
    });
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

  get address() {
    return this.form.get('address');
  }

  get address2() {
    return this.form.get('address2');
  }

  get city() {
    return this.form.get('city');
  }

  get zipCode() {
    return this.form.get('zipCode');
  }

  get country() {
    return this.form.get('country');
  }
}
