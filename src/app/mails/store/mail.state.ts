import { State, Action, StateContext, Actions, Selector, ofActionDispatched } from '@ngxs/store';
import { Observable, forkJoin, merge } from 'rxjs';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';

import { Mail, MailStatus } from '../mail.model';
import * as MailActions from './mail.action';
import { MailService } from '../mail.service';
import { takeUntil, tap } from 'rxjs/operators';

/*
   Mail State
*/

export interface MailStateModel {
  // Mail
  mailList: Mail[];
  selectedMails: Mail[];
  mailCount: number;

  // Pagination
  currentPage: number;
  mailsPerPage: number;

  // UI
  isLoading: boolean;

  // Envelop Image
  imageTaskPool: string[]; // list of mail id
  currentImageTasks: string[]; // list of mail id list
  imageURLs: { [key: string]: SafeUrl };

  // Content Pdf
  pdfURL: string;
}

/*
   Initial State
*/

const initialState: MailStateModel = {
  mailList: [],
  selectedMails: [],
  mailCount: 0,
  currentPage: 1,
  mailsPerPage: 6,
  isLoading: true,
  imageTaskPool: [],
  currentImageTasks: [],
  imageURLs: {},
  pdfURL: ''
};

/*
   Action Map:
*/

@State<MailStateModel>({ name: 'mail', defaults: initialState })
export class MailState {
  // Constructor:
  constructor(
    private sanitizer: DomSanitizer,
    private mailService: MailService,
    private actions$: Actions
  ) {}

  /*
   Selectors:
  */

  @Selector()
  static mailList(state: MailStateModel) {
    return state.mailList;
  }

  @Selector()
  static selectedMails(state: MailStateModel) {
    return state.selectedMails;
  }

  @Selector()
  static mailCount(state: MailStateModel) {
    return state.mailCount;
  }

  @Selector()
  static currentPage(state: MailStateModel) {
    return state.currentPage;
  }

  @Selector()
  static mailsPerPage(state: MailStateModel) {
    return state.mailsPerPage;
  }

  @Selector()
  static isLoading(state: MailStateModel) {
    return state.isLoading;
  }

  @Selector()
  static currentImageTasks(state: MailStateModel) {
    return state.currentImageTasks;
  }

  @Selector()
  static imageURLs(state: MailStateModel) {
    return state.imageURLs;
  }

  @Selector()
  static pdfURL(state: MailStateModel) {
    return state.pdfURL;
  }

  @Selector()
  static selectMode(state: MailStateModel): boolean {
    return state.selectedMails.length >= 1;
  }

  /*
   Action: get mail list
  */

  @Action(MailActions.GetMails)
  async getMails(ctx: StateContext<MailStateModel>, action: MailActions.GetMails) {
    // get current state and url data info
    const state = ctx.getState();

    // prepare api call
    const skip = state.mailList.length;
    const limit = state.mailsPerPage * state.currentPage - state.mailList.length;

    // async service call
    const result = await this.mailService
      ._getMailList(skip, limit, action.payload.urlData)
      .toPromise();

    // prepare new state [enfore no replicated mails]
    const set = new Set([...state.mailList, ...result.mailList]);
    const mailList = [...set];
    if (mailList.length !== [...state.mailList, ...result.mailList].length) {
      console.error('AssertionError: leak in getMails action');
    }

    // return new state
    ctx.patchState({
      mailList,
      imageTaskPool: [...state.imageTaskPool, ...mailList.map(mail => mail._id)],
      mailCount: result.mailCount,
      isLoading: false
    });

    // dispatch action
    ctx.dispatch(new MailActions.GenerateImageTasks());
  }

  /*
   Action: generate image tasks
  */

  @Action(MailActions.GenerateImageTasks)
  generateImageTasks(ctx: StateContext<MailStateModel>) {
    // get current state and initialize current iamge task array
    const state = ctx.getState();
    let currentImageTasks = [];

    if (state.imageTaskPool.length) {
      // prepare a chunk (mini-batch) of tasks from task pool (batch)
      currentImageTasks = state.imageTaskPool.slice(0, 5);

      // return new state
      ctx.patchState({
        currentImageTasks // overwrite state
      });

      // dispatch action
      ctx.dispatch(new MailActions.GetEnvelopImages());
    }
  }

  /*
   Action: get envelop images
  */

  @Action(MailActions.GetEnvelopImages)
  getEnvelopImages(ctx: StateContext<MailStateModel>) {
    // get current state
    const state = ctx.getState();
    const imageTasks = [];

    // prepare api requests
    for (const image of state.currentImageTasks) {
      imageTasks.push(this.mailService.getEnvelop(image));
    }
    const currentImageTasks$: Observable<{ id: string; file: Blob }[]> = forkJoin(imageTasks);

    // async service call
    return currentImageTasks$.pipe(
      tap(result => {
        // store images to urls
        const { imageURLs, ids } = this.storeImages(result);

        // return new state
        ctx.patchState({
          imageURLs: { ...state.imageURLs, ...imageURLs },
          imageTaskPool: state.imageTaskPool.filter(id => !ids.includes(id)),
          currentImageTasks: state.currentImageTasks.filter(id => !ids.includes(id))
        });

        // dispatch action
        ctx.dispatch(new MailActions.GenerateImageTasks());
      }),
      // cancellation
      takeUntil(
        merge(
          this.actions$.pipe(ofActionDispatched(MailActions.GetEnvelopImage)),
          this.actions$.pipe(ofActionDispatched(MailActions.ChangePage)),
          this.actions$.pipe(ofActionDispatched(MailActions.ResetStore))
        )
      )
    );
  }

  /*
   Action: get envelop image
  */

  @Action(MailActions.GetEnvelopImage, { cancelUncompleted: true })
  getEnvelopImage(ctx: StateContext<MailStateModel>, action: MailActions.GetEnvelopImage) {
    // get current state
    const state = ctx.getState();

    // async service call
    return this.mailService.getEnvelop(action.payload._id).pipe(
      tap(result => {
        // store images to urls
        const { imageURLs, ids } = this.storeImages([result]);

        // return new state
        ctx.patchState({
          imageURLs: { ...state.imageURLs, ...imageURLs },
          imageTaskPool: state.imageTaskPool.filter(id => !ids.includes(id))
        });

        // dispatch action
        ctx.dispatch(new MailActions.GetEnvelopImages());
      })
    );
  }

  /*
   Action: get content pdf
  */

  @Action(MailActions.GetContentPdf, { cancelUncompleted: true })
  getContentPdf(ctx: StateContext<MailStateModel>, action: MailActions.GetContentPdf) {
    // get current state
    const state = ctx.getState();

    // async service call
    return this.mailService.getContentPDF(action.payload._id).pipe(
      tap(result => {
        // store images to urls
        const pdfURL = window.URL.createObjectURL(result);

        // update mailList (deepcopy mailList)
        const mailList = JSON.parse(JSON.stringify(state.mailList));
        mailList.forEach(mail => {
          if (mail._id === action.payload._id) {
            mail.flags.read = true;
          }
        });

        // return new state
        ctx.patchState({
          mailList,
          pdfURL
        });
      })
    );
  }

  /*
   Action: toggle a mail star flag
  */

  @Action(MailActions.ToggleMailStarFlag)
  toggleMailStarFlag(ctx: StateContext<MailStateModel>, action: MailActions.ToggleMailStarFlag) {
    // get current state
    const state = ctx.getState();
    const update = { flags: { star: !action.payload.flags.star } };

    // async service call
    return this.mailService._updateMail(action.payload._id, update).pipe(
      tap(() => {
        // update mailList (deepcopy mailList)
        const mailList = JSON.parse(JSON.stringify(state.mailList));

        mailList.forEach(mail => {
          if (mail._id === action.payload._id) {
            mail.flags.star = !action.payload.flags.star;
          }
        });

        // return new state
        ctx.patchState({ mailList });
      })
    );
  }

  /*
   Action: set mail star flags
  */

  @Action(MailActions.StarredMails)
  starredMails(ctx: StateContext<MailStateModel>, action: MailActions.StarredMails) {
    // get current state
    const state = ctx.getState();
    const update = { flags: { star: true } };

    // async service call
    return this.mailService._updateMails(action.payload, update).pipe(
      tap(() => {
        // update mailList (deepcopy mailList)
        const mailList = JSON.parse(JSON.stringify(state.mailList));
        const updatedMailIds = action.payload.map(mail => mail._id);

        mailList.forEach(mail => {
          if (updatedMailIds.includes(mail._id)) {
            mail.flags.star = true;
          }
        });

        // return new state
        ctx.patchState({ mailList });
      })
    );
  }

  /*
   Action: unset mail star flags
  */

  @Action(MailActions.UnstarredMails)
  unstarredMails(ctx: StateContext<MailStateModel>, action: MailActions.UnstarredMails) {
    // get current state
    const state = ctx.getState();
    const update = { flags: { star: false } };

    // async service call
    return this.mailService._updateMails(action.payload, update).pipe(
      tap(() => {
        // update mailList (deepcopy mailList)
        const mailList = JSON.parse(JSON.stringify(state.mailList));
        const updatedMailIds = action.payload.map(mail => mail._id);

        mailList.forEach(mail => {
          if (updatedMailIds.includes(mail._id)) {
            mail.flags.star = false;
          }
        });

        // return new state
        ctx.patchState({ mailList });
      })
    );
  }

  /*
   Action: toggle a mail read flag
  */

  @Action(MailActions.ToggleMailReadFlag)
  toggleMailReadFlag(ctx: StateContext<MailStateModel>, action: MailActions.ToggleMailReadFlag) {
    // get current state
    const state = ctx.getState();
    const update = { flags: { star: !action.payload.flags.read } };

    // async service call
    return this.mailService._updateMail(action.payload._id, update).pipe(
      tap(() => {
        // update mailList (deepcopy mailList)
        const mailList = JSON.parse(JSON.stringify(state.mailList));

        mailList.forEach(mail => {
          if (mail._id === action.payload._id) {
            mail.flags.star = !action.payload.flags.read;
          }
        });

        // return new state
        ctx.patchState({ mailList });
      })
    );
  }

  /*
   Action: set mail read flags
  */

  @Action(MailActions.ReadMails)
  readMails(ctx: StateContext<MailStateModel>, action: MailActions.ReadMails) {
    // get current state
    const state = ctx.getState();
    const update = { flags: { read: true } };

    // async service call
    return this.mailService._updateMails(action.payload, update).pipe(
      tap(() => {
        // update mailList (deepcopy mailList)
        const mailList = JSON.parse(JSON.stringify(state.mailList));
        const updatedMailIds = action.payload.map(mail => mail._id);

        mailList.forEach(mail => {
          if (updatedMailIds.includes(mail._id)) {
            mail.flags.read = true;
          }
        });

        // return new state
        ctx.patchState({ mailList });
      })
    );
  }

  /*
   Action: unset mail read flags
  */

  @Action(MailActions.UnreadMails)
  unreadMails(ctx: StateContext<MailStateModel>, action: MailActions.UnreadMails) {
    // get current state
    const state = ctx.getState();
    const update = { flags: { read: false } };

    // async service call
    return this.mailService._updateMails(action.payload, update).pipe(
      tap(() => {
        // update mailList (deepcopy mailList)
        const mailList = JSON.parse(JSON.stringify(state.mailList));
        const updatedMailIds = action.payload.map(mail => mail._id);

        mailList.forEach(mail => {
          if (updatedMailIds.includes(mail._id)) {
            mail.flags.read = false;
          }
        });

        // return new state
        ctx.patchState({ mailList });
      })
    );
  }

  /*
   Action: scan a mail content
  */

  @Action(MailActions.ScanMail)
  scanMail(ctx: StateContext<MailStateModel>, action: MailActions.ScanMail) {
    // get current state
    const state = ctx.getState();
    const update = { status: MailStatus.SCANNING };

    // async service call
    return this.mailService._updateMail(action.payload._id, update).pipe(
      tap(() => {
        // update mailList (deepcopy mailList)
        const mailList = JSON.parse(JSON.stringify(state.mailList));

        mailList.forEach(mail => {
          if (mail._id === action.payload._id) {
            mail.status = MailStatus.SCANNING;
          }
        });

        // return new state
        ctx.patchState({ mailList });
      })
    );
  }

  /*
   Action: scan mails content
  */

  @Action(MailActions.ScanMails)
  scanMails(ctx: StateContext<MailStateModel>, action: MailActions.ScanMails) {
    // get current state
    const state = ctx.getState();
    const update = { status: MailStatus.SCANNING };

    // async service call
    return this.mailService._updateMails(action.payload, update).pipe(
      tap(() => {
        // update mailList (deepcopy mailList)
        const mailList = JSON.parse(JSON.stringify(state.mailList));
        const updatedMailIds = action.payload.map(mail => mail._id);

        mailList.forEach(mail => {
          if (updatedMailIds.includes(mail._id)) {
            mail.status = MailStatus.SCANNING;
          }
        });

        // return new state
        ctx.patchState({ mailList });
      })
    );
  }

  /*
   Action: reject scan a mail content
  */

  @Action(MailActions.UnscanMail)
  unscanMail(ctx: StateContext<MailStateModel>, action: MailActions.UnscanMail) {
    // get current state
    const state = ctx.getState();
    const update = { status: MailStatus.SCAN_REJECTED };

    // async service call
    return this.mailService._updateMail(action.payload._id, update).pipe(
      tap(() => {
        // update mailList (deepcopy mailList)
        const mailList = JSON.parse(JSON.stringify(state.mailList));

        mailList.forEach(mail => {
          if (mail._id === action.payload._id) {
            mail.status = MailStatus.SCAN_REJECTED;
          }
        });

        // return new state
        ctx.patchState({ mailList });
      })
    );
  }

  /*
   Action: reject scan mails content
  */

  @Action(MailActions.UnscanMails)
  unscanMails(ctx: StateContext<MailStateModel>, action: MailActions.UnscanMails) {
    // get current state
    const state = ctx.getState();
    const update = { status: MailStatus.SCAN_REJECTED };

    // async service call
    return this.mailService._updateMails(action.payload, update).pipe(
      tap(() => {
        // update mailList (deepcopy mailList)
        const mailList = JSON.parse(JSON.stringify(state.mailList));
        const updatedMailIds = action.payload.map(mail => mail._id);

        mailList.forEach(mail => {
          if (updatedMailIds.includes(mail._id)) {
            mail.status = MailStatus.SCAN_REJECTED;
          }
        });

        // return new state
        ctx.patchState({ mailList });
      })
    );
  }

  /*
   Action: report a mail issue
  */

  @Action(MailActions.IssueMail)
  issueMail(ctx: StateContext<MailStateModel>, action: MailActions.IssueMail) {
    // get current state
    const state = ctx.getState();
    const update = { flags: { issue: true } };

    // async service call
    return this.mailService._updateMail(action.payload._id, update).pipe(
      tap(() => {
        // update mailList (deepcopy mailList)
        const mailList = JSON.parse(JSON.stringify(state.mailList));

        mailList.forEach(mail => {
          if (mail._id === action.payload._id) {
            mail.flags.issue = true;
          }
        });

        // return new state
        ctx.patchState({ mailList });
      })
    );
  }

  /*
   Action: select a mail
  */

  @Action(MailActions.SelectMail)
  selectMail(ctx: StateContext<MailStateModel>, action: MailActions.SelectMail) {
    // get current state
    const state = ctx.getState();

    // return new state
    ctx.patchState({
      selectedMails: [...state.selectedMails, action.payload]
    });
  }

  /*
   Action: select all mails
  */

  @Action(MailActions.SelectAllMails)
  selectAllMails(ctx: StateContext<MailStateModel>) {
    // get current state
    const state = ctx.getState();

    // get all mails on current page
    const startIndex = (state.currentPage - 1) * state.mailsPerPage;
    const stopIndex = state.currentPage * state.mailsPerPage;
    const mailsOnCurrentPage = state.mailList.slice(startIndex, stopIndex);

    // return new state
    ctx.patchState({
      selectedMails: mailsOnCurrentPage
    });
  }

  /*
   Action: un-select a mail
  */

  @Action(MailActions.UnselectMail)
  unselectMail(ctx: StateContext<MailStateModel>, action: MailActions.UnselectMail) {
    // get current state
    const state = ctx.getState();

    // return new state
    ctx.patchState({
      selectedMails: state.selectedMails.filter(mail => mail._id !== action.payload._id)
    });
  }

  /*
   Action: un-select all mails
  */

  @Action(MailActions.UnselectAllMails)
  unselectAllMails(ctx: StateContext<MailStateModel>) {
    // return new state
    ctx.patchState({ selectedMails: [] });
  }

  /*
   Action: change page
  */

  @Action(MailActions.ChangePage)
  async changePage(ctx: StateContext<MailStateModel>, action: MailActions.ChangePage) {
    // change UI state and get current state
    ctx.patchState({ isLoading: true });
    const state = ctx.getState();

    // visted page or not && all mails fetched or not
    if (
      action.payload.currentPage * action.payload.mailsPerPage > state.mailList.length &&
      state.mailList.length < state.mailCount
    ) {
      // prepare api call
      const skip = state.mailList.length;
      const limit = action.payload.mailsPerPage * action.payload.currentPage - skip;

      // async service call
      const result = await this.mailService
        ._getMailList(skip, limit, action.payload.urlData)
        .toPromise();

      // prepare new state [enfore no replicated mails]
      const set = new Set([...state.mailList, ...result.mailList]);
      const mailList = [...set];
      if (mailList.length !== [...state.mailList, ...result.mailList].length) {
        console.error('AssertionError: leak in changePage get mails action');
      }

      // return new state
      ctx.patchState({
        mailList,
        imageTaskPool: [...mailList.map(mail => mail._id), ...state.imageTaskPool], // fetch new page images first
        currentPage: action.payload.currentPage,
        mailsPerPage: action.payload.mailsPerPage,
        isLoading: false
      });

      // dispatch action
      ctx.dispatch(new MailActions.GenerateImageTasks());
    } else {
      // return new state
      ctx.patchState({
        currentPage: action.payload.currentPage,
        mailsPerPage: action.payload.mailsPerPage,
        isLoading: false
      });
    }
  }

  /*
   Action: clear store when redirects
  */

  @Action(MailActions.ResetStore)
  resetStore(ctx: StateContext<MailStateModel>) {
    ctx.setState(initialState);
  }

  /*
   Helper: store images to URLs
  */
  storeImages(files: { id: string; file: Blob }[]) {
    let imageURLs: { [key: string]: SafeUrl } = {};
    const ids = [];

    for (const file of files) {
      const envelopImage = new Blob([file.file], { type: file.file.type });
      const imageURL = window.URL.createObjectURL(envelopImage);

      ids.push(file.id);
      imageURLs[file.id] = this.sanitizer.bypassSecurityTrustUrl(imageURL);
    }

    return { imageURLs, ids };
  }
}
