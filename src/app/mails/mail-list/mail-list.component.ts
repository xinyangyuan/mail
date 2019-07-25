import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Data } from '@angular/router';
import { Subscription, Subject, Observable } from 'rxjs';
import { switchMap, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { MailService } from '../mail.service';
import { Mail } from '../mail.model';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-mail-list',
  templateUrl: './mail-list.component.html',
  styleUrls: ['./mail-list.component.css']
})
export class MailListComponent implements OnInit, OnDestroy {
  // Attributes
  public urlData: Data;
  public mailList: Mail[];
  public imageURLs: { [key: string]: any } = {};

  // Pagination
  public mailCount = 0;
  public mailsPerPage = 15;
  public currentPage = 1;
  public pageSizeOptions = [15, 20, 25];

  // UI & Cancel Http Request on Re-directing
  public isloading = true;
  private currentMailListSubscription: Subscription;

  // Constructor:
  constructor(
    private mailService: MailService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute
  ) {}

  // Init Method:
  async ngOnInit() {
    // get url route data
    this.currentMailListSubscription = this.route.data
      .pipe(
        // switchMap is actually NOT needed, the component will be reloaded when redirects
        switchMap(urlData => {
          this.urlData = urlData;
          return this.mailService._getMailList(this.mailsPerPage, this.currentPage, urlData);
        })
      )
      // fetch mail list
      .subscribe(data => {
        this.mailList = data.mailList;
        this.mailCount = data.mailCount;
        this.isloading = false;
      });
  }

  // Method: stared a mail
  onStar(mail: Mail, event: MouseEvent, idx: number) {
    // disable mat-expansion panel from expanding
    event.stopPropagation();

    // change star icon state and update to server
    mail.flags.star = !mail.flags.star;
    this.mailService._updateMail(mail._id, undefined, mail.flags.star).subscribe();
    // .subscribe(fetchedMail => (mail.flags.star = fetchedMail.mail.flags.star));

    // delete mail from view if we are in stared route
    if (this.urlData.starFlag === true) {
      this.mailList.splice(idx, 1);
    }
  }

  // Method: read a mail
  // Method: issue a mail
  // Method: delete a mail

  // Method: view mail envelop image
  loadImage(id: string) {
    // get mail envelop image pdf
    this.mailService.getEnvelop(id).subscribe(file => {
      const envelopImage = new Blob([file], { type: file.type });
      const imageURL = window.URL.createObjectURL(envelopImage);
      this.imageURLs.id = this.sanitizer.bypassSecurityTrustUrl(imageURL);
    });
  }

  // Method: view mail content pdf
  async onView(mail: Mail) {
    // open new window and display loading message
    const pdfWindow = window.open('', '_blank');
    pdfWindow.document.write('Loading pdf... <br> Please turn off AdBlock to see the pdf file.');

    // get content pdf
    const file = await this.mailService.getContentPDF(mail._id).toPromise();
    const pdfURL = window.URL.createObjectURL(file);
    pdfWindow.location.href = pdfURL;

    // change read flag
    await this.mailService._updateMail(mail._id, true).toPromise();
    mail.flags.read = true;
  }

  // Method: call change page in paginator
  onChangedPage(pageData: PageEvent) {
    // show progress bar
    this.isloading = true;
    this.mailList = null;

    // change page status
    this.currentPage = pageData.pageIndex + 1;
    this.mailsPerPage = pageData.pageSize;

    // fetch mails and update to the newest mailList request
    this.currentMailListSubscription = this.mailService
      ._getMailList(this.mailsPerPage, this.currentPage, this.urlData)
      .subscribe(data => {
        this.mailList = data.mailList;
        this.isloading = false;
      });
  }

  // Destroy Method
  ngOnDestroy() {
    // abort mailList request when changes page
    this.currentMailListSubscription.unsubscribe();
  }
}
