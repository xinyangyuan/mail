import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailListPageComponent } from './mail-list-page.component';

describe('MailListPageComponent', () => {
  let component: MailListPageComponent;
  let fixture: ComponentFixture<MailListPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailListPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
