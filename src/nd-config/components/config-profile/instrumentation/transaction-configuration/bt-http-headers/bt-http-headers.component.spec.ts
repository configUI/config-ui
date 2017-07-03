import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BTHTTPHeadersComponent } from './bt-http-headers.component';

describe('BTHTTPHeadersComponent', () => {
  let component: BTHTTPHeadersComponent;
  let fixture: ComponentFixture<BTHTTPHeadersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BTHTTPHeadersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BTHTTPHeadersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
