import { Selector } from '@ngxs/store';

import { PlanState, PlanStateModel } from 'src/app/plan/store/plan.state';
import { AddressState, AddressStateModel } from 'src/app/address/store/address.state';

export class SubscriptionQuery {
  // Query: selectedPlan from plan store
  @Selector([PlanState.selectedPlan])
  static selectedPlan(selectedPlan: PlanStateModel['selectedPlan']) {
    return selectedPlan;
  }

  // Query: selectedAddress from address store
  @Selector([AddressState.selectedMailbox])
  static selectedMailbox(selectedMailbox: AddressStateModel['selectedMailbox']) {
    return selectedMailbox;
  }
}
