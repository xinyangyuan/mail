import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';

import { MailState } from '../store/mail.state';
import * as MailAction from '../store/mail.action';
import { Mail } from '../mail.model';

@Component({
  selector: 'app-mail-update',
  templateUrl: './mail-update.component.html',
  styleUrls: ['./mail-update.component.css']
})
export class MailUpdateComponent implements OnInit {
  // Attributes
  mail: Mail;
  form: FormGroup;
  editMode: boolean;

  // Constructor Method
  constructor(
    private store: Store,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  // Init Method
  ngOnInit() {
    this.mail = this.store.selectSnapshot(MailState.editedMail);
    this.editMode = this.route.snapshot.url[0].path === 'edit';

    // initialize the reactive form
    this.form = this.fb.group({
      title: [
        { value: this.mail.title, disabled: !this.editMode },
        [Validators.required, Validators.minLength(3)]
      ],
      description: [
        { value: this.mail.description, disabled: !this.editMode },
        [Validators.required, Validators.maxLength(50)]
      ],
      content: [{ value: this.mail.content, disabled: !this.editMode }, [Validators.required]],
      envelop: '',
      contentPDF: ['']
    });
  }

  // add envelop image to the form-controll
  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.envelop.setValue(file);
    // notice form of the update
    this.envelop.updateValueAndValidity();
  }

  // add mail content to the form-controll
  onPDFPicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.contentPDF.setValue(file);
    // notice form of the update
    this.contentPDF.updateValueAndValidity();
  }

  // Method:
  onUpdate() {
    this.store.dispatch(new MailAction.ModifyMail({ mail: this.mail, update: this.form }));
    this.router.navigate(['mails']); // unwait redirect
  }

  // Method:
  onCancel() {
    this.store.dispatch(new MailAction.UneditMail());
    this.router.navigate(['/mails']); // unwait redirect
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

  get contentPDF() {
    return this.form.get('contentPDF');
  }
}
