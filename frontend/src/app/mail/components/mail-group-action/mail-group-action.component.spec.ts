import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailGroupActionComponent } from './mail-group-action.component';

describe('MailGroupActionComponent', () => {
  let component: MailGroupActionComponent;
  let fixture: ComponentFixture<MailGroupActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailGroupActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailGroupActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
