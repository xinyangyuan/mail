import {
  Store,
  State,
  Action,
  StateContext,
  Actions,
  Selector,
  ofActionDispatched
} from '@ngxs/store';
import { Observable, forkJoin } from 'rxjs';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';

import { Mail } from '../mail.model';
import * as MailActions from './mail.action';
import { MailService } from '../mail.service';
import { takeUntil, tap } from 'rxjs/operators';

/*
   Mail State
*/

export interface MailStateModel {
  // Mail
  mailList: Mail[];
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
}

/*
   Initial State
*/

const initialState: MailStateModel = {
  mailList: [],
  mailCount: 0,
  currentPage: 1,
  mailsPerPage: 6,
  isLoading: true,
  imageTaskPool: [],
  currentImageTasks: [],
  imageURLs: {}
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

  /*
   Action: get mail list
  */

  @Action(MailActions.GetMails)
  async getMails(ctx: StateContext<MailStateModel>, action: MailActions.GetMails) {
    // get current state and url data info
    const state = ctx.getState();

    // prepare api call
    const skip = 0;
    const limit = state.mailsPerPage;

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
        currentImageTasks: [...state.currentImageTasks, ...currentImageTasks]
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
      takeUntil(this.actions$.pipe(ofActionDispatched(MailActions.GetEnvelopImage)))
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
   Method: change page
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
        imageTaskPool: [...state.imageTaskPool, ...mailList.map(mail => mail._id)],
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
