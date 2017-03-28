import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HTTPBTConfigurationComponent } from './http-bt-configuration.component';

describe('HTTPBTConfigurationComponent', () => {
  let component: HTTPBTConfigurationComponent;
  let fixture: ComponentFixture<HTTPBTConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HTTPBTConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HTTPBTConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
