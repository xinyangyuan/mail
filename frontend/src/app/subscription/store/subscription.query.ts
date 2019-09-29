import { Selector } from '@ngxs/store';

import { PlanState, PlanStateModel } from 'src/app/plans/store/plan.state';
import { AddressState, AddressStateModel } from 'src/app/addresses/store/address.state';

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
