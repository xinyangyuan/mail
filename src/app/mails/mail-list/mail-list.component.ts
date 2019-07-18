import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

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
  public mailList: Mail[];
  public imageURL: any;
  // pagination
  public mailCount = 0;
  public mailsPerPage = 15;
  public currentPage = 1;
  public pageSizeOptions = [15, 20, 25];
  // progress bar
  public isloading = true;

  constructor(private mailService: MailService, private sanitizer: DomSanitizer) {}

  // Init Method
  async ngOnInit() {
    this.mailService._getMailList(this.mailsPerPage, this.currentPage).subscribe(data => {
      this.mailList = data.mailList;
      this.mailCount = data.mailCount;
      this.isloading = false;
    });
  }

  // Method: view mail envelop image
  loadImage(id: string) {
    this.imageURL = null;

    // get mail envelop image pdf
    this.mailService.getEnvelop(id).subscribe(file => {
      const envelopImage = new Blob([file], { type: file.type });
      const imageURL = window.URL.createObjectURL(envelopImage);
      this.imageURL = this.sanitizer.bypassSecurityTrustUrl(imageURL);
    });
  }

  // Method: view mail content pdf
  onView(id: string) {
    // open new window and display loading message
    const pdfWindow = window.open('', '_blank');
    pdfWindow.document.write('Loading pdf... <br> Please turn off AdBlock to see the pdf file.');

    // get content pdf
    this.mailService.getContentPDF(id).subscribe(file => {
      const pdf = new Blob([file], { type: file.type });
      const pdfURL = window.URL.createObjectURL(pdf);
      pdfWindow.location.href = pdfURL;
    });
  }

  // Method: call change page in paginator
  onChangedPage(pageData: PageEvent) {
    // show progress bar
    this.isloading = true;
    this.mailList = null;

    // change page status
    this.currentPage = pageData.pageIndex + 1;
    this.mailsPerPage = pageData.pageSize;

    this.mailService._getMailList(this.mailsPerPage, this.currentPage).subscribe(data => {
      this.mailList = data.mailList;
      this.isloading = false;
    });
  }

  // Destroy Method
  ngOnDestroy() {
    // cancel service subscriptions on destory
    // this.mailsListObserver.unsubscribe();
    // this.mailCreateObserver.unsubscribe();
    // this.mailUpdateObserver.unsubscribe();
    // this.mailDeletionObserver.unsubscribe();
  }
}
