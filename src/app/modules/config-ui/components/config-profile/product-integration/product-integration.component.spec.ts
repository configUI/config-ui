import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductIntegrationComponent } from './product-integration.component';

describe('ProductIntegrationComponent', () => {
  let component: ProductIntegrationComponent;
  let fixture: ComponentFixture<ProductIntegrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductIntegrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductIntegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
