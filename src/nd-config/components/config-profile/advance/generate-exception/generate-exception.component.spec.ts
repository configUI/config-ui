import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateExceptionComponent } from './generate-exception.component';

describe('GenerateExceptionComponent', () => {
  let component: GenerateExceptionComponent;
  let fixture: ComponentFixture<GenerateExceptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateExceptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateExceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
