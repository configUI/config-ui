import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ConfirmationService, SelectItem } from 'primeng/primeng';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { KeywordData, KeywordList } from '../../../../../containers/keyword-data';

import { IntegrationPTDetection, BackendTableInfo, AddIPDetection, NamingRuleAndExitPoint, EndPointInfo, EndPoint, NamingRule } from '../../../../../containers/instrumentation-data';
import { ConfigKeywordsService } from '../../../../../services/config-keywords.service';
import { ConfigUtilityService } from '../../../../../services/config-utility.service';
import { INTEGRATION_TYPE } from '../../../../../constants/config-constant';
import { BackendInfo } from '../../../../../interfaces/instrumentation-info';

import { cloneObject } from '../../../../../utils/config-utility';
import { ImmutableArray } from '../../../../../utils/immutable-array';

import { Messages, descMsg } from '../../../../../constants/config-constant'

import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-integration-pt',
  templateUrl: './integration-pt.component.html',
  styleUrls: ['./integration-pt.component.css']
})
export class IntegrationPtComponent implements OnInit {

  @Output()
  keywordData = new EventEmitter();

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

  integrationPoints: Object;
  subscription: Subscription;

  /**These are those keyword which are used in current screen. */
  keywordList = ['NDEntryPointsFile', 'ndBackendNamingRulesFile'];

  displayNewIPDetection: boolean = false;
  detailDialog: boolean = false;

  backendTypeSelecetItem: SelectItem[] = [];
  IP = INTEGRATION_TYPE;

  endPoint: EndPoint[];
  agentType: string = "";

  constructor(private route: ActivatedRoute, private configKeywordsService: ConfigKeywordsService, private configUtilityService: ConfigUtilityService, private confirmationService: ConfirmationService, private store: Store<KeywordList>) {
    this.agentType = sessionStorage.getItem("agentType");
    this.subscription = this.store.select("keywordData").subscribe(data => {
      var keywordDataVal = {}
      this.keywordList.map(function (key) {
        keywordDataVal[key] = data[key];
      })
      this.integrationPoints = keywordDataVal;
    });
   
    // this.loadIntegrationPTDetectionList();
    // this.loadBackendInfoList();
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.profileId = params['profileId'];
      if(this.profileId == 1 || this.profileId == 777777 || this.profileId == 888888)
        this.saveDisable =  true;
    });
    this.loadIntegrationPTDetectionList();
    this.loadBackendInfoList();
  }

  /**This method is called to load Data in Table */
  loadIntegrationPTDetectionList() {
    this.route.params.subscribe((params: Params) => {
      this.profileId = params['profileId'];
      if(this.profileId == 1 || this.profileId == 777777 || this.profileId == 888888)
        this.saveDisable =  true;
    });
    this.configKeywordsService.getIntegrationPTDetectionList(this.profileId).subscribe(data => {
      this.ipDetectionData = data["backendDetail"];
    });
  }

  loadBackendInfoList() {
    this.route.params.subscribe((params: Params) => {
      this.profileId = params['profileId'];
      if(this.profileId == 1 || this.profileId == 777777 || this.profileId == 888888)
        this.saveDisable =  true;
    });
    this.configKeywordsService.getBackendList(this.profileId).subscribe(data => {
      this.backendInfo = data;
      this.createBackendTypeSelectItem();
    });
  }

  /**To Fetch data to show the Backend Type in Dropdown Of Dialog box of ADD functionality */
  createBackendTypeSelectItem() {
    this.backendTypeSelecetItem = [];
    let arr = [];
    for (let i = 0; i < this.backendInfo.length; i++) {
      arr.push(this.backendInfo[i].backendTypeName);
    }
    arr.sort();
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < this.backendInfo.length; j++) {
        if (arr[i] == this.backendInfo[j].backendTypeName) {
          this.backendTypeSelecetItem.push({ label: arr[i], value: this.backendInfo[j].backendTypeId });
        }
      }
    }
  }

  /**This method is called to Open Dialog to add new IntegrationPTDetection when you click ADD Button */
  onAddIntegrationPTDetection() {
    this.addIPDetectionDetail = new AddIPDetection();
    this.displayNewIPDetection = true;
  }

  /**This method is called to save the Data Add New Integration Point Detection data */
  saveAddIntegrationPTDetection(): void {
    if (this.addIPDetectionDetail.desc != null) {
      if (this.addIPDetectionDetail.desc.length > 500) {
        this.configUtilityService.errorMessage(descMsg);
        return;
      }
    }
    this.addIPDetectionDetail.fqm = this.addIPDetectionDetail.fqm.trim();
    this.addIPDetectionDetail.agent = this.agentType;
    if(this.agentType == "Java"){
      this.addIPDetectionDetail.module = "-";
    }
    this.configKeywordsService.addIntegrationPTDetectionData(this.profileId, this.addIPDetectionDetail)
      .subscribe(data => {
        //Getting index for set data in main array table data.
        let index = this.getTableIndex(data.backendTypeId);
        let that = this;
        let filePath;
        //Insert data in main table after inserting integration point detection in DB
        let endPointData: EndPoint = new EndPoint();
        endPointData.id = data.id;
        endPointData.description = data.desc;
        endPointData.enabled = data.enabled;
        endPointData.fqm = data.fqm;
        endPointData.name = data.name;
        if(this.agentType == "Java"){
          endPointData.agent = "Java";
          endPointData.module = "-";
        }
        else if(this.agentType == "Dot Net")
        {
            endPointData.agent = "Dot Net";
        }
        // this.ipDetectionData[index].lstEndPoints.push(endPointData);

        that.configKeywordsService.getFilePath(this.profileId).subscribe(data => {

          //For sending Runtime Changes

          filePath = data["_body"];
          that.integrationPoints['NDEntryPointsFile'].path = filePath + "/NDEntryPointFile.txt";;
          that.integrationPoints['ndBackendNamingRulesFile'].path = filePath + "/BackendNamingRule.txt";

          that.keywordData.emit(that.integrationPoints);
        });
        this.ipDetectionData[index].lstEndPoints = ImmutableArray.push(this.ipDetectionData[index].lstEndPoints, endPointData);
        this.loadIntegrationPTDetectionList();
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
    this.namingRuleAndExitPoint = new NamingRuleAndExitPoint();
    this.namingRuleAndExitPoint.backendTypeId = this.integrationDetail.id;
    this.namingRuleAndExitPoint.databaseProductName = this.integrationDetail.namingRule.databaseProductName;
    this.namingRuleAndExitPoint.driverName = this.integrationDetail.namingRule.driverName;
    this.namingRuleAndExitPoint.databaseProductVersion = this.integrationDetail.namingRule.databaseProductVersion;
    this.namingRuleAndExitPoint.driverVersion = this.integrationDetail.namingRule.driverVersion;
    this.namingRuleAndExitPoint.host = this.integrationDetail.namingRule.host;
    this.namingRuleAndExitPoint.port = this.integrationDetail.namingRule.port;
    this.namingRuleAndExitPoint.serviceName = this.integrationDetail.namingRule.serviceName;
    this.namingRuleAndExitPoint.tableName = this.integrationDetail.namingRule.tableName;
    this.namingRuleAndExitPoint.topicName = this.integrationDetail.namingRule.topicName;
    this.namingRuleAndExitPoint.url = this.integrationDetail.namingRule.url;
    this.namingRuleAndExitPoint.userName = this.integrationDetail.namingRule.userName;
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
        let that = this;
        let filePath;
        that.configKeywordsService.getFilePath(this.profileId).subscribe(data => {

          //For sending Runtime Changes                    
          filePath = data["_body"];
          that.integrationPoints['NDEntryPointsFile'].path = filePath + "/NDEntryPointFile.txt";
          that.integrationPoints['ndBackendNamingRulesFile'].path = filePath + "/BackendNamingRule.txt";
          that.keywordData.emit(that.integrationPoints);
        });

        this.setNamingRuleAndExitPointData(this.ipDetectionData[index].namingRule, data);
        this.setEndPointData(this.ipDetectionData[index].lstEndPoints, data.lstEndPoints);
        this.loadIntegrationPTDetectionList();
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

  /**This method is used to delete the Integration point
   * This method will also check if the integration point is pre-Defined or custom type.
   */
  deleteIP(event) {
    this.confirmationService.confirm({
      message: 'Do you want to delete the selected row?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        //Get Selected Applications's AppId
        let ipID = event["id"];
        this.configKeywordsService.deleteIntegrationPointData(ipID, this.profileId)
          .subscribe(data => {
            for (let i = 0; i < this.integrationDetail.lstEndPoints.length; i++) {
              if (this.integrationDetail.lstEndPoints[i] == event) {
                this.integrationDetail.lstEndPoints.splice(i, 1);
              }
            }
            this.loadIntegrationPTDetectionList();
            this.configUtilityService.infoMessage("Deleted Successfully");
          })
      },
      reject: () => {
      }
    });
  }


}

