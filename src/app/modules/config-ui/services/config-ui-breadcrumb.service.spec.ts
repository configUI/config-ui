import { TestBed, inject } from '@angular/core/testing';

import { ConfigUiBreadcrumbService } from './config-ui-breadcrumb.service';

describe('ConfigUiBreadcrumbService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConfigUiBreadcrumbService]
    });
  });

  it('should ...', inject([ConfigUiBreadcrumbService], (service: ConfigUiBreadcrumbService) => {
    expect(service).toBeTruthy();
  }));
});
