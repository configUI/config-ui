import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ConfirmationService, SelectItem } from 'primeng/primeng';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { KeywordData, KeywordList } from '../../../../containers/keyword-data';

import { ConfigKeywordsService } from '../../../../services/config-keywords.service';
import { ConfigUtilityService } from '../../../../services/config-utility.service';

import { ServiceEntryPoint } from '../../../../containers/instrumentation-data';
import { ServiceEntryType } from '../../../../interfaces/instrumentation-info';

import { ImmutableArray } from '../../../../utils/immutable-array';

import { Messages, descMsg } from '../../../../constants/config-constant';

import { deleteMany } from '../../../../utils/config-utility';

@Component({
  selector: 'app-service-entry-point',
  templateUrl: './service-entry-point.component.html',
  styleUrls: ['./service-entry-point.component.css']
})
export class ServiceEntryPointComponent implements OnInit {

  @Output()
  keywordData = new EventEmitter();

  @Input()
  profileId: number;
  /**It store service entry data */
  serviceEntryData: ServiceEntryPoint[];
  selectedServiceEntryData: ServiceEntryPoint[];

  entryPoints: Object;

  /**It stores table data for showing in GUI */
  serviceEntrypointTableData: ServiceEntryPoint[];

  /**It store service entry data for add*/
  serviceEntryPointDetail: ServiceEntryPoint;
  entryPointType: SelectItem[];
  @Input()
  saveDisable: boolean = false;

  /**These are those keyword which are used in current screen. */
  keywordList = ['NDEntryPointsFile'];

  /**It is used as flag to open or close dialog */
  displayNewService: boolean = false;

  addEditServiceEntryDialog: boolean = false;
  isNewServiceEntryPoint: boolean;

  subscription: Subscription;

  constructor(private configKeywordsService: ConfigKeywordsService, private configUtilityService: ConfigUtilityService, private confirmationService: ConfirmationService, private store: Store<KeywordList>) {

    this.subscription = this.store.select("keywordData").subscribe(data => {
      var keywordDataVal = {}
      this.keywordList.map(function (key) {
        keywordDataVal[key] = data[key];
      })
      this.entryPoints = keywordDataVal;
    });

  }

  ngOnInit() {
    this.loadServiceEntryPoint();
    this.loadEntryPointTypeList();
    this.saveDisable = this.profileId == 1 ? true : false;
  }
  /**It loads service entry data  */
  loadServiceEntryPoint() {
    this.configKeywordsService.getServiceEntryPointList(this.profileId)
      .subscribe(data => this.serviceEntryData = data);
  }

  /**This method is called when we click on Add button to open dialog  */
  openServiceEntryDialog() {
    this.serviceEntryPointDetail = new ServiceEntryPoint();
    this.isNewServiceEntryPoint = true;
    this.addEditServiceEntryDialog = true;
  }
  /**It adds data in dropdown of Entry type service */
  loadEntryPointTypeList() {
    //EntryPointType contains some values then return. no need to get data from server.
    if (this.entryPointType)
      return;
    this.entryPointType = [];
    let arr = [];
    this.configKeywordsService.getEntryPointTypeList()
      .subscribe(entryPointTypeList => {
        for (let i = 0; i < entryPointTypeList.length; i++) {
          arr.push(entryPointTypeList[i].entryTypeName);
        }
        arr.sort();
        for (let i = 0; i < arr.length; i++) {
          for (let j = 0; j < entryPointTypeList.length; j++) {
            if (arr[i] == entryPointTypeList[j].entryTypeName) {
              this.entryPointType.push({ label: arr[i], value: entryPointTypeList[j].entryTypeId });
            }
          }
        }
      });
  }


  /**It stores the dialog data back to the backend */
  saveServiceEntryPointService(): void {
    //When add new Service Entry Point
    if (this.isNewServiceEntryPoint) {
      //Check for service entry point name already exist or not
      if (!this.checkServiceEntryPointNameAlreadyExist()) {
        this.saveServiceEntry();
        this.loadEntryPointTypeList();
        return;
      }
    }
    //When add edit service entry point
    else {
      if (this.selectedServiceEntryData[0].name != this.serviceEntryPointDetail.name) {
        if (this.checkServiceEntryPointNameAlreadyExist())
          return;
      }
      this.editServiceEntry();
      this.loadEntryPointTypeList();
    }
  }

  saveServiceEntry(): void {
    if (this.serviceEntryPointDetail.desc != null) {
      if (this.serviceEntryPointDetail.desc.length > 500) {
        this.configUtilityService.errorMessage(descMsg);
        return;
      }
    }

    for (let i = 0; i < this.entryPointType.length; i++) {
      if (this.serviceEntryPointDetail.entryTypeId == this.entryPointType[i].value) {
        this.serviceEntryPointDetail.entryType = this.entryPointType[i].label;
      }
    }
    let that = this;
    let filePath;
    this.serviceEntryPointDetail.fqm = this.serviceEntryPointDetail.fqm.trim();
    this.configKeywordsService.addServiceEntryPointData(this.serviceEntryPointDetail, this.profileId)
      .subscribe(data => {
        //Insert data in main table after inserting service in DB
        // this.serviceEntryData.push(data);
        that.configKeywordsService.getFilePath(this.profileId).subscribe(data => {

          //For sending Runtime Changes
            filePath = data["_body"];
            filePath = filePath + "/NDEntryPointFile.txt";
          that.entryPoints['NDEntryPointsFile'].path = filePath;
          that.keywordData.emit(that.entryPoints);
        });
        this.serviceEntryData = ImmutableArray.push(this.serviceEntryData, data);
        this.configUtilityService.successMessage(Messages);
      });
    this.addEditServiceEntryDialog = false;
  }

  /**Used to enabled/Disabled Service Entry Points */
  enableToggle(rowData: ServiceEntryPoint) {
    let filePath;
    this.configKeywordsService.enableServiceEntryPointList(rowData.id, !rowData.enabled).subscribe(
      data => {
        if (rowData.enabled == true) {
          this.configUtilityService.infoMessage("Service entry point is enabled successfully.");
        }
        else {
          this.configUtilityService.infoMessage("Service entry point is disabled successfully.");
        }
      }
    );
    this.configKeywordsService.getFilePath(this.profileId).subscribe(data => {
      
      //For sending Runtime Changes

        filePath = data["_body"];
        filePath = filePath + "/NDEntryPointFile.txt";
      this.entryPoints['NDEntryPointsFile'].path = filePath;
      this.keywordData.emit(this.entryPoints);
    });

  }
  /**
   * Method to delete custom service entry points
   */
  deleteServiceEntryPoint(): void {
    if (!this.selectedServiceEntryData || this.selectedServiceEntryData.length < 1) {
      this.configUtilityService.errorMessage("Select row(s) to delete");
      return;
    }
    /**
     * Check if selected row(s) contain pre-defined Service Entry Point(s)
     */
    let selectedEntry = this.selectedServiceEntryData;
    let arrAppIndex = [];
    for (let index in selectedEntry) {
      arrAppIndex.push(selectedEntry[index].isCustomEntry);
    }
    let i: number;
    for (i = 0; i < 11; i++) {
      if (arrAppIndex[i] == false) {
        this.configUtilityService.errorMessage("Predefined Service Entry Point(s) can't be deleted");
        return;
      }
    }

    this.confirmationService.confirm({
      message: 'Do you want to delete the selected row?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        //Get Selected Applications's AppId
        let selectedApp = this.selectedServiceEntryData;
        let arrAppIndex = [];
        for (let index in selectedApp) {
          arrAppIndex.push(selectedApp[index].id);
        }

        this.configKeywordsService.deleteServiceEntryData(arrAppIndex, this.profileId)
          .subscribe(data => {
            this.deleteServiceEntryData(arrAppIndex);
            this.selectedServiceEntryData = [];
            this.configUtilityService.infoMessage("Deleted Successfully");
          })
          let filePath;
          this.configKeywordsService.getFilePath(this.profileId).subscribe(data => {
            
            //For sending Runtime Changes
      
              filePath = data["_body"];
              filePath = filePath + "/NDEntryPointFile.txt";
            this.entryPoints['NDEntryPointsFile'].path = filePath;
            this.keywordData.emit(this.entryPoints);
          });
      },
      reject: () => {
      }
    });
  }
  /**This method is used to delete  from Data Table */
  deleteServiceEntryData(arrAppIndex) {
    let rowIndex: number[] = [];

    for (let index in arrAppIndex) {
      rowIndex.push(this.getServiceEntry(arrAppIndex[index]));
    }
    this.serviceEntryData = deleteMany(this.serviceEntryData, rowIndex);
  }

  /**This method returns selected application row on the basis of selected row */
  getServiceEntry(appId: any): number {
    for (let i = 0; i < this.serviceEntryData.length; i++) {
      if (this.serviceEntryData[i].id == appId) {
        return i;
      }
    }
    return -1;
  }

  /**For showing Edit Service Entry Point dialog */
  openEditServiceEntryDialog(): void {

    if (!this.selectedServiceEntryData || this.selectedServiceEntryData.length < 1) {
      this.configUtilityService.errorMessage("Select a row to edit");
      return;
    }
    else if (this.selectedServiceEntryData.length > 1) {
      this.configUtilityService.errorMessage("Select only one row to edit");
      return;
    }

    /**
      * Check if selected row(s) contain pre-defined Service Entry Point(s)
      */
    let selectedEntry = this.selectedServiceEntryData;
    let arrAppIndex = [];
    for (let index in selectedEntry) {
      arrAppIndex.push(selectedEntry[index].isCustomEntry);
    }
    let i: number;
    for (i = 0; i < 11; i++) {
      if (arrAppIndex[i] == false) {
        this.configUtilityService.errorMessage("Predefined Service Entry Point can't be edited");
        return;
      }
    }

    this.serviceEntryPointDetail = new ServiceEntryPoint();
    this.isNewServiceEntryPoint = false;
    this.addEditServiceEntryDialog = true;
    this.serviceEntryPointDetail = Object.assign({}, this.selectedServiceEntryData[0]);
  }

  /**This method is used to validate the name of Service entry point is already exists. */
  checkServiceEntryPointNameAlreadyExist(): boolean {
    for (let i = 0; i < this.serviceEntryData.length; i++) {
      if (this.serviceEntryData[i].name == this.serviceEntryPointDetail.name) {
        this.configUtilityService.errorMessage("Service entry point name already exist");
        return true;
      }
    }
  }

  editServiceEntry(): void {

    if (this.serviceEntryPointDetail.desc != null) {
      if (this.serviceEntryPointDetail.desc.length > 500) {
        this.configUtilityService.errorMessage(descMsg);
        return;
      }
    }

    for (let i = 0; i < this.entryPointType.length; i++) {
      if (this.serviceEntryPointDetail.entryTypeId == this.entryPointType[i].value) {
        this.serviceEntryPointDetail.entryType = this.entryPointType[i].label;
      }
    }

    this.serviceEntryPointDetail.fqm = this.serviceEntryPointDetail.fqm.trim();
    this.configKeywordsService.editServiceEntryPointData(this.serviceEntryPointDetail, this.profileId)
      .subscribe(data => {
        let index = this.getServiceEntryPoint();
        this.serviceEntryData = ImmutableArray.replace(this.serviceEntryData, data, index);
        this.serviceEntryPointDetail.entryType = data.entryType
        this.configUtilityService.successMessage(Messages);
      });
      let filePath;
      this.configKeywordsService.getFilePath(this.profileId).subscribe(data => {
        
        //For sending Runtime Changes
  
          filePath = data["_body"];
          filePath = filePath + "/NDEntryPointFile.txt";
        this.entryPoints['NDEntryPointsFile'].path = filePath;
        this.keywordData.emit(this.entryPoints);
      });
    this.addEditServiceEntryDialog = false;
    this.selectedServiceEntryData = [];
  }

  getServiceEntryPoint(): number {
    if (this.serviceEntryPointDetail) {
      let ID = this.serviceEntryPointDetail.id;
      for (let i = 0; i < this.serviceEntryData.length; i++) {
        if (this.serviceEntryData[i].id == ID) {
          return i;
        }
      }
    }
    return -1;
  }


}
