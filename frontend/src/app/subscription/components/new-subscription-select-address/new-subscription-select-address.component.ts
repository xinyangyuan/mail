import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Select } from '@ngxs/store';

import { Address } from 'src/app/address/models/address.model';
import { SubscriptionQuery } from '../../store/subscription.query';

@Component({
  selector: 'app-new-subscription-select-address',
  templateUrl: './new-subscription-select-address.component.html',
  styleUrls: ['./new-subscription-select-address.component.css']
})
export class NewSubscriptionSelectAddressComponent implements OnInit {
  // Attributes:
  address: Address;
  mailbox: string;
  formStatus: string;
  @ViewChild('addressForm', { static: false }) addressForm;
  @Select(SubscriptionQuery.selectedMailbox) selectedMailbox$: Observable<{
    address: Address;
    mailboxNo: number;
  }>;

  // Constructor:
  constructor(private router: Router) {}

  // Init Method:
  ngOnInit() {
    this.selectedMailbox$.pipe(take(1)).subscribe(selectedMailbox => {
      // this will lead to memory leak if observable never emit
      if (selectedMailbox) {
        this.address = selectedMailbox.address;
        this.mailbox = String(selectedMailbox.mailboxNo);
      }
    });
  }

  // Method: handle form status change
  handleFormStatus(formStatus: string) {
    this.formStatus = formStatus === 'VALID' ? 'VALID' : 'TOUCHED';
  }

  // Method: on next
  onNext() {
    this.addressForm.onSubmit();
    this.router.navigate([], { fragment: 'select-plan' });
  }
}
