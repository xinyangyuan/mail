import { Selector } from '@ngxs/store';

import { MailState, MailStateModel } from './mail.state';
import { Mail } from '../models/mail.model';
import { AuthState } from 'src/app/auth/store/auth.state';
import { MailRoutes } from '../models/mail-route.model';

export class MailQuery {
  /*
   Selector: mails in current view category
  */

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

  /*
   Selector: mails-count in current view category
  */

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

  /*
   Selector: mail routes for current sign-in user role
  */

  @Selector([AuthState.isSender])
  static routes(isSender: boolean) {
    // Routes
    const routesList: MailRoutes[] = [
      {
        userRole: 'USER',
        routes: [
          { name: 'Inbox', routerLink: '', icon: 'inbox' },
          { name: 'Starred', routerLink: '', icon: 'star_border' },
          { name: 'Scanning', routerLink: '', icon: 'directions_run' },
          { name: 'Scanned', routerLink: '', icon: 'drafts' },
          { name: 'Scan rejected', routerLink: '', icon: 'mail' }
        ]
      },
      {
        userRole: 'SENDER',
        routes: [
          { name: 'Send', routerLink: '', icon: 'send' },
          { name: 'Waiting for scan', routerLink: '', icon: 'directions_run' },
          { name: 'Scanned', routerLink: '', icon: 'drafts' },
          { name: 'Scan rejected', routerLink: '', icon: 'mail' }
        ]
      }
    ];

    // Routes for current user
    const userRole = isSender ? 'SENDER' : 'USER';
    return routesList.find(routes => routes.userRole === userRole).routes;
  }
}
