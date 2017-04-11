import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitorsComponent } from './monitors.component';

describe('MonitorsComponent', () => {
  let component: MonitorsComponent;
  let fixture: ComponentFixture<MonitorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
