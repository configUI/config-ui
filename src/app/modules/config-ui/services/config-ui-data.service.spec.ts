import { TestBed, inject } from '@angular/core/testing';

import { ConfigUiDataService } from './config-ui-data.service';

describe('ConfigUiDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConfigUiDataService]
    });
  });

  it('should ...', inject([ConfigUiDataService], (service: ConfigUiDataService) => {
    expect(service).toBeTruthy();
  }));
});
