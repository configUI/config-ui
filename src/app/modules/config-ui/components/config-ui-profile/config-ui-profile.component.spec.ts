import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigUiProfileComponent } from './config-ui-profile.component';

describe('ConfigUiProfileComponent', () => {
  let component: ConfigUiProfileComponent;
  let fixture: ComponentFixture<ConfigUiProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigUiProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigUiProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
