import { Component, Input, AfterViewInit, ViewChild } from '@angular/core';
import { PaymentService } from '../payment.service';

@Component({
  selector: 'app-payment-request',
  templateUrl: './payment-request.component.html',
  styleUrls: ['./payment-request.component.css']
})
export class PaymentRequestComponent implements AfterViewInit {
  // Attributes:
  @Input() amount: number = 999;
  @Input() label: string = 'simple plan';

  // UI:
  isLoading: boolean;
  confirmation: boolean;

  // Stripe card elemnet:
  @ViewChild('cardElement', { static: true }) cardElement;
  card: stripe.elements.Element;
  cardErrors: string;

  // Stripe payment request element:
  @ViewChild('payElement', { static: true }) payElement;
  elements: stripe.elements.Elements;
  paymentRequest: stripe.paymentRequest.StripePaymentRequest;
  paymentRequestBtn: stripe.elements.Element;
  showPaymentRequest: boolean;

  // Constructor:
  constructor(private payment: PaymentService) {}

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
          fontWeight: 500,
          fontFamily: 'Inter UI, Open Sans, Segoe UI, sans-serif',
          fontSize: '16px',
          fontSmoothing: 'antialiased',
          '::placeholder': {
            color: '#8791a3'
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
        this.cardErrors = error.message + ' 🙅'; // 🚫
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
    this.paymentRequest.on('token', async event => {
      console.log(event);

      // http service call to the backend
      // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX DO THE BACKEND CALL

      setTimeout(() => {
        event.complete('success');
      }, 1000);
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
    // $: call stripe api to create card source
    const { source, error } = await this.payment.stripe.createSource(this.card);
    if (error) {
      this.cardErrors = error.message + ' 🙅'; // 🚫
      console.log(`%c Error`, 'color: red');
      console.log(error);
    } else {
      console.log(source);
      console.log(`%c Success!`, 'color: blue');
      // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX DO THE BACKEND CALL
    }
  }
}

// const paymentIntentSecret = 'pi_91_secret_W9';
// const result = await this.payment.stripe.handleCardPayment(paymentIntentSecret);
// console.log(result);

// 1. here is the card
// 2. here is the thing that you should do
