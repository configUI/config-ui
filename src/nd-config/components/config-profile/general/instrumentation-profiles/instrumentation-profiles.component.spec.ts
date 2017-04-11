import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstrumentationProfilesComponent } from './instrumentation-profiles.component';

describe('InstrumentationProfilesComponent', () => {
  let component: InstrumentationProfilesComponent;
  let fixture: ComponentFixture<InstrumentationProfilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstrumentationProfilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstrumentationProfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
