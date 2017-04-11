import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionConfigurationComponent } from './transaction-configuration.component';

describe('TransactionConfigurationComponent', () => {
  let component: TransactionConfigurationComponent;
  let fixture: ComponentFixture<TransactionConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
