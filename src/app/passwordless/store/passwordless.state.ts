import { State, Action, StateContext } from '@ngxs/store';

import * as PasswordlessActions from './passwordless.action';
import { PasswordlessService } from '../passwordless.service';

export interface PasswordlessSateModel {
  isLoading: boolean;
}

/*
   Action Map:
*/

@State<PasswordlessSateModel>({
  name: 'passwordless',
  defaults: { isLoading: false }
})
export class PasswordlessSate {
  /*
    Constructor:
  */

  constructor(private passwordlessService: PasswordlessService) {}

  /*
    Action: update mail status
  */

  @Action(PasswordlessActions.UpdateMailStatus)
  async updateMailStatus(
    ctx: StateContext<PasswordlessSateModel>,
    action: PasswordlessActions.UpdateMailStatus
  ) {
    ctx.patchState({ isLoading: true });
    await this.passwordlessService
      ._updateMailStatus(action.payload.id, action.payload.emailToken)
      .toPromise();
    ctx.patchState({ isLoading: false });
  }
}
