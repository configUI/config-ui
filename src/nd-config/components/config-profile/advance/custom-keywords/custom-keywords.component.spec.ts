import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomKeywordsComponent } from './custom-keywords.component';

describe('DebugComponent', () => {
  let component: CustomKeywordsComponent;
  let fixture: ComponentFixture<CustomKeywordsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomKeywordsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomKeywordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
