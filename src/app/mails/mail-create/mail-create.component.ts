import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MailService } from '../mail.service';

@Component({
  selector: 'app-mail-create',
  templateUrl: './mail-create.component.html',
  styleUrls: ['./mail-create.component.css']
})
export class MailCreateComponent implements OnInit {
  form: FormGroup;

  constructor(
    public mailService: MailService,
    private fb: FormBuilder,
  ) {}

  // Init Method
  ngOnInit() {
    this.form = this.fb.group({
      title: ['', [
        Validators.required,
        Validators.minLength(3)
      ]],
      description: ['', [
        Validators.required,
        Validators.maxLength(50)
      ]],
      content: ['', [
        Validators.required
      ]]
    });
  }

  // Call mail-service to create new mail
  onAddMail() {
    this.mailService.addMail(
      this.title.value as string,
      this.description.value as string,
      this.content.value as string,
    );
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
