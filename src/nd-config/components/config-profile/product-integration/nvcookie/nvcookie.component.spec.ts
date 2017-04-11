import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NVCookieComponent } from './nvcookie.component';

describe('NVCookieComponent', () => {
  let component: NVCookieComponent;
  let fixture: ComponentFixture<NVCookieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NVCookieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NVCookieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
