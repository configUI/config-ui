import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigLeftSideBarComponent } from './config-left-side-bar.component';

describe('ConfigLeftSideBarComponent', () => {
  let component: ConfigLeftSideBarComponent;
  let fixture: ComponentFixture<ConfigLeftSideBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigLeftSideBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigLeftSideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
