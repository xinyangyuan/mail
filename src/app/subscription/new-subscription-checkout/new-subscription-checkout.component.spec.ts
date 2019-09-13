import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSubscriptionCheckoutComponent } from './new-subscription-checkout.component';

describe('NewSubscriptionCheckoutComponent', () => {
  let component: NewSubscriptionCheckoutComponent;
  let fixture: ComponentFixture<NewSubscriptionCheckoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSubscriptionCheckoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSubscriptionCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
