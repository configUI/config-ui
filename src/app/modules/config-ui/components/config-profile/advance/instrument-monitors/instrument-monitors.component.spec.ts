import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstrumentMonitorsComponent } from './instrument-monitors.component';

describe('InstrumentMonitorsComponent', () => {
  let component: InstrumentMonitorsComponent;
  let fixture: ComponentFixture<InstrumentMonitorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstrumentMonitorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstrumentMonitorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
