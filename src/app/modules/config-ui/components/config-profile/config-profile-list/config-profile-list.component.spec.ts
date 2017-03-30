import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigProfileListComponent } from './config-profile-list.component';

describe('ConfigProfileListComponent', () => {
  let component: ConfigProfileListComponent;
  let fixture: ComponentFixture<ConfigProfileListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigProfileListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigProfileListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
