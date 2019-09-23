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

// export class OpenCardPayment {}
// export class OpenRequestAPIPayment {}
// export class ClosePayment {}

/*
   Service Actions:
*/

export class PaymentRequiresAction {
  static readonly type = '[Payment Service] Payment Requires Action'; // 3d-secure
}

export class PaymentSucceeded {
  static readonly type = '[Payment Service] Payment Succeeded';
  constructor(public payload: stripe.PaymentIntentResponse, public showResult: boolean = true) {}
}

export class PaymentFailed {
  static readonly type = '[Payment Service] Payment Failed';
  constructor(public payload: stripe.PaymentIntentResponse, public showResult: boolean = true) {}
}
