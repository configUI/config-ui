import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionAttributeComponent } from './session-attribute.component';

describe('SessionAttributeComponent', () => {
  let component: SessionAttributeComponent;
  let fixture: ComponentFixture<SessionAttributeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionAttributeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionAttributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
