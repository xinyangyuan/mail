import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailUpdateComponent } from './mail-update.component';

describe('MailUpdateComponent', () => {
  let component: MailUpdateComponent;
  let fixture: ComponentFixture<MailUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
