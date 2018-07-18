import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NDEClusterConfiguration } from './nde-cluster-configuration.component';

describe('HotspotComponent', () => {
  let component: NDEClusterConfiguration;
  let fixture: ComponentFixture<NDEClusterConfiguration>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NDEClusterConfiguration ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NDEClusterConfiguration);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
