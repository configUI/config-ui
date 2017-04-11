import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigTreeDetailComponent } from './config-tree-detail.component';

describe('ConfigTreeDetailComponent', () => {
  let component: ConfigTreeDetailComponent;
  let fixture: ComponentFixture<ConfigTreeDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigTreeDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigTreeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
