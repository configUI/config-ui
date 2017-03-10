import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigUiBreadcrumbComponent } from './config-ui-breadcrumb.component';

describe('ConfigUiBreadcrumbComponent', () => {
  let component: ConfigUiBreadcrumbComponent;
  let fixture: ComponentFixture<ConfigUiBreadcrumbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigUiBreadcrumbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigUiBreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
