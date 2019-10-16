import { Component, Input, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { skipWhile } from 'rxjs/operators';
import { Store, Select } from '@ngxs/store';

import { PaymentService } from '../../payment.service';
import { PaymentState, PaymentStateModel } from '../../store/payment.state';
import * as PaymentActions from '../../store/payment.action';

@Component({
  selector: 'app-payment-request',
  templateUrl: './payment-request.component.html',
  styleUrls: ['./payment-request.component.css']
})
export class PaymentRequestComponent implements AfterViewInit {
  // Attributes:
  @Input() amount: number;
  @Input() label: string;
  @Output() source = new EventEmitter<stripe.Source>();
  @Select(PaymentState.paymentStatus) paymentStatus$: Observable<
    PaymentStateModel['paymentStatus']
  >;

  // Stripe card elemnet:
  @ViewChild('cardElement', { static: false }) cardElement;
  card: stripe.elements.Element;
  cardErrors: string;

  // Stripe payment request element:
  @ViewChild('payElement', { static: true }) payElement;
  elements: stripe.elements.Elements;
  paymentRequest: stripe.paymentRequest.StripePaymentRequest;
  paymentRequestBtn: stripe.elements.Element;
  showPaymentRequest: boolean;

  // Constructor:
  constructor(private payment: PaymentService, private store: Store) {}

  // Init Method:
  ngAfterViewInit() {
    /*
      Initialize Elements
    */

    this.elements = this.payment.stripe.elements({ locale: 'auto' });

    /*
      Card Element
    */

    // 1: create and mount card element
    this.card = this.elements.create('card', {
      style: {
        base: {
          color: '#32325D',
          iconColor: '#32325D',
          fontWeight: 500,
          fontFamily: 'Roboto, Inter UI, Open Sans, Segoe UI, sans-serif',
          fontSize: '16px',
          fontSmoothing: 'antialiased',
          '::placeholder': {
            color: '#8791a3',
            iconColor: '#8791a3'
          },
          ':disabled': {
            color: 'rgb(171, 171, 171)'
          }
        },
        invalid: {
          color: '#E25950'
        }
      }
    });
    this.card.mount(this.cardElement.nativeElement);

    // 2: register card element event listener
    this.card.on('change', ({ error }) => {
      if (error) {
        this.cardErrors = error.message + ' 🙅';
      } else {
        this.cardErrors = '';
      }
    });

    /*
      Payment Request Element
    */

    // 1: instantiate paymentRequest object
    this.paymentRequest = this.payment.stripe.paymentRequest({
      country: 'US',
      currency: 'usd',
      total: {
        label: this.label,
        amount: this.amount
      },
      requestPayerEmail: true
    });

    // 2: create and mount paymentRequest button
    this.paymentRequestBtn = this.elements.create('paymentRequestButton', {
      paymentRequest: this.paymentRequest,
      style: {
        paymentRequestButton: { type: 'default', theme: 'dark', height: '40px' }
      }
    });
    this.mountButton();

    // 3: register stripe payment eventListener
    this.paymentRequest.on('source', async event => {
      this.source.emit(event.source);
      this.store.dispatch(new PaymentActions.OpenPayment());
      this.paymentStatus$.pipe(skipWhile(value => value !== 'pending')).forEach(status => {
        switch (status) {
          case 'success':
          case 'requires_action':
            event.complete('success');
            break;
          default:
            event.complete('error');
        }
      });
    });
  }

  // Method: mount payment request button
  async mountButton() {
    // $: check broswer compatibility
    const result = await this.paymentRequest.canMakePayment();
    if (result) {
      this.showPaymentRequest = true;
      this.paymentRequestBtn.mount(this.payElement.nativeElement);
    } else {
      this.showPaymentRequest = false;
      document.getElementById('payElement').style.display = 'none';
    }
  }

  // Method: handle card element form
  async handleForm(event) {
    event.preventDefault();

    // call stripe api to create payment source
    const { source, error } = await this.payment.stripe.createSource(this.card);

    // emit source or dispay error
    if (error) {
      this.cardErrors = error.message + ' 🙅';
    } else {
      this.card.update({ disabled: true });
      this.source.emit(source);
      this.store.dispatch(new PaymentActions.OpenPayment(true));
    }
  }
}
