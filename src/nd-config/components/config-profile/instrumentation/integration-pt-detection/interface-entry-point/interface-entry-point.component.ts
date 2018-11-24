import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import { Subscription } from 'rxjs/Subscription';

import { InterfaceDetail, BackendInterfaceTableInfo, InterfaceEndPointInfo, InterfaceEndPoint, InterfacePoint } from '../../../../../containers/instrumentation-data';
import { ConfigKeywordsService } from '../../../../../services/config-keywords.service';
import { ConfigUtilityService } from '../../../../../services/config-utility.service';
import { BackendInfo } from '../../../../../interfaces/instrumentation-info';

import { cloneObject } from '../../../../../utils/config-utility';

import { addMessage } from '../../../../../constants/config-constant'

import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-interface-point',
  templateUrl: './interface-entry-point.component.html',
  styleUrls: ['./interface-entry-point.component.css']
})
export class InterfaceEntryPointComponent implements OnInit {

  @Output()
  keywordData = new EventEmitter();

  @Input()
  saveDisable: boolean;

  @Input()
  profileId: number;

  ipDetectionData: BackendInterfaceTableInfo[];

  selectedIpDetectionData: InterfaceDetail;

  integrationDetail: InterfaceDetail;

  backendInfo: BackendInfo[];

  interfacePoints: Object;
  subscription: Subscription;

  /**These are those keyword which are used in current screen. */
  keywordList = ['NDInterfaceEntryPointsFile'];

  displayNewIPDetection: boolean = false;
  detailDialog: boolean = false;

  checkboxValue: boolean = false;
  typeSelectItem: SelectItem[] = [];

  endPoint: InterfaceEndPoint[];
  agentType: string = "";
  isProfilePerm: boolean;
  type: string;
  subType: string;
  subTypeList: string[];
  typeRepeatArr: string[] = [];
  interfacePoint: InterfacePoint;
  keywordValue: Object;

  constructor(private route: ActivatedRoute, private configKeywordsService: ConfigKeywordsService, 
              private configUtilityService: ConfigUtilityService) {}

  ngOnInit() {
    this.agentType = sessionStorage.getItem("agentType");
    this.isProfilePerm = +sessionStorage.getItem("ProfileAccess") == 4 ? true : false;
    this.route.params.subscribe((params: Params) => {
      this.profileId = params['profileId'];
      if (this.profileId == 1 || this.profileId == 777777 || this.profileId == 888888)
        this.saveDisable = true;
    });

    if (this.configKeywordsService.keywordData != undefined) {
      this.keywordValue = this.configKeywordsService.keywordData;
      let config = {
        'configkeyword' : this.keywordValue
      }
      sessionStorage.setItem('keywordValue', JSON.stringify(config));
    }
    else {
      // Commenting this as store is giving default value instead of saved
      let keyVal = JSON.parse(sessionStorage.getItem('keywordValue'));
      this.keywordValue = keyVal['configkeyword'];
    }
    this.interfacePoints = {};
    this.keywordList.forEach((key) => {
      if (this.keywordValue.hasOwnProperty(key)) {
        this.interfacePoints[key] = this.keywordValue[key];
        if (this.interfacePoints[key].value == "true")
          this.checkboxValue = true;
        else
          this.checkboxValue = false;
      }
    });

    this.loadInterfaceTypeList();
  }

  /**This method is called to load Data in Table */
  loadInterfaceTypeList() {
    this.configKeywordsService.getInterfaceTypeList(this.profileId).subscribe(data => {
      this.ipDetectionData = data["backendInterfaceDetail"];
    });
  }

  /**
   * The below function is called when user clicks on the hyperlink
   */
  onRowSelect() {
    if (this.isProfilePerm) {
      this.detailDialog = false;
    }
    else{
      this.detailDialog = true;
      this.integrationDetail = new InterfaceDetail();
      this.type = "";
      if(this.selectedIpDetectionData.lstInterfaceEndPoints[0].type == '-'){
        this.integrationDetail = cloneObject(this.selectedIpDetectionData);
      }
      else{
        this.createInterfaceTypeSelectItem();
      }
    }
  }

  /**To Fetch data to show the Backend Type in Dropdown Of Dialog box of ADD functionality */
  createInterfaceTypeSelectItem() {
    this.typeSelectItem = [];
    let arr = [];
    for (let i = 0; i < this.selectedIpDetectionData.lstInterfaceEndPoints.length; i++) {
      if (!arr.includes(this.selectedIpDetectionData.lstInterfaceEndPoints[i].type)) {
        arr.push(this.selectedIpDetectionData.lstInterfaceEndPoints[i].type);
      }
    }
    arr.sort();
    for (let i = 0; i < arr.length; i++) {
      this.typeSelectItem.push({ label: arr[i], value: arr[i] });
    }
  }

  createAccordian() {
    this.integrationDetail = cloneObject(this.selectedIpDetectionData);
    let arr = [];
    for (let i = 0; i < this.selectedIpDetectionData.lstInterfaceEndPoints.length; i++) {
      this.typeRepeatArr.push(this.selectedIpDetectionData.lstInterfaceEndPoints[i].type);
      if (this.type == this.selectedIpDetectionData.lstInterfaceEndPoints[i].type) {
        this.integrationDetail.detail = this.selectedIpDetectionData.detail;
        this.integrationDetail.enabled = this.selectedIpDetectionData.enabled;
        this.integrationDetail.id = this.selectedIpDetectionData.id;
        this.integrationDetail.type = this.selectedIpDetectionData.type;
        arr.push(this.selectedIpDetectionData.lstInterfaceEndPoints[i]);
      }
    }
  }


  /**This method is used to update Naming Rules & Exit Points data. */
  saveIntegrationDetail() {
    this.interfacePoint = new InterfacePoint();
    this.interfacePoint.backendTypeInterfaceId = this.integrationDetail.id;
    this.interfacePoint.lstInterfaceEndPoints = [];

    for (let i = 0; i < this.integrationDetail.lstInterfaceEndPoints.length; i++) {
      this.interfacePoint.lstInterfaceEndPoints[i] = { id: this.integrationDetail.lstInterfaceEndPoints[i].id, enabled: this.integrationDetail.lstInterfaceEndPoints[i].enabled };
    }

    this.detailDialog = false;
    this.configKeywordsService.updateProfileInterfaceAssoc(this.profileId, this.interfacePoint)
      .subscribe(data => {
        this.typeRepeatArr = [];
        this.type = "";
        //Getting index for set data in main array table data.
        let index = this.getTableIndex(data.backendTypeInterfaceId);
        this.setEndPointData(this.ipDetectionData[index].lstInterfaceEndPoints, data.lstInterfaceEndPoints);
        this.loadInterfaceTypeList();
        this.configUtilityService.successMessage(addMessage);
      }
      );
  }

  /**Used to set updated EndPoint Data in main table. */
  setEndPointData(mainTableEndPoints: InterfaceEndPoint[], updatedEndPoints: InterfaceEndPointInfo[]) {
    for (let i = 0; i < mainTableEndPoints.length; i++) {
      mainTableEndPoints[i].enabled = this.getEndPointValue(mainTableEndPoints[i].id, updatedEndPoints);
    }
  }

  
  /**
   *  This method return InterfaceEndPoint Value ie. enabled/disabled
   */
  getEndPointValue(id, updatedEndPoints: InterfaceEndPointInfo[]): boolean {
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

  /**
   * The below method is used to write the data on file 
   */
  saveIntegrationPointOnFile() {
    if(this.saveDisable == true)
    {
        return;
    }
    this.configKeywordsService.saveInterfacePointDataOnFile(this.profileId)
      .subscribe(data => {
       // this.configUtilityService.successMessage("Saved Successfully");
      let filePath = '';
      for (let key in this.interfacePoints) {
        if (key == 'NDInterfaceEntryPointsFile') {
          if (this.checkboxValue == true) {
            this.interfacePoints[key]["value"] = "true";
          }
          else {
            this.interfacePoints[key]["value"] = "false";
          }
        }
        this.configKeywordsService.keywordData[key] = this.interfacePoints[key];
        let config = {
          'configkeyword' : this.configKeywordsService.keywordData
        }
        sessionStorage.setItem('keywordValue', JSON.stringify(config));
      }
      
      this.configKeywordsService.getFilePath(this.profileId).subscribe(data => {
        if (this.checkboxValue == false) {
          filePath = "NA";
        }
        else {
          filePath = data["_body"];
          filePath = filePath + "/NDInterfaceBaseEntryPoint.txt";
        }
        this.interfacePoints['NDInterfaceEntryPointsFile'].path = filePath;
        this.keywordData.emit(this.interfacePoints);
      });

    })
  }


/**
 * Purpose : To invoke the service responsible to open Help Notification Dialog
 * related to the current component.
 */
  sendHelpNotification() {
    this.configKeywordsService.getHelpContent("Instrumentation", "Integartion Point Detection", "");
  }

}

