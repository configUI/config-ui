import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceEntryPointComponent } from './service-entry-point.component';

describe('ServiceEntryPointComponent', () => {
  let component: ServiceEntryPointComponent;
  let fixture: ComponentFixture<ServiceEntryPointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceEntryPointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceEntryPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
