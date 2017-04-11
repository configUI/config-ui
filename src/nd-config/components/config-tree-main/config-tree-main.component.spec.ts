import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigTreeMainComponent } from './config-tree-main.component';

describe('ConfigTreeMainComponent', () => {
  let component: ConfigTreeMainComponent;
  let fixture: ComponentFixture<ConfigTreeMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigTreeMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigTreeMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
