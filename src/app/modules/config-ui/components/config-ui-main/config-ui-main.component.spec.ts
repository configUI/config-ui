import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigUiMainComponent } from './config-ui-main.component';

describe('ConfigUiMainComponent', () => {
  let component: ConfigUiMainComponent;
  let fixture: ComponentFixture<ConfigUiMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigUiMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigUiMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
