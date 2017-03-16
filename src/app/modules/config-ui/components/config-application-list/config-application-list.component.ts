import { Component, OnInit } from '@angular/core';

import { ConfirmationService, SelectItem } from 'primeng/primeng';

import { ConfigApplicationService } from '../../services/config-application.service'
import { ConfigHomeService } from '../../services/config-home.service'
import { ConfigUtilityService } from '../../services/config-utility.service';

import { ApplicationData } from '../../containers/application-data';
import { ApplicationInfo } from '../../interfaces/application-info';

import { MainInfo } from '../../interfaces/main-info';
import { EntityInfo } from '../../interfaces/entity-info';

@Component({
  selector: 'app-config-application-list',
  templateUrl: './config-application-list.component.html',
  styleUrls: ['./config-application-list.component.css']
})
export class ConfigApplicationListComponent implements OnInit {

  constructor(private configApplicationService: ConfigApplicationService, private configHomeService: ConfigHomeService, private configUtilityService: ConfigUtilityService, private confirmationService: ConfirmationService) { }

  /**It stores application-list data */
  applicationData: ApplicationInfo[];
  /**It stores selected application data */
  selectedApplicationData: ApplicationInfo[];
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
      this.configUtilityService.errorMessage("Please select for edit");
      return;
    }
    else if (this.selectedApplicationData.length > 1) {
      this.configUtilityService.errorMessage("Please select only one for edit");
      return;
    }

    this.isNewApp = false;
    this.addEditAppDialog = true;
    this.applicationDetail = new ApplicationData();
    this.applicationDetail.$appDesc = this.selectedApplicationData[0].appDesc;
    this.applicationDetail.$appId = this.selectedApplicationData[0].appId;
    this.applicationDetail.$appName = this.selectedApplicationData[0].appName;
    this.applicationDetail.$dcId = this.selectedApplicationData[0].dcId;
    this.applicationDetail.$dcTopoAssocId = this.selectedApplicationData[0].dcTopoAssocId;
    this.applicationDetail.$topoId = this.selectedApplicationData[0].topoId;
    this.applicationDetail.$topoName = this.selectedApplicationData[0].topoName;
    this.applicationDetail.$userName = this.selectedApplicationData[0].userName;
  }

  /**This method is used to delete application */
  deleteApp(): void {
    if (!this.selectedApplicationData || this.selectedApplicationData.length < 1) {
      this.configUtilityService.errorMessage("Please select for delete");
      return;
    }
    this.confirmationService.confirm({
      message: 'Do you want to delete the selected record?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        this.configApplicationService.deleteApplicationData(this.applicationDetail)
          .subscribe(data => {
            console.log("deleteApp", "data", data);
          })
        this.configUtilityService.infoMessage("Delete Successfully");
      },
      reject: () => {

      }
    });
  }

  /**This method is common method for save or edit application detail*/
  saveEditApp(): void {
    if (this.isNewApp)
      this.saveApp();
    else
      this.editApp();
  }

  /**This method is used to add application detail */
  saveApp(): void {
    this.configApplicationService.addApplicationData(this.applicationDetail)
      .subscribe(data => {
        //Insert data in main table after inserting application in DB
        this.applicationData.push(data);
      });
    this.closeDialog();
  }

  /**This method is used to edit application detail */
  editApp(): void {
    this.configApplicationService.editApplicationData(this.applicationDetail)
      .subscribe(data => {
        console.log("edit ", data);
        let index = this.getAppIndex();
        this.selectedApplicationData.length = 0;
        this.selectedApplicationData.push(data);
        console.log("index", index);
        this.applicationData[index] = data;
      });
    this.closeDialog();
  }

  /**For close add/edit application dialog box */
  closeDialog(): void {
    this.addEditAppDialog = false;
  }

  /**This method returns selected application row */
  getAppIndex(): number {
    if (this.applicationDetail) {
      let appId = this.applicationDetail.$appId;
      for (let i = 0; i < this.applicationData.length; i++) {
        if (this.applicationData[i].appId == appId) {
          return i;
        }
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
}
