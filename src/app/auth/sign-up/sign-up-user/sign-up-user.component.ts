import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { Address } from 'src/app/addresses/address.model';
import { AddressService } from 'src/app/addresses/address.service';
import { Subscription } from 'rxjs';
import { flatMap } from 'rxjs/operators';

@Component({
  selector: 'app-sign-up-user',
  templateUrl: './sign-up-user.component.html',
  styleUrls: ['./sign-up-user.component.css']
})
export class SignUpUserComponent implements OnInit {
  // Attributes
  form: FormGroup;
  addressList: Address[] = [];
  myAddress: Address;
  addressServiceSub: Subscription;
  authServiceStatusSub: Subscription;

  // Constructor
  constructor(
    private fb: FormBuilder,
    private routerService: Router,
    public authService: AuthService, // need to be public ?
    public addressService: AddressService
  ) {}

  // Init Method
  ngOnInit() {
    // get the list of addresses
    this.addressService._getAddressList().subscribe(res => (this.addressList = res.addressList));

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
      address: ['', Validators.required]
    });
  }

  // Method: call signUp serivce
  onSignUp() {
    // callback actions
    const addReceiver = this.addressService._addReceiver(this.address.value);
    const redirect = () => this.routerService.navigate(['mails']);

    // sign-up service
    this.authService._signUp(this.email.value, this.password.value, false).subscribe(() => {
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
}
