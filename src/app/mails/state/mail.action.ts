import { Mail } from '../mail.model';
import { Data } from '@angular/router';

/*
    Action: get mail list from API
*/

export class GetMails {
  static readonly type = '[Mail Page] Get Mails';
  constructor(public payload: { urlData: Data }) {}
}

export class GetEnvelopImage {
  static readonly type = '[Mail Page] Get Envelop Image';
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

/*
    Action: star
*/

export class StarredMail {
  static readonly type = '[Mail Page] Starred Mail';
  constructor(public payload: Mail) {}
}

export class StarredMails {
  static readonly type = '[Mail Page] Starred Mails';
  constructor(public payload: Mail[]) {}
}

export class UnStarredMail {
  static readonly type = '[Mail Page] Un-Starred Mail';
  constructor(public payload: Mail) {}
}

export class UnStarredMails {
  static readonly type = '[Mail Page] Un-Starred Mails';
  constructor(public payload: Mail[]) {}
}

/*
    Action:
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

export class ResetStore {
  static readonly type = '[Mail Page] Reset Store';
}
