import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigTopNavBarComponent } from './config-top-nav-bar.component';

describe('ConfigTopNavBarComponent', () => {
  let component: ConfigTopNavBarComponent;
  let fixture: ComponentFixture<ConfigTopNavBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigTopNavBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigTopNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
