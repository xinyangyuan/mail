import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpSenderComponent } from './sign-up-sender.component';

describe('SignUpSenderComponent', () => {
  let component: SignUpSenderComponent;
  let fixture: ComponentFixture<SignUpSenderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignUpSenderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpSenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
