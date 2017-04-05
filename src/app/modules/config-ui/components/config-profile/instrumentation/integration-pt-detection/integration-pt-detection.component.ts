import { Component, OnInit, Input } from '@angular/core';
import { SelectItem } from 'primeng/primeng';

import { IntegrationPTDetection, AddIPDetection } from '../../../../containers/instrumentation-data';
import { ConfigKeywordsService } from '../../../../services/config-keywords.service';
import { INTEGRATION_TYPE } from '../../../../constants/config-constant';
import { BackendInfo, BackendTableInfo } from '../../../../interfaces/instrumentation-info';

@Component({
  selector: 'app-integration-pt-detection',
  templateUrl: './integration-pt-detection.component.html',
  styleUrls: ['./integration-pt-detection.component.css']
})
export class IntegrationPtDetectionComponent implements OnInit {

  @Input()
  profileId: number;

  ipDetectionData: BackendTableInfo[];

  selectedIpDetectionData: IntegrationPTDetection;

  integrationDetail: IntegrationPTDetection;
  
  addIPDetectionDetail: AddIPDetection;

  backendInfo: BackendInfo[];

  displayNewIPDetection: boolean = false;
  detailDialog: boolean = false;

  backendTypeSelecetItem: SelectItem[] = [];
  IP = INTEGRATION_TYPE;

  constructor(private configKeywordsService: ConfigKeywordsService) { }

  ngOnInit() {
    this.loadIntegrationPTDetectionList();
    this.loadBackendInfoList();
  }

  /**This method is called to load Data in Table */
  loadIntegrationPTDetectionList() {
    this.configKeywordsService.getIntegrationPTDetectionList(this.profileId).subscribe(data => {
      this.ipDetectionData = data["backendDetail"];
    });
  }

  loadBackendInfoList() {
    this.configKeywordsService.getBackendList(this.profileId).subscribe(data => {
      this.backendInfo = data;
      this.createBackendTypeSelectItem();
    });
  }

  /**To Fetch data to show the Backend Type in Dropdown Of Dialog box of ADD functionality */
  createBackendTypeSelectItem() {
    this.backendTypeSelecetItem = [];
    for (let i = 0; i < this.backendInfo.length; i++) {
      this.backendTypeSelecetItem.push({ label: this.backendInfo[i].backendTypeName, value: this.backendInfo[i].backendTypeId });
    }
  }

  /**This method is called to Open Dialog to add new IntegrationPTDetection when you click ADD Button */
  onAddIntegrationPTDetection() {
    this.addIPDetectionDetail = new AddIPDetection();
    this.displayNewIPDetection = true;
  }

  /**This method is called to save the Data Of Dialog box in Backend */
  saveAddIntegrationPTDetection(): void {
    this.configKeywordsService.addIntegrationPTDetectionData(this.profileId, this.addIPDetectionDetail)
      .subscribe(data => {
        //Insert data in main table after inserting integration point detection in DB
      //  this.integrationPTDetectionData.push(dat);
      });
    this.displayNewIPDetection = false;
  }

  showDialogToDetail() {
    this.detailDialog = true;
  }

  onRowSelect(event) {
    this.detailDialog = true;
    this.integrationDetail = Object.assign({}, this.selectedIpDetectionData);
    console.log("this.selectedintegrationPTDetectionData", this.selectedIpDetectionData);
  }

  saveIntegrationDetail() {
    console.log("saveIntegrationDetail", "this.integrationDetail", this.integrationDetail);
    this.detailDialog = false;
  }
}

