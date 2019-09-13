import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSubscriptionSelectPlanComponent } from './new-subscription-select-plan.component';

describe('NewSubscriptionSelectPlanComponent', () => {
  let component: NewSubscriptionSelectPlanComponent;
  let fixture: ComponentFixture<NewSubscriptionSelectPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSubscriptionSelectPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSubscriptionSelectPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
