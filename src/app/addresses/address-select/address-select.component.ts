import { Component, OnInit } from '@angular/core';
import { Address } from '../address.model';
import { AddressService } from '../address.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-address-select',
  templateUrl: './address-select.component.html',
  styleUrls: ['./address-select.component.css']
})
export class AddressSelectComponent implements OnInit {
  // Attributes
  addressList: Address[];
  address: Address;
  isLoading = false;

  // Constructor
  constructor(public addressService: AddressService, private router: Router) {}

  // Init method:
  ngOnInit() {
    this.addressService._getAddressList().subscribe(res => {
      this.addressList = res.addressList;
    });
  }

  // Method: update the selected address
  onOptionChange(value) {
    this.address = value;
  }

  // Method: add the selected address to user doc & add new receiver to selected address
  onSelect() {
    this.addressService._addReceiver(this.address._id).subscribe(_ => {
      this.router.navigate(['mails']);
    });
  }
}
