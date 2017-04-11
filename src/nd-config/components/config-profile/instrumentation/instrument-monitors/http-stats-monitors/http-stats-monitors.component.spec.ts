import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpStatsMonitorsComponent } from './http-stats-monitors.component';

describe('HttpStatsMonitorsComponent', () => {
  let component: HttpStatsMonitorsComponent;
  let fixture: ComponentFixture<HttpStatsMonitorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HttpStatsMonitorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HttpStatsMonitorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
