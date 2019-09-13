import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardInlineTailComponent } from './card-inline-tail.component';

describe('CardInlineTailComponent', () => {
  let component: CardInlineTailComponent;
  let fixture: ComponentFixture<CardInlineTailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardInlineTailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardInlineTailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
