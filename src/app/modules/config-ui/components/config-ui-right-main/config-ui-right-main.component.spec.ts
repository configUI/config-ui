import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigUiRightMainComponent } from './config-ui-right-main.component';

describe('ConfigUiRightMainComponent', () => {
  let component: ConfigUiRightMainComponent;
  let fixture: ComponentFixture<ConfigUiRightMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigUiRightMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigUiRightMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
