import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BTHTTPBodyComponent } from './bt-http-body.component';

describe('BTHTTPBodyComponent', () => {
  let component: BTHTTPBodyComponent;
  let fixture: ComponentFixture<BTHTTPBodyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BTHTTPBodyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BTHTTPBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
