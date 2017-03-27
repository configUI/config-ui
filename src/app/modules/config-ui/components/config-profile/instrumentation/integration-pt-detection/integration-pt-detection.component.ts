import { Component, OnInit, Input } from '@angular/core';
import { SelectItem } from 'primeng/primeng';

import { IntegrationPTDetection } from '../../../../containers/instrumentation-data';
import { ConfigKeywordsService } from '../../../../services/config-keywords.service';

@Component({
  selector: 'app-integration-pt-detection',
  templateUrl: './integration-pt-detection.component.html',
  styleUrls: ['./integration-pt-detection.component.css']
})
export class IntegrationPtDetectionComponent implements OnInit {
  
  @Input()
  profileId: number;

  integrationPTDetectionData: IntegrationPTDetection[];
  integrationPTDetectionDetail: IntegrationPTDetection;
  selectedintegrationPTDetectionData: IntegrationPTDetection[];

  displayNewIntegrationPTDetection: boolean = false;
  IntegrationPTDetectionType: SelectItem[] = [];

  constructor(private configKeywordsService: ConfigKeywordsService) { }

  ngOnInit() {
    this.loadIntegrationPTDetectionList();
  }

  /**This method is called to load Data in Table */
  loadIntegrationPTDetectionList() {
    this.configKeywordsService.getIntegrationPTDetectionList(this.profileId).subscribe(data => {
      this.integrationPTDetectionData = data["backendDetail"];
      this.loadIntegrationPTDetectionTypeList();
    });
  }

/**To Fetch data to show the Backend Type in Dropdown Of Dialog box of ADD functionality */
    loadIntegrationPTDetectionTypeList(){
    this.IntegrationPTDetectionType = [];
    for (let i = 0; i < this.integrationPTDetectionData.length; i++) {
      this.IntegrationPTDetectionType.push({ label: this.integrationPTDetectionData[i].type, value: this.integrationPTDetectionData[i].type });
    }
  }

  /**This method is called to Open Dialog to add new IntegrationPTDetection when you click ADD Button */
  onAddIntegrationPTDetection() {
    this.integrationPTDetectionDetail = new IntegrationPTDetection();
    this.displayNewIntegrationPTDetection = true;
  }

  /**This method is called to save the Data Of Dialog box in Backend */
  saveAddIntegrationPTDetection(): void {
    this.configKeywordsService.addIntegrationPTDetectionData(this.integrationPTDetectionDetail)
      .subscribe(data => {
        //Insert data in main table after inserting integration point detection in DB
        this.integrationPTDetectionData.push(data["backendDetail"]);
      });
    this.displayNewIntegrationPTDetection = false;
  }
}

