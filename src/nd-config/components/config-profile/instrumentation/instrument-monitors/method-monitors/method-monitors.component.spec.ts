import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MethodMonitorsComponent } from './method-monitors.component';

describe('MethodMonitorsComponent', () => {
  let component: MethodMonitorsComponent;
  let fixture: ComponentFixture<MethodMonitorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MethodMonitorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MethodMonitorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
