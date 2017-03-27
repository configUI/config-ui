import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigProfileRoutingComponent } from './config-profile-routing.component';

describe('ConfigProfileRoutingComponent', () => {
  let component: ConfigProfileRoutingComponent;
  let fixture: ComponentFixture<ConfigProfileRoutingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigProfileRoutingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigProfileRoutingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
