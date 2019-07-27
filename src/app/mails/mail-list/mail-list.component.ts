import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Data } from '@angular/router';
import { Subscription, Subject, Observable, forkJoin, pipe } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { MailService } from '../mail.service';
import { Mail } from '../mail.model';
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-mail-list',
  templateUrl: './mail-list.component.html',
  styleUrls: ['./mail-list.component.css']
})
export class MailListComponent implements OnInit, OnDestroy {
  // Attributes
  public urlData: Data;
  public mailList: Mail[];
  public imageURL: any;
  public senderStatus: boolean;

  // Pagination
  public mailCount = 0;
  public mailsPerPage = 15;
  public currentPage = 1;
  public pageSizeOptions = [15, 20, 25];

  // UI & Cancel Http Request on Re-directing
  public isloading = true;
  public imageIsLoading = true;
  private currentMailListSubscription: Subscription;

  // ADVANCE IMAGE FETCHING METHOD
  imageTaskPool: string[];
  imageURLs: { [key: string]: any } = {};
  currentImageTasks = [];

  getImageTasks$ = new Subject();
  imageTasks$ = new Subject<Observable<{ id: string; file: Blob }[]>>();

  imageTasksListener: Subscription;
  getImageTasksListener: Subscription;

  // Constructor:
  constructor(
    private mailService: MailService,
    private authService: AuthService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute
  ) {}

  // Init Method:
  async ngOnInit() {
    this.senderStatus = this.authService.getSenderStatus();

    // call getImageTasks function when getImageTasks$ observable emits new value
    this.getImageTasksListener = this.getImageTasks$.subscribe(() => {
      this.getImageTasks();
    });

    // fetch and store images when imagTasks$ emits job
    this.imageTasksListener = this.imageTasks$
      // interrupt current tasks new imageTasks arrived
      .pipe(switchMap(tasks => tasks))
      .subscribe(files => this.storeImages(files));

    // fetch corresponding mails based on route data -> prepare view
    this.urlData = this.route.snapshot.data;

    // fetch mails from api
    this.currentMailListSubscription = this.mailService
      ._getMailList(this.mailsPerPage, this.currentPage, this.urlData)
      .subscribe(data => {
        this.mailList = data.mailList;
        this.mailCount = data.mailCount;
        this.isloading = false;

        // prepare imageTaskPool from mailList
        this.imageTaskPool = this.mailList.map(mail => mail._id);

        // call getImageTasks
        this.getImageTasks$.next();
      });
  }

  // Method: load mail image when exppansion panel is clicked
  onExpand(mail: Mail) {
    // change loading ui
    this.imageIsLoading = true;

    // check wheter (1) image is already fetched or (2) is fetching now
    const isFetched = typeof this.imageURLs[mail._id] !== 'undefined';
    const isInCurrentTask = this.currentImageTasks.includes(mail._id);

    if (!isFetched && !isInCurrentTask) {
      this.currentImageTasks = [mail._id];
      this.imageTasks$.next(forkJoin([this.mailService.getEnvelop(mail._id)]));
    } else if (isFetched) {
      this.imageIsLoading = false;
    }
  }

  // Method: stared a mail
  onStar(mail: Mail, event: MouseEvent, idx: number) {
    // disable mat-expansion panel from expanding
    event.stopPropagation();

    // change star icon state and update to server
    mail.flags.star = !mail.flags.star; // update view before response
    this.mailService._updateMail(mail._id, undefined, mail.flags.star).subscribe();

    // delete mail from view if we are in stared route
    if (this.urlData.starFlag === true) {
      this.mailList.splice(idx, 1);
    }
  }

  // Method: delete a mail
  async onDelete(mail: Mail) {
    // show progress bar
    this.isloading = true;

    // delete mail and fetch new mail list
    await this.mailService._deleteMail(mail._id).subscribe();

    // // fetch mails and update to the newest mailList request
    this.currentMailListSubscription = this.mailService
      ._getMailList(this.mailsPerPage, this.currentPage, this.urlData)
      .subscribe(data => {
        this.mailCount -= 1;
        this.mailList = data.mailList;
        this.isloading = false;
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

        // prepare imageTaskPool from mailList
        this.imageTaskPool = this.mailList.map(mail => mail._id);

        // call getImageTasks
        this.getImageTasks$.next();
      });
  }

  // Destroy Method:
  ngOnDestroy() {
    // abort mailList request when changes page
    this.currentMailListSubscription.unsubscribe();
    this.imageTasksListener.unsubscribe();
    this.getImageTasksListener.unsubscribe();
  }

  // Static Method:
  getImageTasks() {
    if (this.imageTaskPool.length) {
      // prepare a chunk (mini-batch) of tasks from task pool (batch)
      this.currentImageTasks = this.imageTaskPool.slice(0, 5);
      const imageTasks = [];

      // prepare api requests
      for (const image of this.currentImageTasks) {
        imageTasks.push(this.mailService.getEnvelop(image));
      }
      // forward tasks to imageTasks$
      this.imageTasks$.next(forkJoin(imageTasks));
    } else {
      // no more images tasks left
      // this.imageTasks$.complete();
    }
  }

  // Static Method:
  storeImages(files: { id: string; file: Blob }[]) {
    for (const file of files) {
      const envelopImage = new Blob([file.file], { type: file.file.type });
      const imageURL = window.URL.createObjectURL(envelopImage);
      this.imageURLs[file.id] = this.sanitizer.bypassSecurityTrustUrl(imageURL);

      // remove fetched image from takspool
      this.imageTaskPool = this.imageTaskPool.filter(e => e !== file.id);
    }
    // change ui
    this.imageIsLoading = false;

    // get new image tasks
    this.getImageTasks$.next();
  }
}
