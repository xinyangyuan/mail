import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailExpansionListItemComponent } from './mail-expansion-list-item.component';

describe('MailExpansionListItemComponent', () => {
  let component: MailExpansionListItemComponent;
  let fixture: ComponentFixture<MailExpansionListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailExpansionListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailExpansionListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
