import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BTResponseHeadersComponent } from './bt-response-headers.component';

describe('BTResponseHeadersComponent', () => {
  let component: BTResponseHeadersComponent;
  let fixture: ComponentFixture<BTResponseHeadersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BTResponseHeadersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BTResponseHeadersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
