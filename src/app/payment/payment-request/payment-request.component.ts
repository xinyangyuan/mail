import { Component, Input, AfterViewInit, ViewChild } from '@angular/core';
import { PaymentService } from '../payment.service';

@Component({
  selector: 'app-payment-request',
  templateUrl: './payment-request.component.html',
  styleUrls: ['./payment-request.component.css']
})
export class PaymentRequestComponent implements AfterViewInit {
  // Attributes:
  @Input() amount: number;
  @Input() label: string;

  // Stripe:
  @ViewChild('payElement', { static: true }) payElement;
  elements: stripe.elements.Elements;
  paymentRequest: stripe.paymentRequest.StripePaymentRequest;
  paymentRequestBtn: stripe.elements.Element;

  // Constructor:
  constructor(private payment: PaymentService) {}

  // Init Method:
  ngAfterViewInit() {
    // initialize elements
    this.elements = this.payment.stripe.elements();

    // instantiate paymentRequest object
    this.paymentRequest = this.payment.stripe.paymentRequest({
      country: 'US',
      currency: 'usd',
      total: {
        label: this.label,
        amount: this.amount
      },
      requestPayerEmail: true
    });

    // crate and mount paymentRequest button
    this.paymentRequestBtn = this.elements.create('paymentRequestButton', {
      paymentRequest: this.paymentRequest,
      style: { paymentRequestButton: { type: 'default', theme: 'dark', height: '40px' } }
    });
    this.mountButton();

    // register stripe payment eventListener
    this.paymentRequest.on('token', async event => {
      console.log(event);

      // http service call to the backend
      setTimeout(() => {
        event.complete('success');
      }, 1000);
    });
  }

  // Helper: mount payment request button
  async mountButton() {
    // check broswer compatibility
    const result = await this.paymentRequest.canMakePayment();

    if (result) {
      this.paymentRequestBtn.mount(this.payElement.nativeElement);
    } else {
      document.getElementById('payElement').style.display = 'none';
    }
  }
}
