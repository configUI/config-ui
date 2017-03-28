import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MethodBTConfigurationComponent } from './method-bt-configuration.component';

describe('MethodBTConfigurationComponent', () => {
  let component: MethodBTConfigurationComponent;
  let fixture: ComponentFixture<MethodBTConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MethodBTConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MethodBTConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
