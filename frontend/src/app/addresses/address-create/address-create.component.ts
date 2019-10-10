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
      line1: ['', [Validators.required]],
      line2: [''],
      city: ['', [Validators.required]],
      zip: ['', [Validators.required]],
      country: ['US', Validators.required]
    });
  }

  // Method: create new address in database
  onSubmit() {
    this.addressService
      ._createAddress(
        this.line1.value,
        this.city.value,
        this.zip.value,
        this.country.value,
        this.line2.value
      )
      .subscribe(_ => this.router.navigate(['mails']));
  }

  // Getters:
  get line1() {
    return this.form.get('line1');
  }

  get line2() {
    return this.form.get('line2');
  }

  get city() {
    return this.form.get('city');
  }

  get zip() {
    return this.form.get('zip');
  }

  get country() {
    return this.form.get('country');
  }
}
