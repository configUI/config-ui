import { Component, OnInit, Input } from '@angular/core';
import { ConfirmationService, SelectItem } from 'primeng/primeng'
import { ActivatedRoute, Params } from '@angular/router';
import { MethodMonitorData } from '../../../../../containers/instrumentation-data';
import { ConfigUtilityService } from '../../../../../services/config-utility.service';
import { ConfigKeywordsService } from '../../../../../services/config-keywords.service';
import { deleteMany } from '../../../../../utils/config-utility';

import { Messages } from '../../../../../constants/config-constant'

@Component({
  selector: 'app-method-monitors',
  templateUrl: './method-monitors.component.html',
  styleUrls: ['./method-monitors.component.css']
})
export class MethodMonitorsComponent implements OnInit {

  @Input()
  profileId: number;
  /**It stores method monitor-list data */
  methodMonitorData: MethodMonitorData[];
  /**It stores selected method monitor data for edit or add method-monitor */
  methodMonitorDetail: MethodMonitorData;
  /**It stores selected method monitor data */
  selectedMethodMonitorData: MethodMonitorData[];

  /**For add/edit method-monitor flag */
  isNewMethodMonitor: boolean = false;
  /**For open/close add/edit method-monitor detail */
  addEditMethodMonitorDialog: boolean = false;

  constructor(private configKeywordsService: ConfigKeywordsService, private confirmationService: ConfirmationService, private route: ActivatedRoute, private configUtilityService: ConfigUtilityService) { }

  ngOnInit() {
    this.loadMethodMonitorList();
  }
  /**This method is called to load data */

  loadMethodMonitorList() {
    this.route.params.subscribe((params: Params) => {
      this.profileId = params['profileId'];
    });
    this.configKeywordsService.getMethodMonitorList(this.profileId).subscribe(data => {
      this.methodMonitorData = data;
    });
  }
  /**For showing add Method Monitor dialog */
  openAddMethodMonitorDialog(): void {
    this.methodMonitorDetail = new MethodMonitorData();
    this.isNewMethodMonitor = true;
    this.addEditMethodMonitorDialog = true;
  }

  /**For showing Method Monitor dialog */
  openEditMethodMonitorDialog(): void {
    if (!this.selectedMethodMonitorData || this.selectedMethodMonitorData.length < 1) {
      this.configUtilityService.errorMessage("Select a field to edit");
      return;
    }
    else if (this.selectedMethodMonitorData.length > 1) {
      this.configUtilityService.errorMessage("Select only one field to edit");
      return;
    }
    this.methodMonitorDetail = new MethodMonitorData();
    this.isNewMethodMonitor = false;
    this.methodMonitorDetail = new MethodMonitorData();
    this.addEditMethodMonitorDialog = true;
    this.methodMonitorDetail = Object.assign({}, this.selectedMethodMonitorData[0]);
  }

  saveMethodMonitor(): void {
    //When add new Method Monitor 
    if (this.isNewMethodMonitor) {
      //Check for MethodMonitor name already exist or not
      if (!this.checkMethodMonitorNameAlreadyExist()) {
        this.saveMethodMonitorData();
        return;
      }
    }
    /**When add edit Method Monitor */
    else {
      if (this.selectedMethodMonitorData[0].methodName != this.methodMonitorDetail.methodName) {
        if (this.checkMethodMonitorNameAlreadyExist())
          return;
      }
      this.editMethodMonitor();
    }
  }

  /**This method is used to validate the name of method monitor  already exists. */
  checkMethodMonitorNameAlreadyExist(): boolean {
    for (let i = 0; i < this.methodMonitorData.length; i++) {
      if (this.methodMonitorData[i].methodDisplayName == this.methodMonitorDetail.methodDisplayName) {
        this.configUtilityService.errorMessage("Method Monitor Name already exist");
        return true;
      }
    }
  }
  editMethodMonitor(): void {
    this.configKeywordsService.editMethodMonitorData(this.methodMonitorDetail, this.profileId)
      .subscribe(data => {
        let index = this.getMethodMonitorIndex();
        this.selectedMethodMonitorData.length = 0;
        this.selectedMethodMonitorData.push(data);
        this.methodMonitorData[index] = data;
      });
    this.addEditMethodMonitorDialog = false;
  }

  getMethodMonitorIndex(): number {
    if (this.methodMonitorDetail) {
      let methodId = this.methodMonitorDetail.methodId;
      for (let i = 0; i < this.methodMonitorData.length; i++) {
        if (this.methodMonitorData[i].methodId == methodId) {
          return i;
        }
      }
    }
    return -1;
  }
  /**This method save Method Monitor data at backend */
  saveMethodMonitorData(): void {
    this.configKeywordsService.addMethodMonitorData(this.methodMonitorDetail, this.profileId)
      .subscribe(data => {
        //Insert data in main table after inserting Method Monitor in DB
        this.methodMonitorData.push(data);
    this.configUtilityService.successMessage(Messages);
      });
    this.addEditMethodMonitorDialog = false;
  }

  /**This method is used to delete Method Monitor */
  deleteMethodMonitor(): void {
    if (!this.selectedMethodMonitorData || this.selectedMethodMonitorData.length < 1) {
      this.configUtilityService.errorMessage("Select fields to delete");
      return;
    }
    this.confirmationService.confirm({
      message: 'Do you want to delete the selected record?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        //Get Selected Applications's AppId
        let selectedApp = this.selectedMethodMonitorData;
        let arrAppIndex = [];
        for (let index in selectedApp) {
          arrAppIndex.push(selectedApp[index].methodId);
        }
        this.configKeywordsService.deleteMethodMonitorData(arrAppIndex, this.profileId)
          .subscribe(data => {
            this.deleteMethodMonitorFromTable(arrAppIndex);
            this.selectedMethodMonitorData = [];
            this.configUtilityService.infoMessage("Delete Successfully");
          })
      },
      reject: () => {
      }
    });
  }
  /**This method is used to delete  from Data Table */
  deleteMethodMonitorFromTable(arrIndex) {
    let rowIndex: number[] = [];

    for (let index in arrIndex) {
      rowIndex.push(this.getMethodMonitor(arrIndex[index]));
    }
    this.methodMonitorData = deleteMany(this.methodMonitorData, rowIndex);
  }
  /**This method returns selected application row on the basis of selected row */
  getMethodMonitor(appId: any): number {
    for (let i = 0; i < this.methodMonitorData.length; i++) {
      if (this.methodMonitorData[i].methodId == appId) {
        return i;
      }
    }
    return -1;
  }
}