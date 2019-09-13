import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressCardSimpleComponent } from './address-card-simple.component';

describe('AddressCardSimpleComponent', () => {
  let component: AddressCardSimpleComponent;
  let fixture: ComponentFixture<AddressCardSimpleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddressCardSimpleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressCardSimpleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
