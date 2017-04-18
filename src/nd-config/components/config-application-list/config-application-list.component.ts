import { Component, OnInit } from '@angular/core';

import { ConfirmationService, SelectItem } from 'primeng/primeng';

import { ConfigApplicationService } from '../../services/config-application.service'
import { ConfigHomeService } from '../../services/config-home.service'
import { ConfigUtilityService } from '../../services/config-utility.service';

import { ApplicationData } from '../../containers/application-data';
import { ApplicationInfo } from '../../interfaces/application-info';

import { MainInfo } from '../../interfaces/main-info';
import { EntityInfo } from '../../interfaces/entity-info';
import { deleteMany } from '../../utils/config-utility';

import { ROUTING_PATH } from '../../constants/config-url-constant';

@Component({
  selector: 'app-config-application-list',
  templateUrl: './config-application-list.component.html',
  styleUrls: ['./config-application-list.component.css']
})
export class ConfigApplicationListComponent implements OnInit {

  constructor(private configApplicationService: ConfigApplicationService, private configHomeService: ConfigHomeService, private configUtilityService: ConfigUtilityService, private confirmationService: ConfirmationService) { }

  /**It stores application-list data */
  applicationData: ApplicationData[];
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

  ROUTING_PATH = ROUTING_PATH;

  ngOnInit() {
    this.loadApplicationData();
    this.loadTopologyData();
  }


  /**Getting application list data */
  loadApplicationData(): void {
    this.configApplicationService.getApplicationList().subscribe(data => this.applicationData = data);
  }

  /**Getting topology list. further we will optimize. */
  loadTopologyData(): void {
    let data: MainInfo;
    this.configHomeService.getMainData()
      .subscribe(data => {
        data = data;
        this.topologyInfo = data.homeData[2].value;
        this.createTopologySelectItem();
      })
  }

  /**For showing add application dialog */
  openAppDialog(): void {
    this.applicationDetail = new ApplicationData();
    this.isNewApp = true;
    this.addEditAppDialog = true;
  }

  /**For showing edit application dialog */
  editAppDialog(): void {
    if (!this.selectedApplicationData || this.selectedApplicationData.length < 1) {
      this.configUtilityService.errorMessage("Select row for edit");
      return;
    }
    else if (this.selectedApplicationData.length > 1) {
      this.configUtilityService.errorMessage("Select only one row for edit");
      return;
    }

    this.isNewApp = false;
    this.addEditAppDialog = true;
    this.applicationDetail = Object.assign({}, this.selectedApplicationData[0]);
  }

  /**This method is used to delete application */
  deleteApp(): void {
    if (!this.selectedApplicationData || this.selectedApplicationData.length < 1) {
      this.configUtilityService.errorMessage("Select fields to delete");
      return;
    }
    this.confirmationService.confirm({
      message: 'Do you want to delete the selected record?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        //Get Selected Applications's AppId
        let selectedApp = this.selectedApplicationData;
        let arrAppIndex = [];
        for (let index in selectedApp) {
          arrAppIndex.push(selectedApp[index].appId);
        }
        this.configApplicationService.deleteApplicationData(arrAppIndex)
          .subscribe(data => {
            this.deleteApplications(arrAppIndex);
          })
        this.configUtilityService.infoMessage("Deleted Successfully");
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
    this.configApplicationService.addApplicationData(this.applicationDetail)
      .subscribe(data => {
        //Insert data in main table after inserting application in DB
        this.applicationData.push(data);
      });
    this.closeDialog();
    this.configUtilityService.successMessage("Saved Successfully !!!");
  }

  /**This method is used to edit application detail */
  editApp(): void {
    this.configApplicationService.editApplicationData(this.applicationDetail)
      .subscribe(data => {
        let index = this.getAppIndex(this.applicationDetail.appId);
        this.selectedApplicationData.length = 0;
        this.selectedApplicationData.push(data);
        this.applicationData[index] = data;
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

  /**This method is used to creating topology select item object */
  createTopologySelectItem() {
    this.topologySelectItem = [];
    this.topologySelectItem.push({ value: -1, label: '--Select Topology--' });
    for (let i = 0; i < this.topologyInfo.length; i++) {
      this.topologySelectItem.push({ value: this.topologyInfo[i].id, label: this.topologyInfo[i].name });
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
  }
}
