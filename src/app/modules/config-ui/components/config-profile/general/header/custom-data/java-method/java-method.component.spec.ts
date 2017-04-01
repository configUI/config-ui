import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JavaMethodComponent } from './java-method.component';

describe('JavaMethodComponent', () => {
  let component: JavaMethodComponent;
  let fixture: ComponentFixture<JavaMethodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JavaMethodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JavaMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
