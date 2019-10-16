import { Selector } from '@ngxs/store';

import { MailState, MailStateModel } from './mail.state';
import { Mail } from '../models/mail.model';
import { MailRoutes } from '../models/mail-route.model';
import { AccountState } from 'src/app/account/store/account.state';

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

  @Selector([AccountState.userRole])
  static routes(userRole: 'USER' | 'SENDER') {
    // Routes
    const routesList: MailRoutes[] = [
      {
        userRole: 'USER',
        routes: [
          { name: 'Inbox', routerLink: '/mails', icon: 'inbox' },
          { name: 'Starred', routerLink: '/stared', icon: 'star_border' },
          { name: 'Scanning', routerLink: '/scanning', icon: 'directions_run' },
          { name: 'Scanned', routerLink: '/scanned', icon: 'drafts' },
          { name: 'Scan rejected', routerLink: '/skip-scanned', icon: 'mail' }
        ]
      },
      {
        userRole: 'SENDER',
        routes: [
          { name: 'Send', routerLink: '/mails', icon: 'send' },
          { name: 'Waiting for scan', routerLink: '/scanning', icon: 'directions_run' },
          { name: 'Scanned', routerLink: '/scanned', icon: 'drafts' },
          { name: 'Scan rejected', routerLink: '/skip-scanned', icon: 'mail' }
        ]
      }
    ];

    // Routes for current user
    return routesList.find(routes => routes.userRole === userRole).routes;
  }

  /*
   Selector: user role
  */

  @Selector([AccountState.userRole])
  static userRole(userRole: 'SENDER' | 'USER') {
    return userRole;
  }

  /*
   Selector: receivers
  */
}
