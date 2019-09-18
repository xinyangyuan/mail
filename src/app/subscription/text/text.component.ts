import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { PaymentService } from 'src/app/payment/payment.service';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.css']
})
export class TextComponent implements OnInit, AfterViewInit {
  constructor(private payment: PaymentService, private dialog: MatDialog) {}

  ngOnInit() {}

  async ngAfterViewInit() {
    const paymentIntentSecret = 'pi_1FJzK2FYfUyWzKZuROocoulV_secret_txn9RVyR39SF5K6f0xDaerLbU';
    const { error, paymentIntent: result } = await this.payment.stripe.handleCardPayment(
      paymentIntentSecret
    );
    if (error) {
      console.log('%c Error', 'color: red');
      console.log(error);
    } else {
      console.log('%c Success', 'color: blue');
      console.log(result);
    }
  }

  onPay(source: stripe.Source) {
    // this.store.dispatch(new SubscriptionActions.CreateSubscription({ source, plan, mailbox })); // success or fail
    // const paymentIntentSecret = 'pi_91_secret_W9';
    // const result = await this.payment.stripe.handleCardPayment(paymentIntentSecret);
    // console.log(result);
  }
}
