import {
  State,
  Selector,
  createSelector,
  StateContext,
  Action,
} from "@ngxs/store";
import { Injectable } from "@angular/core";

import { Plan } from "../plan.model";
import * as PlanActions from "./plan.action";

const plans: Plan[] = [
  {
    id: "1",
    ids: ["5d6cf1887c2713b78d602980", "5d6cf1b67c2713b78d602982"],
    name: "Simple",
    price: 999,
    mailCredit: 20,
    scanCredit: 10,
    type: "monthly",
  },
  {
    id: "2",
    ids: ["5d6cf1887c2713b78d602980", "5d6cf1b67c2713b78d602982"],
    name: "Pro",
    price: 1999,
    mailCredit: -1,
    scanCredit: 30,
    type: "monthly",
  },
  {
    id: "3",
    ids: ["5d6cf1887c2713b78d602980", "5d6cf1b67c2713b78d602982"],
    name: "Master",
    price: 2999,
    mailCredit: -1,
    scanCredit: 100,
    type: "monthly",
  },
  {
    id: "4",
    ids: ["5d6cf1887c2713b78d602980", "5d6cf1b67c2713b78d602982"],
    name: "Simple",
    price: 9999,
    mailCredit: 20,
    scanCredit: 10,
    type: "annual",
  },
  {
    id: "5",
    ids: ["5d6cf1887c2713b78d602980", "5d6cf1b67c2713b78d602982"],
    name: "Pro",
    price: 19999,
    mailCredit: -1,
    scanCredit: 30,
    type: "annual",
  },
  {
    id: "6",
    ids: ["5d6cf1887c2713b78d602980", "5d6cf1b67c2713b78d602982"],
    name: "Master",
    price: 29999,
    mailCredit: -1,
    scanCredit: 100,
    type: "annual",
  },
];

/*
   Plan State
*/

export interface PlanStateModel {
  plan: Plan;
  plans: Plan[];
  selectedPlan: Plan;
}

/*
   Initial State
*/

const initialState: PlanStateModel = {
  plan: null,
  plans: [],
  selectedPlan: null,
};

/*
   Action Map:
*/

@State<PlanStateModel>({ name: "plan", defaults: initialState })
@Injectable()
export class PlanState {
  // Constructor
  constructor() {}

  /*
   Selectors:
  */

  @Selector()
  static plans(state: PlanStateModel) {
    return state.plans;
  }

  // Selector dynamic
  static plansOf(type?: "monthly" | "annual") {
    return createSelector([PlanState], (state: PlanStateModel) => {
      if (["monthly", "annual"].includes(type)) {
        return state.plans.filter((plan) => plan.type === type);
      } else {
        return state.plans;
      }
    });
  }

  @Selector()
  static plan(state: PlanStateModel) {
    return state.plan;
  }

  @Selector()
  static selectedPlan(state: PlanStateModel) {
    return state.selectedPlan;
  }

  // Selector dynamic
  static isSelected(plan: Plan) {
    return createSelector([PlanState], (state: PlanStateModel) => {
      return state.selectedPlan ? state.selectedPlan.id === plan.id : false;
    });
  }

  /*
   Action: get plans
  */

  @Action(PlanActions.GetPlans)
  getPlans(ctx: StateContext<PlanStateModel>) {
    // return new sate
    ctx.patchState({ plans }); // from constant defined on the top of document
  }

  /*
   Action: select a plan
  */

  @Action(PlanActions.SelectPlan)
  selectMail(
    ctx: StateContext<PlanStateModel>,
    action: PlanActions.SelectPlan
  ) {
    // return new state
    ctx.patchState({ selectedPlan: action.payload });
  }
}
