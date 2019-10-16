import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import * as jwtDecode from 'jwt-decode';
import { MatProgressButtonOptions } from 'mat-progress-buttons';

import { MailService } from '../../mail.service';
import { AddressService } from 'src/app/address/address.service';
import { AuthState } from 'src/app/auth/store/auth.state';
import { Receiver } from 'src/app/address/models/receivers.model';

@Component({
  selector: 'app-mail-create',
  templateUrl: './mail-create.component.html',
  styleUrls: ['./mail-create.component.css']
})
export class MailCreateComponent implements OnInit, AfterViewInit {
  // Attributes
  public form: FormGroup;
  public receiverList: Receiver[];

  // File upload button ui
  public fileAttached = false;
  public fileBtnHovered = false;

  // Mat-Progress Button Option:
  sendBtn: MatProgressButtonOptions = {
    text: 'SEND',
    stroked: true,
    spinnerSize: 18,
    buttonColor: 'primary',
    spinnerColor: 'primary',
    mode: 'indeterminate',
    active: false,
    disabled: false
  };
  sendBtnDisabled: MatProgressButtonOptions = { ...this.sendBtn, disabled: true };

  // Constructor Method
  constructor(
    private fb: FormBuilder,
    private store: Store,
    private routerService: Router,
    private mailService: MailService,
    private addressService: AddressService
  ) {}

  // Init Method
  ngOnInit() {
    // Initialize the reactive form
    this.form = this.fb.group({
      recipient: ['', Validators.required],
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.maxLength(50)]],
      content: ['', [Validators.required]],
      envelop: ['', [Validators.required]]
    });
  }

  async ngAfterViewInit() {
    // Get the list of receivers TEMP: TO REMOVE
    const token = this.store.selectSnapshot(AuthState.token);
    const { userId } = jwtDecode(token);
    const { address: addresss } = await this.addressService
      ._getAddressBySenderId(userId)
      .toPromise();
    const { address } = await this.addressService._getReceivers(addresss).toPromise();
    this.receiverList = address.receivers;
  }

  // Call mail-service to create new mail
  onAddMail() {
    this.sendBtn.active = true;
    this.mailService
      ._createMail(
        this.recipient.value,
        this.title.value,
        this.description.value,
        this.content.value,
        this.envelop.value
      )
      .subscribe(() => {
        this.sendBtn.active = false;
        this.routerService.navigate(['mails']);
      });
  }

  // Add envelop image to the form-controll
  onImagePicked(event: Event) {
    // get uploaded file
    const file = (event.target as HTMLInputElement).files[0];
    // notice form of the update
    this.envelop.setValue(file);
    this.envelop.updateValueAndValidity();
    // notify file is uploaded
    console.log(this.envelop);
    this.fileAttached = true;
  }

  // Getters
  get recipient() {
    return this.form.get('recipient');
  }

  get title() {
    return this.form.get('title');
  }

  get description() {
    return this.form.get('description');
  }

  get content() {
    return this.form.get('content');
  }

  get envelop() {
    return this.form.get('envelop');
  }
}
