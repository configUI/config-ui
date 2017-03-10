import { TestBed, inject } from '@angular/core/testing';

import { ConfigUiMainDataService } from './config-ui-main-data.service';

describe('ConfigUiMainDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConfigUiMainDataService]
    });
  });

  it('should ...', inject([ConfigUiMainDataService], (service: ConfigUiMainDataService) => {
    expect(service).toBeTruthy();
  }));
});
