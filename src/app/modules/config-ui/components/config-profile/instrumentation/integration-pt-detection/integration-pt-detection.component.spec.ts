import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegrationPtDetectionComponent } from './integration-pt-detection.component';

describe('IntegrationPtDetectionComponent', () => {
  let component: IntegrationPtDetectionComponent;
  let fixture: ComponentFixture<IntegrationPtDetectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntegrationPtDetectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntegrationPtDetectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
