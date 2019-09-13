import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  Input,
  OnChanges
} from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { tap, map, startWith } from 'rxjs/operators';
import { Select, Store } from '@ngxs/store';

import { Address } from '../address.model';
import { AddressState } from '../store/address.state';
import * as AddressActions from '../store/address.action';

@Component({
  selector: 'app-address-select-form',
  templateUrl: './address-select-form.component.html',
  styleUrls: ['./address-select-form.component.css']
})
export class AddressSelectFormComponent implements OnInit, OnChanges, OnDestroy {
  // Attributes
  private addressValue: Address;
  private mailboxValue: string;
  @Output() addressChange = new EventEmitter<Address>();
  @Output() mailboxChange = new EventEmitter<string>();

  // form
  form: FormGroup;
  @Output() formStatus = new EventEmitter<string>();

  // auto-complete
  @Select(AddressState.addresses) addresses$: Observable<Address[]>;
  @Select(AddressState.vacantMailboxNos) vacantMailboxNos$: Observable<number[]>;
  vacantMailboxNos: number[] = [];
  filteredMailboxes$: Observable<string[]>;
  addressFormControlSub: Subscription;

  // Constructor:
  constructor(private store: Store, private fb: FormBuilder) {
    // initialized form
    this.form = this.fb.group({
      address: ['', Validators.required], // address object
      mailbox: ['', [Validators.required, this._mailboxValidator()]]
    });
  }

  // Init method:
  ngOnInit() {
    // fetch address list from api
    this.store.dispatch(new AddressActions.GetAddresses());

    // fetch vacant mailboxe of the selected address
    this.addressFormControlSub = this._address.valueChanges.subscribe(value => {
      // filter null value
      if (value) {
        this.store.dispatch(new AddressActions.GetVacantMailboxNos(this._address.value));
      }
    });

    // filtered mailboxes
    const selectedMailbox$: Observable<string> = this._mailbox.valueChanges.pipe(
      startWith(typeof this.mailbox !== 'undefined' ? this.mailbox : '')
    );
    const vancantMaiboxes$: Observable<string[]> = this.vacantMailboxNos$.pipe(
      tap(vacantMailboxNos => (this.vacantMailboxNos = vacantMailboxNos)), // save latest vacant mailboxes to attribute [for validation]
      map(vacantMailboxNos => vacantMailboxNos.map(String)) // number[] => string[]
    );
    this.filteredMailboxes$ = combineLatest([vancantMaiboxes$, selectedMailbox$]).pipe(
      map(([vacantMailboxes, selectedMailbox]) => this._filter(vacantMailboxes, selectedMailbox))
    );

    // update local values and notify parent on control value change
    this._address.valueChanges.forEach(value => (this.address = value));
    this._mailbox.valueChanges.forEach(value => (this.mailbox = value));
    this.form.statusChanges.forEach(value => this.formStatus.emit(value));
  }

  // Change Hook:
  ngOnChanges() {
    // Update local values on parent change
    this._address.setValue(this.addressValue);
    this._mailbox.setValue(this.mailboxValue);
  }

  // Method: form submit
  onSubmit() {
    this.store.dispatch(
      new AddressActions.SelectMailbox({
        address: this._address.value,
        mailboxNo: Number(this._mailbox.value)
      })
    );
    this.form.reset();
  }

  // Destroy Method:
  ngOnDestroy() {
    this.addressFormControlSub.unsubscribe();
  }

  // Helper:
  compareIds(address1: Address | null, address2: Address | null) {
    try {
      return address1._id === address2._id;
    } catch {
      return false;
    }
  }

  // Heler: mailbox auto-complete filter
  private _filter(mailboxes: string[], selectedMailbox: string) {
    return mailboxes.filter(mailbox => mailbox.indexOf(selectedMailbox) === 0);
  }

  // Helper: mailbox selection validator
  private _mailboxValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      return this.vacantMailboxNos.includes(+control.value)
        ? null
        : { unavalableMailbox: { value: control.value } };
    };
  }

  // Getters & Setters
  get _address() {
    return this.form.get('address');
  }

  @Input()
  get address() {
    return this.addressValue;
  }

  set address(value) {
    this.addressValue = value;
    this.addressChange.emit(this.addressValue);
  }

  get _mailbox() {
    return this.form.get('mailbox');
  }

  @Input()
  get mailbox() {
    return this.mailboxValue;
  }

  set mailbox(value) {
    this.mailboxValue = value;
    this.mailboxChange.emit(this.mailboxValue);
  }
}
