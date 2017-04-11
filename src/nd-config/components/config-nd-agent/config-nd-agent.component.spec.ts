import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigNdAgentComponent } from './config-nd-agent.component';

describe('ConfigNdAgentComponent', () => {
  let component: ConfigNdAgentComponent;
  let fixture: ComponentFixture<ConfigNdAgentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigNdAgentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigNdAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
