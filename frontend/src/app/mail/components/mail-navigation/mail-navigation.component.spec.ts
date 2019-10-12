import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailNavigationComponent } from './mail-navigation.component';

describe('MailNavigationComponent', () => {
  let component: MailNavigationComponent;
  let fixture: ComponentFixture<MailNavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailNavigationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
