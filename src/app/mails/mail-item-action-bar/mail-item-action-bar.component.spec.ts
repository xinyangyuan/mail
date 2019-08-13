import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailItemActionBarComponent } from './mail-item-action-bar.component';

describe('MailItemActionBarComponent', () => {
  let component: MailItemActionBarComponent;
  let fixture: ComponentFixture<MailItemActionBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailItemActionBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailItemActionBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
