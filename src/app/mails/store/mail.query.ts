import { Selector } from '@ngxs/store';
import { MailState, MailStateModel } from './mail.state';

export class MailQuery {
  @Selector([MailState.mailList, MailState.currentPage, MailState.mailsPerPage])
  static mails(
    mailList: MailStateModel['mailList'],
    currentPage: MailStateModel['currentPage'],
    mailsPerPage: MailStateModel['mailsPerPage']
  ) {
    const startIndex = (currentPage - 1) * mailsPerPage;
    const stopIndex = currentPage * mailsPerPage;
    return mailList.slice(startIndex, stopIndex);
  }
}
