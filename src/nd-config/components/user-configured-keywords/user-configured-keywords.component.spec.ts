import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserConfiguredKeywordComponent } from './user-configured-keywords.component';

describe('UserConfiguredKeywordComponent', () => {
  let component: UserConfiguredKeywordComponent;
  let fixture: ComponentFixture<UserConfiguredKeywordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserConfiguredKeywordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserConfiguredKeywordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
