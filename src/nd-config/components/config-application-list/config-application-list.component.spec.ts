import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigApplicationListComponent } from './config-application-list.component';

describe('ConfigApplicationListComponent', () => {
  let component: ConfigApplicationListComponent;
  let fixture: ComponentFixture<ConfigApplicationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigApplicationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigApplicationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
