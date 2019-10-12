import {
  State,
  Action,
  StateContext,
  Actions,
  Selector,
  ofActionDispatched,
  createSelector
} from '@ngxs/store';
import { Observable, forkJoin, merge } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { Data } from '@angular/router';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';

import { Mail } from '../models/mail.model';
import { MailStatus } from '../models/mail-status.model';
import * as MailActions from './mail.action';
import { MailService } from '../mail.service';

/*
   Mail State
*/

export interface MailStateModel {
  // Mail
  mailList: Mail[];
  editedMail: Mail;
  selectedMails: Mail[];
  mailCount: number;

  // Pagination
  currentPage: number;
  mailsPerPage: number;

  // UI
  isLoading: boolean;

  // Envelop Image
  imageTaskPool: string[]; // list of mail id
  currentImageTasks: string[]; // list of mail id
  imageURLs: { [key: string]: SafeUrl };

  // Content Pdf
  pdfURL: string;

  // URL Data
  urlData: Data; // {read: false} || {star : true}
}

/*
   Initial State
*/

const initialState: MailStateModel = {
  mailList: [],
  editedMail: null,
  selectedMails: [],
  mailCount: null,
  currentPage: 1,
  mailsPerPage: 15,
  isLoading: true,
  imageTaskPool: [],
  currentImageTasks: [],
  imageURLs: {},
  pdfURL: '',
  urlData: null
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
  static editedMail(state: MailStateModel) {
    return state.editedMail;
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

  // Selector dynamic
  static isSelected(mail: Mail) {
    return createSelector(
      [MailState],
      (state: MailStateModel) => {
        return state.selectedMails.map(selectedMail => selectedMail._id).includes(mail._id);
      }
    );
  }

  @Selector()
  static urlData(state: MailStateModel) {
    return state.urlData;
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
    const result = await this.mailService._getMailList(skip, limit, action.payload).toPromise();

    // return new state
    ctx.patchState({
      mailList: result.mailList,
      imageTaskPool: result.mailList
        .map(mail => mail._id)
        .filter(mailId => !Object.keys(state.imageURLs).includes(mailId)),
      mailCount: result.mailCount,
      isLoading: false,
      urlData: action.payload
    });

    // dispatch action
    ctx.dispatch(new MailActions.GenerateImageTasks());
  }

  /*
   Action: send new mail
  */

  // @Action(MailActions.SendMail)
  // sendMail(ctx: StateContext<MailStateModel>, action: MailActions.SendMail) {
  //   return this.mailService._createMail(action.payload.controls.)
  // }

  /*
   Action: put update a mail
  */

  @Action(MailActions.ModifyMail)
  modifyMail(ctx: StateContext<MailStateModel>, action: MailActions.ModifyMail) {
    // get current state
    const state = ctx.getState();

    // modified mail contents
    const title = action.payload.update.controls.title.value;
    const description = action.payload.update.controls.description.value;
    const content = action.payload.update.controls.content.value;
    const envelop = action.payload.update.controls.envelop.value;
    const contentPDF = action.payload.update.controls.contentPDF.value;

    return this.mailService
      ._modifyMail(action.payload.mail, title, description, content, envelop, contentPDF)
      .pipe(
        tap(
          result => {
            ctx.patchState({
              editedMail: null,
              imageURLs: { ...state.imageURLs, id: null }
            });
          },
          error => {
            ctx.patchState({ editedMail: null });
          }
        )
      );
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
    const imageTasks: Observable<{ id: string; file: Blob }>[] = [];

    // prepare api requests
    for (const image of state.currentImageTasks) {
      imageTasks.push(this.mailService._getEnvelop(image));
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
      takeUntil(
        // cancellation
        this.actions$.pipe(
          ofActionDispatched(
            MailActions.GetEnvelopImage,
            MailActions.ChangePage,
            MailActions.ResetMailList,
            MailActions.ResetStore
          )
        )
      )
      // takeUntil(
      //   merge(
      //     this.actions$.pipe(ofActionDispatched(MailActions.GetEnvelopImage)),
      //     this.actions$.pipe(ofActionDispatched(MailActions.ChangePage)),
      //     this.actions$.pipe(ofActionDispatched(MailActions.ResetMailList)),
      //     this.actions$.pipe(ofActionDispatched(MailActions.ResetStore))
      //   )
      // )
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
    return this.mailService._getEnvelop(action.payload._id).pipe(
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
    return this.mailService._getContentPDF(action.payload).pipe(
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
   Action: get more mails when empty slots in view due to mail update(s)
  */

  @Action([MailActions.UpdateMail, MailActions.UpdateMails])
  getMailsOnUpdate(
    ctx: StateContext<MailStateModel>,
    action: MailActions.UpdateMail | MailActions.UpdateMails
  ) {
    // get current state
    const state = ctx.getState();
    const urlData = state.urlData;

    // Object flatten: {flags: {read: bool, star: bool, issue: bool}, status: string}
    // => {read: bool, star: bool, issue: bool, status: string}
    const update = Object.assign(
      {},
      ...(function _flatten(object) {
        return [].concat(
          ...Object.keys(object).map(k =>
            typeof object[k] === 'object' ? _flatten(object[k]) : { [k]: object[k] }
          )
        );
      })(action.payload.update)
    );

    // find whether update conflict with page filter
    let conflict = false;
    const overlaps: string[] = Object.keys(update).filter(key =>
      Object.keys(urlData).includes(key)
    );
    for (const overlap of overlaps) {
      if (update[overlap] !== urlData[overlap]) {
        conflict = true;
      }
    }

    // number of new mails to fetch
    let numberOfMails = 0;
    if (conflict && state.mailList.length < state.mailCount) {
      numberOfMails = action instanceof MailActions.UpdateMails ? action.payload.mails.length : 1;
    }
    // async service call
    const skip = state.mailList.length - numberOfMails;
    const limit = numberOfMails;

    if (numberOfMails) {
      return this.mailService._getMailList(skip, limit, urlData).pipe(
        tap(result => {
          // return new state
          ctx.patchState({
            mailList: [...state.mailList, ...result.mailList],
            imageTaskPool: result.mailList
              .map(mail => mail._id)
              .filter(mailId => !Object.keys(state.imageURLs).includes(mailId))
          });
          // dispatch action
          ctx.dispatch(new MailActions.GenerateImageTasks());
        })
      );
    }
  }

  /*
   Action: toggle a mail star flag [optimistic update]
  */

  @Action(MailActions.ToggleMailStarFlag)
  toggleMailStarFlag(ctx: StateContext<MailStateModel>, action: MailActions.ToggleMailStarFlag) {
    // get current state
    const state = ctx.getState();
    const update = { flags: { star: !action.payload.flags.star } };

    // updated maillist
    const mailList = JSON.parse(JSON.stringify(state.mailList));
    mailList.forEach(mail => {
      if (mail._id === action.payload._id) {
        mail.flags.star = !action.payload.flags.star;
      }
    });

    // optimistic update
    ctx.patchState({ mailList });

    // async service call
    return this.mailService._updateMail(action.payload, update).pipe(
      tap(
        result => {},
        error => {
          // fallback to previous state
          ctx.patchState({ mailList: state.mailList });
        }
      )
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
    return this.mailService._updateMail(action.payload, update).pipe(
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
    return this.mailService._updateMail(action.payload, update).pipe(
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
    return this.mailService._updateMail(action.payload, update).pipe(
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
    return this.mailService._updateMail(action.payload, update).pipe(
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
   Action: delete a mail
  */

  @Action(MailActions.DeleteMail)
  deleteMail(ctx: StateContext<MailStateModel>, action: MailActions.DeleteMail) {
    const state = ctx.getState();
    return this.mailService._deleteMail(action.payload).pipe(
      tap(() => {
        // return new state
        ctx.patchState({
          mailList: state.mailList.filter(mail => mail._id !== action.payload._id),
          mailCount: state.mailCount - 1
        });
      })
    );
  }

  /*
   Action: edit a mail
  */

  @Action(MailActions.EditMail)
  editMail(ctx: StateContext<MailStateModel>, action: MailActions.EditMail) {
    // get current state
    const state = ctx.getState();

    // remove the edited mail envelop image from the imageURLs
    const { [action.payload._id]: _, ...imageURLs } = state.imageURLs;

    // return new state
    ctx.patchState({ editedMail: action.payload, imageURLs });
  }

  /*
   Action: un-edit a mail
  */

  @Action(MailActions.UneditMail)
  uneditMail(ctx: StateContext<MailStateModel>) {
    // return new state
    ctx.patchState({ editedMail: null });
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
   Action: un-select all mails | also fire when single mail state is updated
  */

  @Action([
    MailActions.UnselectAllMails,
    MailActions.ToggleMailStarFlag,
    MailActions.ToggleMailReadFlag,
    MailActions.IssueMail,
    MailActions.DeleteMail,
    MailActions.ScanMail,
    MailActions.UnscanMail,
    MailActions.GetEnvelopImage,
    MailActions.GetContentPdf,
    MailActions.ChangePage
  ])
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

    // adjusted mailList
    const mailList: Mail[] = state.mailList.filter(
      mail =>
        Object.entries(state.urlData).length === 0 ||
        mail.flags.star === state.urlData.star ||
        mail.flags.read === state.urlData.read ||
        mail.flags.issue === state.urlData.issue ||
        mail.status === state.urlData.status
    );

    // adjusted mailCount
    const adjustment: number = mailList.length - mailList.length;
    const mailCount: number = state.mailCount + adjustment;

    // visted page or not && all mails fetched or not
    if (
      action.payload.currentPage * action.payload.mailsPerPage > mailList.length &&
      mailList.length < mailCount
    ) {
      // prepare api call
      const skip: number = mailList.length;
      const limit: number = action.payload.mailsPerPage * action.payload.currentPage - skip;

      // async service call
      const result = await this.mailService
        ._getMailList(skip, limit, action.payload.urlData)
        .toPromise();

      // return new state
      ctx.patchState({
        mailList: [...mailList, ...result.mailList],
        mailCount: result.mailCount,
        imageTaskPool: [
          ...result.mailList
            .map(mail => mail._id)
            .filter(mailId => !Object.keys(state.imageURLs).includes(mailId)),
          ...state.imageTaskPool
        ], // fetch new page images first
        currentPage: action.payload.currentPage,
        mailsPerPage: action.payload.mailsPerPage,
        isLoading: false
      });

      // dispatch action
      ctx.dispatch(new MailActions.GenerateImageTasks());
    } else {
      // return new state
      ctx.patchState({
        mailList,
        mailCount,
        currentPage: action.payload.currentPage,
        mailsPerPage: action.payload.mailsPerPage,
        isLoading: false
      });
    }
  }

  /*
   Action: clear store except imageURLs when redirect
  */

  @Action(MailActions.ResetMailList)
  resetMailList(ctx: StateContext<MailStateModel>) {
    const state = ctx.getState();
    ctx.setState({
      ...initialState,
      editedMail: state.editedMail, // keep current editing mail
      imageURLs: state.imageURLs // keep images
    });
  }

  /*
   Action: clear store
  */

  @Action(MailActions.ResetStore)
  resetStore(ctx: StateContext<MailStateModel>) {
    ctx.setState({
      ...initialState
    });
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
