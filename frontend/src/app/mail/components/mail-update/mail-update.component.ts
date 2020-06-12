import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { MatProgressButtonOptions } from 'mat-progress-buttons';

import { MailState } from '../../store/mail.state';
import * as MailAction from '../../store/mail.action';
import { Mail } from '../../models/mail.model';

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

  // Mat-Progress Button Option:
  updateBtn: MatProgressButtonOptions = {
    text: 'UPDATE',
    spinnerSize: 18,
    buttonColor: 'primary',
    spinnerColor: 'primary',
    mode: 'indeterminate',
    active: false,
    disabled: false
  };
  updateBtnDisabled: MatProgressButtonOptions = { ...this.updateBtn, disabled: true };

  // Constructor Method
  constructor(
    private store: Store,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private snackbar: MatSnackBar
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
      envelop: [null],
      contentPDF: [null]
    });

    // pdf required
    if (this.route.snapshot.url[0].path === 'uploadPdf') {
      this.contentPDF.setValidators(Validators.required);
    }
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
    this.updateBtn.active = true;
    this.store
      .dispatch(new MailAction.ModifyMail({ mail: this.mail, update: this.form }))
      .pipe(
        finalize(() => {
          this.updateBtn.active = false;
          this.router.navigate(['mails']);
        })
      )
      .subscribe(
        () => this.snackbar.open('Mail is Updated', 'CLOSE', { panelClass: ['info-snackbar'] }),
        () => this.snackbar.open('Mail Update Fail', 'CLOSE', { panelClass: ['warning-snackbar'] })
      );
  }

  // Method:
  onCancel() {
    this.store
      .dispatch(new MailAction.UneditMail())
      .subscribe(() => this.router.navigate(['/mails']));
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
