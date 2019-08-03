import { Store, State, Action, StateContext, Actions, ofAction } from '@ngxs/store';
import { Observable, forkJoin } from 'rxjs';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

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
  mailsPerPage: 15,
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
    private route: ActivatedRoute,
    private actions$: Actions
  ) {}

  /*
   Helper: store images to URLs
  */
  storeImages(files: { id: string; file: Blob }[]) {
    let imageURLs: { [key: string]: SafeUrl };
    const ids = [];

    for (const file of files) {
      const envelopImage = new Blob([file.file], { type: file.file.type });
      const imageURL = window.URL.createObjectURL(envelopImage);

      ids.push(file.id);
      imageURLs[file.id] = this.sanitizer.bypassSecurityTrustUrl(imageURL);
    }

    return { imageURLs, ids };
  }

  /*
   Method: get mail list
  */

  @Action(MailActions.GetMails)
  async getMails(ctx: StateContext<MailStateModel>) {
    // get current state and url data info
    const state = ctx.getState();
    const urlData = this.route.snapshot.data;

    // async service call
    const result = await this.mailService
      ._getMailList(state.mailsPerPage, state.currentPage, urlData)
      .toPromise();

    // return new state
    ctx.setState({
      ...state,
      mailList: [...state.mailList, ...result.mailList],
      imageTaskPool: [...state.imageTaskPool, ...result.mailList.map(mail => mail._id)],
      mailCount: result.mailCount,
      isLoading: false
    });

    // dispatch action
    ctx.dispatch(new MailActions.GenerateImageTasks());
  }

  /*
   Method: generate image tasks
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
      ctx.setState({
        ...state,
        currentImageTasks: [...state.currentImageTasks, ...currentImageTasks]
      });

      // dispatch action
      ctx.dispatch(new MailActions.GetEnvelopImages());
    }
  }

  /*
   Method: get envelop images
  */

  @Action([MailActions.GetEnvelopImages, MailActions.GetEnvelopImage])
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
        ctx.setState({
          ...state,
          imageURLs: { ...state.imageURLs, ...imageURLs },
          imageTaskPool: state.imageTaskPool.filter(id => !ids.includes(id)),
          currentImageTasks: state.currentImageTasks.filter(id => !ids.includes(id))
        });

        // dispatch action
        ctx.dispatch(new MailActions.GenerateImageTasks());
      }),
      // cancellation
      takeUntil(this.actions$.pipe(ofAction(MailActions.GetEnvelopImage)))
    );
  }

  /*
   Method: change page
  */

  @Action(MailActions.ChangePage)
  changePage(ctx: StateContext<MailStateModel>, action: MailActions.ChangePage) {
    // get current state
    const state = ctx.getState();

    // return new state
    ctx.setState({
      ...state,
      currentPage: action.payload.currentPage,
      mailsPerPage: action.payload.mailsPerPage,
      isLoading: true
    });

    // visted page or not
    if (state.currentPage * state.mailsPerPage > state.mailList.length) {
      // dispatch action
      ctx.dispatch(new MailActions.GetMails());
    } else {
      // mails already requested
      ctx.patchState({ isLoading: false });
    }
  }
}
