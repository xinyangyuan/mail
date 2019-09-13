import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingSpinnerCubeComponent } from './loading-spinner-cube.component';

describe('LoadingSpinnerCubeComponent', () => {
  let component: LoadingSpinnerCubeComponent;
  let fixture: ComponentFixture<LoadingSpinnerCubeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadingSpinnerCubeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingSpinnerCubeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
