import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigTopologyListComponent } from './config-topology-list.component';

describe('ConfigTopologyListComponent', () => {
  let component: ConfigTopologyListComponent;
  let fixture: ComponentFixture<ConfigTopologyListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigTopologyListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigTopologyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
