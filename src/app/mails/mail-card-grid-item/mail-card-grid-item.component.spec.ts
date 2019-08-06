import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailCardGridItemComponent } from './mail-card-grid-item.component';

describe('MailCardGridItemComponent', () => {
  let component: MailCardGridItemComponent;
  let fixture: ComponentFixture<MailCardGridItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailCardGridItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailCardGridItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
