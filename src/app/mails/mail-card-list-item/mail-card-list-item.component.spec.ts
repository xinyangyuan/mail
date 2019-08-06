import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailCardListItemComponent } from './mail-card-list-item.component';

describe('MailCardListItemComponent', () => {
  let component: MailCardListItemComponent;
  let fixture: ComponentFixture<MailCardListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailCardListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailCardListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
