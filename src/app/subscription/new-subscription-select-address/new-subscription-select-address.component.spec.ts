import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSubscriptionSelectAddressComponent } from './new-subscription-select-address.component';

describe('NewSubscriptionSelectAddressComponent', () => {
  let component: NewSubscriptionSelectAddressComponent;
  let fixture: ComponentFixture<NewSubscriptionSelectAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSubscriptionSelectAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSubscriptionSelectAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
