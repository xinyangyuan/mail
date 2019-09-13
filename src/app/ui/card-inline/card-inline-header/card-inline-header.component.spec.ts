import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardInlineHeaderComponent } from './card-inline-header.component';

describe('CardInlineHeaderComponent', () => {
  let component: CardInlineHeaderComponent;
  let fixture: ComponentFixture<CardInlineHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardInlineHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardInlineHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
