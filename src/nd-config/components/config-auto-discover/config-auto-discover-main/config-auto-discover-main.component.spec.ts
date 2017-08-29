import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigAutoDiscoverMainComponent } from './config-auto-discover-main.component';

describe('ConfigAutoDiscoverMainComponent', () => {
  let component: ConfigAutoDiscoverMainComponent;
  let fixture: ComponentFixture<ConfigAutoDiscoverMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigAutoDiscoverMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigAutoDiscoverMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
