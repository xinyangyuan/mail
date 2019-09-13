import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MailService } from '../mail.service';
import { AddressService } from 'src/app/addresses/address.service';
import { Router } from '@angular/router';
import { MatProgressButtonOptions } from 'mat-progress-buttons';

@Component({
  selector: 'app-mail-create',
  templateUrl: './mail-create.component.html',
  styleUrls: ['./mail-create.component.css']
})
export class MailCreateComponent implements OnInit {
  // Attributes
  public form: FormGroup;
  public receiverList: [{ _id: string; name: { first: string; last: string } }];

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
    private mailService: MailService,
    private fb: FormBuilder,
    private addressService: AddressService,
    private routerService: Router
  ) {}

  // Init Method
  ngOnInit() {
    // get the list of receivers
    // this.addressService._getMyAddressInfo().subscribe(res => {
    //   // this.receiverList = res.addressInfo.receiverIds;
    // });

    // initialize the reactive form
    this.form = this.fb.group({
      recipient: ['', Validators.required],
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.maxLength(50)]],
      content: ['', [Validators.required]],
      envelop: ['', [Validators.required]]
    });
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

  // add envelop image to the form-controll
  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.envelop.setValue(file);
    // notice form of the update
    this.envelop.updateValueAndValidity();
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
