import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigUiTopologyDetailComponent } from './config-ui-topology-detail.component';

describe('ConfigUiTopologyDetailComponent', () => {
  let component: ConfigUiTopologyDetailComponent;
  let fixture: ComponentFixture<ConfigUiTopologyDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigUiTopologyDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigUiTopologyDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
