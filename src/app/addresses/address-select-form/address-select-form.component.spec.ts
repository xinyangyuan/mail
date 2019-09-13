import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressSelectFormComponent } from './address-select-form.component';

describe('AddressSelectFormComponent', () => {
  let component: AddressSelectFormComponent;
  let fixture: ComponentFixture<AddressSelectFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddressSelectFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressSelectFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
