import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigUiApplicationComponent } from './config-ui-application.component';

describe('ConfigUiApplicationComponent', () => {
  let component: ConfigUiApplicationComponent;
  let fixture: ComponentFixture<ConfigUiApplicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigUiApplicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigUiApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
