import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigUiTopologyComponent } from './config-ui-topology.component';

describe('ConfigUiTopologyComponent', () => {
  let component: ConfigUiTopologyComponent;
  let fixture: ComponentFixture<ConfigUiTopologyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigUiTopologyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigUiTopologyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
