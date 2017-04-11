import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigRightContentComponent } from './config-right-content.component';

describe('ConfigRightContentComponent', () => {
  let component: ConfigRightContentComponent;
  let fixture: ComponentFixture<ConfigRightContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigRightContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigRightContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
