import { Selector } from '@ngxs/store';

import { MailState, MailStateModel } from './mail.state';
import { Mail } from '../mail.model';

export class MailQuery {
  @Selector([MailState.mailList, MailState.currentPage, MailState.mailsPerPage, MailState.urlData])
  static mails(
    mailList: MailStateModel['mailList'],
    currentPage: MailStateModel['currentPage'],
    mailsPerPage: MailStateModel['mailsPerPage'],
    urlData: MailStateModel['urlData']
  ) {
    const startIndex = (currentPage - 1) * mailsPerPage;
    const stopIndex = currentPage * mailsPerPage;

    return mailList
      .filter(
        mail =>
          Object.entries(urlData).length === 0 ||
          mail.flags.star === urlData.star ||
          mail.flags.read === urlData.read ||
          mail.flags.issue === urlData.issue ||
          mail.status === urlData.status
      )
      .slice(startIndex, stopIndex);
  }

  @Selector([MailState.mailCount, MailState.mailList, MailState.urlData])
  static mailCount(
    mailCount: MailStateModel['mailCount'],
    mailList: MailStateModel['mailList'],
    urlData: MailStateModel['urlData']
  ) {
    const adjustedMailList: Mail[] = mailList.filter(
      mail =>
        Object.entries(urlData).length === 0 ||
        mail.flags.star === urlData.star ||
        mail.flags.read === urlData.read ||
        mail.flags.issue === urlData.issue ||
        mail.status === urlData.status
    );
    const adjustment = adjustedMailList.length - mailList.length;
    return mailCount + adjustment;
  }
}
