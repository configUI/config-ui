import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigAutoDiscoverTreeComponent } from './config-auto-discover-tree.component';

describe('ConfigAutoDiscoverTreeComponent', () => {
  let component: ConfigAutoDiscoverTreeComponent;
  let fixture: ComponentFixture<ConfigAutoDiscoverTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigAutoDiscoverTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigAutoDiscoverTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
