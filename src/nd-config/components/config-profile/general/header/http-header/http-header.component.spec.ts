import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpHeaderComponent } from './http-header.component';

describe('HttpHeaderComponent', () => {
  let component: HttpHeaderComponent;
  let fixture: ComponentFixture<HttpHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HttpHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HttpHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
