/*
   Component Actions:
*/

export class OpenPayment {
  static readonly type = '[Payment Element Component] Open Payment';
  constructor(public showLoading: boolean = false) {} // default does not show loading dialog modal
}

export class PaymentSourceCreated {
  static readonly type = '[Payment Element Component] Payment Source Created';
  constructor(public payload: stripe.Source) {}
}

export class ClosePayment {
  static readonly type = '[Payment Element Component] Close Payment';
}

/*
   Service Actions:
*/

export class PaymentRequiresAction {
  static readonly type = '[Plan Service] Payment Requires Action'; // 3d-secure
}

export class PaymentSucceeded {
  static readonly type = '[Plan Service] Open Payment';
  constructor(public payload: stripe.PaymentIntentResponse, public showResult: boolean = true) {}
}

export class PaymentFailed {
  static readonly type = '[Plan Service] Open Payment';
  constructor(public payload: stripe.PaymentIntentResponse, public showResult: boolean = true) {}
}
