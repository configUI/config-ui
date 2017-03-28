import { Component, OnInit, Input } from '@angular/core';
import { ConfirmationService, SelectItem } from 'primeng/primeng'

import { MethodMonitorData } from '../../../../containers/instrumentation-data';
import { ConfigUtilityService } from '../../../../services/config-utility.service';
import { ConfigKeywordsService } from '../../../../services/config-keywords.service';

@Component({
  selector: 'app-instrument-monitors',
  templateUrl: './instrument-monitors.component.html',
  styleUrls: ['./instrument-monitors.component.css']
})
export class InstrumentMonitorsComponent implements OnInit {
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

  constructor(private configKeywordsService: ConfigKeywordsService, private confirmationService: ConfirmationService, private configUtilityService: ConfigUtilityService) { }

  ngOnInit() {
    this.loadMethodMonitorList();
  }
  /**This method is called to load data */

  loadMethodMonitorList() {
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
    console.log("hello------------", this.selectedMethodMonitorData)
    if (!this.selectedMethodMonitorData || this.selectedMethodMonitorData.length < 1) {
      this.configUtilityService.errorMessage("Please select for edit");
      return;
    }
    else if (this.selectedMethodMonitorData.length > 1) {
      this.configUtilityService.errorMessage("Please select only one for edit");
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
    this.configKeywordsService.editMethodMonitorData(this.methodMonitorDetail)
      .subscribe(data => {
        console.log("edit ", data);
        let index = this.getMethodMonitorIndex();
        this.selectedMethodMonitorData.length = 0;
        this.selectedMethodMonitorData.push(data);
        console.log("index", index);
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
      });
    this.addEditMethodMonitorDialog = false;
  }

  /**This method is used to delete Method Monitor */
  deleteMethodMonitor(): void {
    console.log("hello--------->")
    if (!this.selectedMethodMonitorData || this.selectedMethodMonitorData.length < 1) {
      this.configUtilityService.errorMessage("Please select for delete");
      return;
    }
    console.log("data for deletion is--------->", this.selectedMethodMonitorData);
    // this.confirmationService.confirm({
    //   message: 'Do you want to delete the selected record?',
    //   header: 'Delete Confirmation',
    //   icon: 'fa fa-trash',
    //   accept: () => {
    //     this.configKeywordsService.deleteMethodMonitorData(this.methodMonitorDetail)
    //       .subscribe(data => {
    //         console.log("deleteMethodMonitor", "data", data);
    //       })
    //     this.configUtilityService.infoMessage("Delete Successfully");
    //   },
    //   reject: () => {

    //   }
    // });
  }
}

