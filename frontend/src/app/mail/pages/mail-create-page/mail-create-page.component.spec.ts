import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailCreatePageComponent } from './mail-create-page.component';

describe('MailCreatePageComponent', () => {
  let component: MailCreatePageComponent;
  let fixture: ComponentFixture<MailCreatePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailCreatePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailCreatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
