import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailNavigationMenuComponent } from './mail-navigation-menu.component';

describe('MailNavigationMenuComponent', () => {
  let component: MailNavigationMenuComponent;
  let fixture: ComponentFixture<MailNavigationMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailNavigationMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailNavigationMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
