import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardInlineComponent } from './card-inline.component';

describe('CardInlineComponent', () => {
  let component: CardInlineComponent;
  let fixture: ComponentFixture<CardInlineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardInlineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardInlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
