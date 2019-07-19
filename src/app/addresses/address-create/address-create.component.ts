import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AddressService } from '../address.service';

@Component({
  selector: 'app-address-create',
  templateUrl: './address-create.component.html',
  styleUrls: ['./address-create.component.css']
})
export class AddressCreateComponent implements OnInit {
  // Attributes
  form: FormGroup;

  // Constructor
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private addressService: AddressService
  ) {}

  // Init Method
  ngOnInit() {
    // reactive form
    this.form = this.fb.group({
      address: ['', [Validators.required]],
      address2: ['', [Validators.required]],
      city: ['', [Validators.required]],
      zipCode: ['', [Validators.required]],
      country: ['US', Validators.required]
    });
  }

  // Method: create new address in database
  onSubmit() {
    this.addressService
      ._createAddress(
        this.address.value,
        this.address2.value,
        this.city.value,
        this.zipCode.value,
        this.country.value
      )
      .subscribe(_ => this.router.navigate(['mails']));
  }

  // Getters:
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
