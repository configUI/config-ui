import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowpathComponent } from './flowpath.component';

describe('FlowpathComponent', () => {
  let component: FlowpathComponent;
  let fixture: ComponentFixture<FlowpathComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlowpathComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowpathComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
