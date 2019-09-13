import { Plan } from '../plan.model';

/*
    Action
*/

export class GetPlans {
  static readonly type = '[Plan List Component] Get Plans';
}

export class SelectPlan {
  static readonly type = '[Plan Card Component] Select Plan';
  constructor(public payload: Plan) {}
}
