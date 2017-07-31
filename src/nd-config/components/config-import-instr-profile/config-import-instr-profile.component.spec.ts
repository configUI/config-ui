import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigImportInstrProfileComponent } from './config-import-instr-profile.component';

describe('ConfigImportInstrProfileComponent', () => {
  let component: ConfigImportInstrProfileComponent;
  let fixture: ComponentFixture<ConfigImportInstrProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigImportInstrProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigImportInstrProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
