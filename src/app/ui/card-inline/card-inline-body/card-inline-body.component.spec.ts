import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardInlineBodyComponent } from './card-inline-body.component';

describe('CardInlineBodyComponent', () => {
  let component: CardInlineBodyComponent;
  let fixture: ComponentFixture<CardInlineBodyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardInlineBodyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardInlineBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
