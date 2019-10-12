import { Data } from '@angular/router';
import { FormGroup } from '@angular/forms';

import { Mail } from '../models/mail.model';
import { MailStatus } from '../models/mail-status.model';

/*
    Action: get mail or mail resource from API [GET]
*/

export class GetMails {
  static readonly type = '[Mail Page] Get Mails';
  constructor(public payload: Data) {} // url data
}

export class GetEnvelopImage {
  static readonly type = '[Mail Page] Get Envelop Image';
  constructor(public payload: Mail) {}
}

export class GetContentPdf {
  static readonly type = '[Mail Page] Get Content Pdf';
  constructor(public payload: Mail) {}
}

export class GetEnvelopImages {
  static readonly type = '[Mail Background Worker] Get Envelop Images';
}

export class GenerateImageTasks {
  static readonly type = '[Mail Background Worker] Generate Image Tasks';
}

export class ChangePage {
  static readonly type = '[Mail Page] Change Page';
  constructor(public payload: { currentPage: number; mailsPerPage: number; urlData: Data }) {}
}

// service dispatched action
export class UpdateMail {
  static readonly type = '[Mail Service] Update Mail';
  constructor(
    public payload: {
      mail: Mail;
      update: { flags?: { star?: boolean; read?: boolean; issue?: boolean }; status?: MailStatus };
    }
  ) {}
}

// service dispatched action
export class UpdateMails {
  static readonly type = '[Mail Service] Update Mails';
  constructor(
    public payload: {
      mails: Mail[];
      update: { flags?: { star?: boolean; read?: boolean; issue?: boolean }; status?: MailStatus };
    }
  ) {}
}

/*
    Action: create new mail [POST]
*/

export class SendMail {
  static readonly type = '[Mail Create Page] Send Mail';
  constructor(public payload: FormGroup) {}
}

/*
    Action: modify a mail [PUT]
*/

export class ModifyMail {
  static readonly type = '[Mail Edit Page] Modify Mail Contents';
  constructor(public payload: { mail: Mail; update: FormGroup }) {}
}

/*
    Action: toggle star flag(s)
*/

export class ToggleMailStarFlag {
  static readonly type = '[Mail Page] Toggle Mail Star Flag';
  constructor(public payload: Mail) {}
}

export class StarredMails {
  static readonly type = '[Mail Page] Starred Mails';
  constructor(public payload: Mail[]) {}
}

export class UnstarredMails {
  static readonly type = '[Mail Page] Unstarred Mails';
  constructor(public payload: Mail[]) {}
}

/*
    Action: toggle read flag(s)
*/

export class ToggleMailReadFlag {
  static readonly type = '[Mail Page] Toggle Mail Read Flag';
  constructor(public payload: Mail) {}
}

export class ReadMails {
  static readonly type = '[Mail Page] Read Mails';
  constructor(public payload: Mail[]) {}
}

export class UnreadMails {
  static readonly type = '[Mail Page] Unread Mails';
  constructor(public payload: Mail[]) {}
}

/*
    Action: scan mail(s)
*/

export class ScanMail {
  static readonly type = '[Mail Page] Scan Mail';
  constructor(public payload: Mail) {}
}

export class ScanMails {
  static readonly type = '[Mail Page] Scan Mails';
  constructor(public payload: Mail[]) {}
}

/*
    Action: un-scan mail(s)
*/

export class UnscanMail {
  static readonly type = '[Mail Page] Skip Scan Mail';
  constructor(public payload: Mail) {}
}

export class UnscanMails {
  static readonly type = '[Mail Page] Skip Scan Mails';
  constructor(public payload: Mail[]) {}
}

/*
    Action: issue mail TODO: find better name for the action
*/

export class IssueMail {
  static readonly type = '[Mail Page] Issue a Mail';
  constructor(public payload: Mail) {}
}

/*
    Action: edit a mail
*/

export class EditMail {
  static readonly type = '[Mail Page] Edit a Mail';
  constructor(public payload: Mail) {}
}

export class UneditMail {
  static readonly type = '[Mail Edit Page] Unedit a Mail';
}

/*
    Action: select/stage mail
*/

export class SelectMail {
  static readonly type = '[Mail Page] Select a Mail';
  constructor(public payload: Mail) {}
}

export class UnselectMail {
  static readonly type = '[Mail Page] Unselect a Mail';
  constructor(public payload: Mail) {}
}

export class SelectAllMails {
  static readonly type = '[Mail Page] Select All Mails';
}

export class UnselectAllMails {
  static readonly type = '[Mail Page] Unselect All Mails';
}

/*
    Action: delete mail
*/

export class DeleteMail {
  static readonly type = '[Mail Page] Delete Mail';
  constructor(public payload: Mail) {}
}

export class DeleteMails {
  static readonly type = '[Mail Page] Delete Mails';
  constructor(public payload: Mail[]) {}
}

/*
    Action:
*/

export class ResetMailList {
  static readonly type = '[Mail Page] Reset Mail List';
}

export class ResetStore {
  static readonly type = '[Mail Page] Reset Store';
}
