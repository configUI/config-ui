import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigBreadcrumbComponent } from './config-breadcrumb.component';

describe('ConfigBreadcrumbComponent', () => {
  let component: ConfigBreadcrumbComponent;
  let fixture: ComponentFixture<ConfigBreadcrumbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigBreadcrumbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigBreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
