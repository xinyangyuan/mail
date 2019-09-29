import { getActionTypeFromInstance } from '@ngxs/store';

import { SignOut } from '../../auth/store/auth.action';

export function logoutPlugin(state, action, next) {
  // Use the get action type helper to determine the type
  if (getActionTypeFromInstance(action) === SignOut.type) {
    // if we are a logout type, lets erase all the state
    state = {};
  }

  // return the next function with the empty state
  return next(state, action);
}
