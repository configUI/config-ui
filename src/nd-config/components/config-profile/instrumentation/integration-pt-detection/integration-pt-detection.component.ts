import { Component, OnInit, Input } from '@angular/core';
import { SelectItem } from 'primeng/primeng';

import { IntegrationPTDetection, BackendTableInfo, AddIPDetection, NamingRuleAndExitPoint, EndPointInfo, EndPoint, NamingRule } from '../../../../containers/instrumentation-data';
import { ConfigKeywordsService } from '../../../../services/config-keywords.service';
import { ConfigUtilityService } from '../../../../services/config-utility.service';
import { INTEGRATION_TYPE } from '../../../../constants/config-constant';
import { BackendInfo } from '../../../../interfaces/instrumentation-info';

import { cloneObject } from '../../../../utils/config-utility';

import { Messages } from '../../../../constants/config-constant'

@Component({
  selector: 'app-integration-pt-detection',
  templateUrl: './integration-pt-detection.component.html',
  styleUrls: ['./integration-pt-detection.component.css']
})
export class IntegrationPtDetectionComponent implements OnInit {
  @Input()
  saveDisable: boolean;

  @Input()
  profileId: number;

  ipDetectionData: BackendTableInfo[];

  selectedIpDetectionData: IntegrationPTDetection;

  integrationDetail: IntegrationPTDetection;
  namingRuleAndExitPoint: NamingRuleAndExitPoint;


  addIPDetectionDetail: AddIPDetection;

  backendInfo: BackendInfo[];

  displayNewIPDetection: boolean = false;
  detailDialog: boolean = false;

  backendTypeSelecetItem: SelectItem[] = [];
  IP = INTEGRATION_TYPE;

  constructor(private configKeywordsService: ConfigKeywordsService, private configUtilityService: ConfigUtilityService) { }

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

  /**This method is called to save the Data Add New Integration Point Detection data */
  saveAddIntegrationPTDetection(): void {
    this.configKeywordsService.addIntegrationPTDetectionData(this.profileId, this.addIPDetectionDetail)
      .subscribe(data => {
        //Getting index for set data in main array table data.
        let index = this.getTableIndex(data.backendTypeId);

        //Insert data in main table after inserting integration point detection in DB
        let endPointData: EndPoint = new EndPoint();
        endPointData.id = data.id;
        endPointData.description = data.desc;
        endPointData.enabled = data.enabled;
        endPointData.fqm = data.fqm;
        endPointData.name = data.name;

        this.ipDetectionData[index].lstEndPoints.push(endPointData);
        this.configUtilityService.successMessage(Messages);
      });
    this.displayNewIPDetection = false;
  }

  onRowSelect() {
    this.detailDialog = true;
    this.integrationDetail = cloneObject(this.selectedIpDetectionData);
  }

  /**This method is used to update Naming Rules & Exit Points data. */
  saveIntegrationDetail() {
    console.log("this.integrationDetail", this.integrationDetail);
    this.namingRuleAndExitPoint = new NamingRuleAndExitPoint();
    this.namingRuleAndExitPoint.backendTypeId = this.integrationDetail.id;
    this.namingRuleAndExitPoint.databaseProductVersion = this.integrationDetail.namingRule.databaseProductVersion;
    this.namingRuleAndExitPoint.driverVersion = this.integrationDetail.namingRule.driverVersion;
    this.namingRuleAndExitPoint.host = this.integrationDetail.namingRule.host;
    this.namingRuleAndExitPoint.port = this.integrationDetail.namingRule.port;
    this.namingRuleAndExitPoint.serviceName = this.integrationDetail.namingRule.serviceName;
    this.namingRuleAndExitPoint.tableName = this.integrationDetail.namingRule.tableName;
    this.namingRuleAndExitPoint.topicName = this.integrationDetail.namingRule.topicName;
    this.namingRuleAndExitPoint.url = this.integrationDetail.namingRule.url;
    this.namingRuleAndExitPoint.lstEndPoints = [];
    this.namingRuleAndExitPoint.query = this.integrationDetail.namingRule.query;

    for (let i = 0; i < this.integrationDetail.lstEndPoints.length; i++) {
      this.namingRuleAndExitPoint.lstEndPoints[i] = { id: this.integrationDetail.lstEndPoints[i].id, enabled: this.integrationDetail.lstEndPoints[i].enabled };;
    }

    this.detailDialog = false;
    this.configKeywordsService.addIPNamingAndExit(this.profileId, this.namingRuleAndExitPoint.backendTypeId, this.namingRuleAndExitPoint)
      .subscribe(data => {
        //Getting index for set data in main array table data.
        let index = this.getTableIndex(data.backendTypeId);

        this.setNamingRuleAndExitPointData(this.ipDetectionData[index].namingRule, data);
        this.setEndPointData(this.ipDetectionData[index].lstEndPoints, data.lstEndPoints);

        this.configUtilityService.successMessage(Messages);
      }
      );
  }

  /**
   * Set NamingRuleAndExitPoint data in main table.
   * @param NamingRule of maintable data.
   * @param updated NamingRule.
   */
  setNamingRuleAndExitPointData(backendTableInfo: NamingRule, data: NamingRuleAndExitPoint) {
    backendTableInfo.databaseProductName = data.databaseProductName;
    backendTableInfo.databaseProductVersion = data.databaseProductVersion;
    backendTableInfo.driverName = data.driverName;
    backendTableInfo.driverVersion = data.driverVersion;
    backendTableInfo.host = data.host;
    backendTableInfo.port = data.port;
    backendTableInfo.query = data.query;
    backendTableInfo.serviceName = data.serviceName;
    backendTableInfo.tableName = data.tableName;
    backendTableInfo.topicName = data.topicName;
    backendTableInfo.url = data.url;
    backendTableInfo.userName = data.userName;
  }

  /**Used to set updated EndPoint Data in main table. */
  setEndPointData(mainTableEndPoints: EndPoint[], updatedEndPoints: EndPointInfo[]) {
    for (let i = 0; i < mainTableEndPoints.length; i++) {
      mainTableEndPoints[i].enabled = this.getEndPointValue(mainTableEndPoints[i].id, updatedEndPoints);
    }
  }

  /**
   *  This method return EndPoint Value ie. enabled/disabled
   */
  getEndPointValue(id, updatedEndPoints: EndPointInfo[]): boolean {
    for (let i = 0; i < updatedEndPoints.length; i++) {
      if (id == updatedEndPoints[i].id) {
        return updatedEndPoints[i].enabled;
      }
    }
    return false;
  }

  /**This method match the backend id with backend rowdata's id.
   * It will return row index for update data.
   */
  getTableIndex(backendId: number) {
    for (let i = 0; i < this.ipDetectionData.length; i++) {
      if (this.ipDetectionData[i].id == backendId) {
        return i;
      }
    }
  }

}

