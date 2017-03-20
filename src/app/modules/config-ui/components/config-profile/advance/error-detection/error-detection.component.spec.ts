import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorDetectionComponent } from './error-detection.component';

describe('ErrorDetectionComponent', () => {
  let component: ErrorDetectionComponent;
  let fixture: ComponentFixture<ErrorDetectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorDetectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorDetectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
