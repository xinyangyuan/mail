import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageLoadingSpinnerComponent } from './image-loading-spinner.component';

describe('ImageLoadingSpinnerComponent', () => {
  let component: ImageLoadingSpinnerComponent;
  let fixture: ComponentFixture<ImageLoadingSpinnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageLoadingSpinnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageLoadingSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
