import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigHomeComponent } from './config-home.component';

describe('ConfigHomeComponent', () => {
  let component: ConfigHomeComponent;
  let fixture: ComponentFixture<ConfigHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
