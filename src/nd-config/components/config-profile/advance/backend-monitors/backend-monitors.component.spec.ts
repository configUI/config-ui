import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackendMonitorsComponent } from './backend-monitors.component';

describe('BackendMonitorsComponent', () => {
  let component: BackendMonitorsComponent;
  let fixture: ComponentFixture<BackendMonitorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackendMonitorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackendMonitorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
