import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordlessMailUpdateComponent } from './passwordless-mail-update.component';

describe('PasswordlessMailUpdateComponent', () => {
  let component: PasswordlessMailUpdateComponent;
  let fixture: ComponentFixture<PasswordlessMailUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordlessMailUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordlessMailUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
