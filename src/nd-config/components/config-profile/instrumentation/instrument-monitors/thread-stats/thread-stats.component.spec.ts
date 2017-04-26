import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreadStatsComponent } from './thread-stats.component';

describe('ThreadStatsComponent', () => {
  let component: ThreadStatsComponent;
  let fixture: ComponentFixture<ThreadStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThreadStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreadStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
