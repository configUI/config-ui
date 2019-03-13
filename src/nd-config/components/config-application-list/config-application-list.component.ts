import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ConfirmationService, SelectItem } from 'primeng/primeng';

import { ConfigApplicationService } from '../../services/config-application.service'
import { ConfigHomeService } from '../../services/config-home.service'
import { ConfigUtilityService } from '../../services/config-utility.service';

import { ApplicationData } from '../../containers/application-data';
import { EntityInfo } from '../../interfaces/entity-info';
import { deleteMany } from '../../utils/config-utility';

import { ROUTING_PATH } from '../../constants/config-url-constant';

import { ImmutableArray } from '../../utils/immutable-array';

import { descMsg, addMessage, editMessage } from '../../constants/config-constant';
import { ConfigTopologyService } from '../../services/config-topology.service';

@Component({
  selector: 'app-config-application-list',
  templateUrl: './config-application-list.component.html',
  styleUrls: ['./config-application-list.component.css']
})
export class ConfigApplicationListComponent implements OnInit {

  constructor(private configApplicationService: ConfigApplicationService, private configHomeService: ConfigHomeService, private configUtilityService: ConfigUtilityService, private confirmationService: ConfirmationService, private router: Router, private configTopologyService: ConfigTopologyService) { }

  /**It stores application-list data */
  applicationData: ApplicationData[] = [];
  /**It stores selected application data */
  selectedApplicationData: ApplicationData[];
  /**It stores selected application data for edit or add application */
  applicationDetail: ApplicationData;
  /**It stores topology info */
  topologyInfo: EntityInfo[];

  /**For add/edit application flag */
  isNewApp: boolean = false;
  /**For open/close add/edit application detail */
  addEditAppDialog: boolean = false;
  /**SelectItem for topology */
  topologySelectItem: SelectItem[];

  /**To store all topology name  */
  topoNameList = []

  isAppPerm: boolean;

  userName = sessionStorage.getItem("sesLoginName") == null ? "netstorm" : sessionStorage.getItem("sesLoginName");

  ROUTING_PATH = ROUTING_PATH;
  
  runningApp: any;

  ngOnInit() {
    this.isAppPerm = +sessionStorage.getItem("ApplicationAccess") == 4 ? true : false;
    sessionStorage.setItem("agentType", "");
    //If test is running then get the running application name
    let trNo = sessionStorage.getItem("isTrNumber");
    if (trNo != "null")
      this.loadRunningApp(trNo);
    this.loadApplicationData();
  }

  //To get the running application name when test is running
  loadRunningApp(trNo): any {
    this.configHomeService.getRunningApp(trNo).subscribe(data => {
      this.runningApp = data["_body"];
    })
  }

  /**Getting application list data */
  loadApplicationData(): void {
    this.configApplicationService.getApplicationList().subscribe(data => {
      this.applicationData = data.reverse();
      this.loadTopologyData();
    });
  }


  /**Getting topology list. further we will optimize. */
  loadTopologyData(): void {
    this.topologySelectItem = []
    this.configHomeService.getTopologyList().subscribe(data => {
      data = data.sort();
      this.topoNameList = data
      this.createTopologySelectItem(this.topoNameList)
    })
  }


  /**For showing add application dialog */
  openAppDialog(): void {
    this.applicationDetail = new ApplicationData();
    this.isNewApp = true;
    this.addEditAppDialog = true;
    this.createTopologySelectItem(this.topoNameList);
  }


  /**For showing edit application dialog */
  editAppDialog(): void {
    this.createTopologySelectItem(this.topoNameList);
    if (!this.selectedApplicationData || this.selectedApplicationData.length < 1) {
      this.configUtilityService.errorMessage("Select an application to edit");
      return;
    }
    else if (this.selectedApplicationData.length > 1) {
      this.configUtilityService.errorMessage("Select only one application to edit");
      return;
    }
    this.isNewApp = false;
    this.addEditAppDialog = true;
    this.applicationDetail = Object.assign({}, this.selectedApplicationData[0]);
    this.topologySelectItem.push({ label: this.selectedApplicationData[0].topoName, value: this.selectedApplicationData[0].topoName })
  }


  /**This method is used to delete application */
  deleteApp(): void {
    if (!this.selectedApplicationData || this.selectedApplicationData.length < 1) {
      this.configUtilityService.errorMessage("Select application(s) to delete");
      return;
    }
    if(this.runningApp != ""){

      //If application is running, do not allow to delete
      for(let i in this.selectedApplicationData){
        if(this.selectedApplicationData[i].appName == this.runningApp){
          this.configUtilityService.errorMessage("Could Not Delete Running Application '" + this.runningApp + "'")
          return;
        }
      }
    }  
    this.confirmationService.confirm({
      message: 'Do you want to delete selected Application?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        //Get Selected Applications's AppId
        let selectedApp = this.selectedApplicationData;
        let arrAppIndex = [];
        // let arrId = [];
        for (let index in selectedApp) {
          arrAppIndex.push(selectedApp[index].appId);
          // arrId.push(selectedApp[index].topoId)
        }

        let that = this;
        //delete appication
        this.configApplicationService.deleteApplicationData(arrAppIndex)
          .subscribe(data => {
            this.deleteApplications(arrAppIndex);
            this.configUtilityService.infoMessage("Deleted Successfully");
          })
      },
      reject: () => {
      }
    });
  }


  /**This method is common method for save or edit application detail*/
  saveEditApp(): void {
    //When add new application
    if (this.isNewApp) {
      //Check for app name already exist or not
      if (!this.checkAppNameAlreadyExist()) {
        this.addEditAppDialog = false;
        this.saveApp();
        return;
      }
    }
    //When add edit application
    else {
      if (this.selectedApplicationData[0].appName != this.applicationDetail.appName) {
        if (this.checkAppNameAlreadyExist())
          return;
      }
      this.addEditAppDialog = false;
      this.editApp();
    }
  }


  /**This method is used to validate the name of application is already exists. */
  checkAppNameAlreadyExist(): boolean {
    for (let i = 0; i < this.applicationData.length; i++) {
      if (this.applicationData[i].appName == this.applicationDetail.appName) {
        this.configUtilityService.errorMessage("Application Name already exist");
        return true;
      }
    }
  }


  /**This method is used to add application detail */
  saveApp(): void {
    this.applicationDetail.userName = this.userName;
    if (this.applicationDetail.appDesc != null) {
      if (this.applicationDetail.appDesc.length > 500) {
        this.configUtilityService.errorMessage(descMsg);
        return;
      }
    }
    let arr = []
    arr.push(this.applicationDetail.topoName)
    this.configApplicationService.addApplicationData(this.applicationDetail)
      .subscribe(data => {
        if (data[Object.keys(data)[0]] == "Provided Application Name already exists!!!") {
          this.configUtilityService.errorMessage("Application Name already exists.");
          return;
        }
        //to insert new row in table ImmutableArray.push() is created as primeng 4.0.0 does not support above line 
        this.applicationData = ImmutableArray.push(this.applicationData, data);
        this.configUtilityService.successMessage(addMessage);
        this.loadApplicationData();
        this.closeDialog();
      });
  }


  /**This method is used to edit application detail */
  editApp(): void {
    if (this.applicationDetail.appDesc != null) {
      if (this.applicationDetail.appDesc.length > 500) {
        this.configUtilityService.errorMessage(descMsg);
        return;
      }
    }
    let arr = []
    arr.push(this.applicationDetail.topoName)
    this.configApplicationService.editApplicationData(this.applicationDetail)
      .subscribe(data => {
        let index = this.getAppIndex(this.applicationDetail.appId);
        this.selectedApplicationData.length = 0;
        this.selectedApplicationData.push(data);
        //to edit a row in table ImmutableArray.replace() is created as primeng 4.0.0 does not support above line 
        this.applicationData = ImmutableArray.replace(this.applicationData, data, index);
        this.configUtilityService.successMessage(editMessage);
        this.loadApplicationData();
        this.selectedApplicationData.length = 0;
      });
    this.closeDialog();
  }


  /**For close add/edit application dialog box */
  closeDialog(): void {
    this.addEditAppDialog = false;
  }


  /**This method returns selected application row on the basis of AppId */
  getAppIndex(appId: number): number {
    for (let i = 0; i < this.applicationData.length; i++) {
      if (this.applicationData[i].appId == appId) {
        return i;
      }
    }
    return -1;
  }


  /***** This method is used to creating topology select item object *****/
  createTopologySelectItem(data) {
    let appTopoArr = [];
    this.applicationData.map(function (val) {
      appTopoArr.push(val.topoName)
    })
    this.topologySelectItem = [];
    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        if (!(appTopoArr.indexOf(data[i]) > -1)) {
          this.topologySelectItem.push({ value: data[i], label: data[i] });
        }
      }
    }
  }


  /**This method is used to delete application */
  deleteApplications(arrAppId: number[]): void {
    //For stores table row index
    let rowIndex: number[] = [];

    for (let index in arrAppId) {
      rowIndex.push(this.getAppIndex(arrAppId[index]));
    }

    this.applicationData = deleteMany(this.applicationData, rowIndex);
    //clearing the array used for storing selected row
    this.selectedApplicationData = [];
  }


  routeToTree(selectedAppId, selectedAppName) {
    //Observable app name
    this.configApplicationService.applicationNameObserver(selectedAppName);
    sessionStorage.setItem("showserverinstance", "false");
    sessionStorage.setItem("isAppliedProfile", "false");
    this.router.navigate([ROUTING_PATH + '/tree-main', selectedAppId]);

  }


  //Route to NDC Keyword 
  routeToNDCKeywords(selectedAppId) {
    sessionStorage.setItem("agentType", "");
    this.router.navigate([ROUTING_PATH + '/application-list/ndc-keywords-setting', selectedAppId])
  }


  generateNDConfFile() {
    if (!this.selectedApplicationData || this.selectedApplicationData.length < 1) {
      this.configUtilityService.errorMessage("Select an application to generate agent configuration settings");
      return;
    }
    else if (this.selectedApplicationData.length > 1) {
      this.configUtilityService.errorMessage("Select only one application to generate agent configuration settings");
      return;
    }
    let selectedApp = this.selectedApplicationData;
    let arrAppIndex = [];
    for (let index in selectedApp) {
      arrAppIndex.push(selectedApp[index].appId);
    }
    this.configApplicationService.generateNDConf(arrAppIndex).subscribe(data =>
      this.configUtilityService.infoMessage("Agent configuration settings generated successfully at path : " + data));
  }

}
