import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MailService } from '../mail.service';
import { AddressService } from 'src/app/addresses/address.service';

@Component({
  selector: 'app-mail-create',
  templateUrl: './mail-create.component.html',
  styleUrls: ['./mail-create.component.css']
})
export class MailCreateComponent implements OnInit {
  // Attributes
  public form: FormGroup;
  public receiverList: string[];

  // Constructor Method
  constructor(
    private mailService: MailService,
    private fb: FormBuilder,
    private addressService: AddressService
  ) {}

  // Init Method
  ngOnInit() {
    // get the list of receivers
    this.addressService._getMyAddressInfo().subscribe(res => {
      console.log(res.addressInfo);
      this.receiverList = res.addressInfo.receiverIds;
    });

    // initialize the reactive form
    this.form = this.fb.group({
      recipient: ['', Validators.required],
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.maxLength(50)]],
      content: ['', [Validators.required]]
    });
  }

  // Call mail-service to create new mail
  onAddMail() {
    // this.mailService.addMail(
    //   this.title.value as string,
    //   this.description.value as string,
    //   this.content.value as string
    // );
  }

  // Getters
  get title() {
    return this.form.get('title');
  }

  get description() {
    return this.form.get('description');
  }

  get content() {
    return this.form.get('content');
  }
}
