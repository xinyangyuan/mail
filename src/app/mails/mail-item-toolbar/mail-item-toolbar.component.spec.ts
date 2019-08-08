import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailItemToolbarComponent } from './mail-item-toolbar.component';

describe('MailItemToolbarComponent', () => {
  let component: MailItemToolbarComponent;
  let fixture: ComponentFixture<MailItemToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailItemToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailItemToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
