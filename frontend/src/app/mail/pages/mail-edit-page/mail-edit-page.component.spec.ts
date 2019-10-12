import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailEditPageComponent } from './mail-edit-page.component';

describe('MailEditPageComponent', () => {
  let component: MailEditPageComponent;
  let fixture: ComponentFixture<MailEditPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailEditPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
