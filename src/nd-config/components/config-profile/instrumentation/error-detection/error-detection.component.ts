import { Component, OnInit, Input } from '@angular/core';
import { ErrorDetection } from '../../../../containers/instrumentation-data';
import { ConfigKeywordsService } from '../../../../services/config-keywords.service';
import { ConfirmationService, SelectItem } from 'primeng/primeng'
import { ConfigUtilityService } from '../../../../services/config-utility.service';
import { deleteMany } from '../../../../utils/config-utility';

import { Messages } from '../../../../constants/config-constant'

@Component({
  selector: 'app-error-detection',
  templateUrl: './error-detection.component.html',
  styleUrls: ['./error-detection.component.css']
})
export class ErrorDetectionComponent implements OnInit {
  @Input()
  profileId: number;
  @Input()
  saveDisable: boolean;
  /**It stores error detection data */
  errorDetectionData: ErrorDetection[];
  /**It stores selected error detection data */
  selectedErrorDetection: ErrorDetection[];
  /**It stores data for add/edit error detection */
  errorDetectionDetail: ErrorDetection;

  /**For add/edit error-detection flag */
  isNewErrorDetection: boolean;
  /**For open/close add/edit error detection detail */
  addEditErrorDetectionDialog: boolean = false;

  constructor(private configKeywordsService: ConfigKeywordsService, private confirmationService: ConfirmationService, private configUtilityService: ConfigUtilityService) { }

  ngOnInit() {
    this.loadErrorDetectionList();
    this.saveDisable=this.profileId==1 ? true:false;
  }

  /**This method is called to load data */
  loadErrorDetectionList() {

    this.configKeywordsService.getErrorDetectionList(this.profileId).subscribe(data => {
      this.errorDetectionData = data;
    });

  }

  /**For showing add Error Detection dialog */
  openAddErrorDetectionDialog(): void {
    this.errorDetectionDetail = new ErrorDetection();
    this.isNewErrorDetection = true;
    this.addEditErrorDetectionDialog = true;
  }

  /**For showing Error Detection dialog */
  openEditErrorDetectionDialog(): void {
    if (!this.selectedErrorDetection || this.selectedErrorDetection.length < 1) {
      this.configUtilityService.errorMessage("Select a row for edit");
      return;
    }
    else if (this.selectedErrorDetection.length > 1) {
      this.configUtilityService.errorMessage("Select only one row for edit");
      return;
    }
    this.errorDetectionDetail = new ErrorDetection();
    this.isNewErrorDetection = false;
    this.addEditErrorDetectionDialog = true;
    this.errorDetectionDetail = Object.assign({}, this.selectedErrorDetection[0]);
  }

  saveErrorDetection(): void {
    //When add new Error Detection
    if (this.isNewErrorDetection) {
      //Check for errorDetection name already exist or not
      if (!this.checkErrorDetectionNameAlreadyExist()) {
        this.saveErrDetection();
        return;
      }
    }
    //When add edit error Detection
    else {
      if (this.selectedErrorDetection[0].ruleName != this.errorDetectionDetail.ruleName) {
        if (this.checkErrorDetectionNameAlreadyExist())
          return;
      }
      this.editErrDetection();
    }
  }

  /**This method is used to validate the name of error Detection is already exists. */
  checkErrorDetectionNameAlreadyExist(): boolean {
    for (let i = 0; i < this.errorDetectionData.length; i++) {
      if (this.errorDetectionData[i].ruleName == this.errorDetectionDetail.ruleName) {
        this.configUtilityService.errorMessage("Error Detection Name already exist");
        return true;
      }
    }
  }
  editErrDetection(): void {
    this.configKeywordsService.editErrorDetection(this.errorDetectionDetail, this.profileId)
      .subscribe(data => {
        let index = this.getErrorDetectionIndex();
        this.selectedErrorDetection.length = 0;
        this.selectedErrorDetection.push(data);
        this.errorDetectionData[index] = data;
      });
    this.addEditErrorDetectionDialog = false;
  }

  getErrorDetectionIndex(): number {
    if (this.errorDetectionDetail) {
      let errDetectionId = this.errorDetectionDetail.errDetectionId;
      for (let i = 0; i < this.errorDetectionData.length; i++) {
        if (this.errorDetectionData[i].errDetectionId == errDetectionId) {
          return i;
        }
      }
    }
    return -1;
  }
  saveErrDetection(): void {
    this.configKeywordsService.addErrorDetection(this.errorDetectionDetail, this.profileId)
      .subscribe(data => {
        //Insert data in main table after inserting Error detection in DB
        this.errorDetectionData.push(data);
    this.configUtilityService.successMessage(Messages);
      });
    this.addEditErrorDetectionDialog = false;
  }

  /**This method is used to delete Error Detection */
  deleteErrorDetection(): void {
    if (!this.selectedErrorDetection || this.selectedErrorDetection.length < 1) {
      this.configUtilityService.errorMessage("Select row(s) for delete");
      return;
    }
    this.confirmationService.confirm({
      message: 'Do you want to delete the selected record?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        //Get Selected Applications's AppId
        let selectedApp = this.selectedErrorDetection;
        let arrAppIndex = [];
        for (let index in selectedApp) {
          arrAppIndex.push(selectedApp[index].errDetectionId);
        }
        this.configKeywordsService.deleteErrorDetection(arrAppIndex, this.profileId)
          .subscribe(data => {
            this.deleteErrorDetectionFromTable(arrAppIndex);
            this.selectedErrorDetection = [];
            this.configUtilityService.infoMessage("Deleted Successfully !!!");
          })
      },
      reject: () => {
      }
    });
  }
  /**This method is used to delete  from Data Table */
  deleteErrorDetectionFromTable(arrIndex) {
    let rowIndex: number[] = [];

    for (let index in arrIndex) {
      rowIndex.push(this.getMethodBusinessIndex(arrIndex[index]));
    }
    this.errorDetectionData = deleteMany(this.errorDetectionData, rowIndex);
  }
  /**This method returns selected application row on the basis of selected row */
  getMethodBusinessIndex(appId: any): number {
    for (let i = 0; i < this.errorDetectionData.length; i++) {
      if (this.errorDetectionData[i].errDetectionId == appId) {
        return i;
      }
    }
    return -1;
  }

   checkFrom(from , to){
     if(this.errorDetectionDetail.errorFrom >= this.errorDetectionDetail.errorTo)
     {
       from.setCustomValidity('From value should be less than To value.');
     }
     else{
      from.setCustomValidity('');
    }
    to.setCustomValidity('');

  }

  checkTo(from , to ){
     if(this.errorDetectionDetail.errorFrom >= this.errorDetectionDetail.errorTo){
      to.setCustomValidity('To value should be greater than from value.');
    }
    else{
      to.setCustomValidity('');
    }
    from.setCustomValidity('');
  }
}
