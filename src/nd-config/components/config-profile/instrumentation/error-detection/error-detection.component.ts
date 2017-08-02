import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { ErrorDetection } from '../../../../containers/instrumentation-data';
import { ConfigKeywordsService } from '../../../../services/config-keywords.service';
import { ConfirmationService, SelectItem } from 'primeng/primeng'
import { ConfigUtilityService } from '../../../../services/config-utility.service';

import { ImmutableArray } from '../../../../utils/immutable-array';
import { deleteMany } from '../../../../utils/config-utility';

import { KeywordData, KeywordList } from '../../../../containers/keyword-data';
import { Keywords } from '../../../../interfaces/keywords';
import { Messages, descMsg } from '../../../../constants/config-constant'

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
  @Output()
  keywordData = new EventEmitter();
  /**It stores error detection data */
  errorDetectionData: ErrorDetection[];
  /**It stores selected error detection data */
  selectedErrorDetection: ErrorDetection[];
  /**It stores data for add/edit error detection */
  errorDetectionDetail: ErrorDetection;

  subscription: Subscription;
  /**For add/edit error-detection flag */
  isNewErrorDetection: boolean;
  /**For open/close add/edit error detection detail */
  addEditErrorDetectionDialog: boolean = false;

  keywordList: string[] = ['BTErrorRules'];
  errorDetection: Object;
  selectedValues: boolean;
  keywordValue: Object;
  subscriptionEG: Subscription;
  enableGroupKeyword: boolean = false;

  constructor(private configKeywordsService: ConfigKeywordsService, private confirmationService: ConfirmationService, private configUtilityService: ConfigUtilityService, private store: Store<KeywordList>) {
    this.configKeywordsService.toggleKeywordData();
  }

  ngOnInit() {
    this.loadErrorDetectionList();
    this.saveDisable = this.profileId == 1 ? true : false;
    if (this.configKeywordsService.keywordData != undefined) {
      this.keywordValue = this.configKeywordsService.keywordData;
    }
    else {
      this.subscription = this.store.select("keywordData").subscribe(data => {
        var keywordDataVal = {}
        this.keywordList.map(function (key) {
          keywordDataVal[key] = data[key];
        })
        this.keywordValue = keywordDataVal;
      });
    }
    this.errorDetection = {};
    this.keywordList.forEach((key) => {
      if (this.keywordValue.hasOwnProperty(key)) {
        this.errorDetection[key] = this.keywordValue[key];
        if (this.errorDetection[key].value == "true")
          this.selectedValues = true;
        else
          this.selectedValues = false;
      }
    });
  }

  saveKeywordData() {
    let filePath = '';
    for (let key in this.errorDetection) {
      if (key == 'BTErrorRules') {
        if (this.selectedValues == true) {
          this.errorDetection[key]["value"] = "true";
          this.configUtilityService.successMessage("Error Detection settings are enabled");
        }
        else {
          this.errorDetection[key]["value"] = "false";
          this.configUtilityService.successMessage("Error detection settings disabled");
        }
      }
      this.configKeywordsService.keywordData[key] = this.errorDetection[key];
    }
    // this.configKeywordsService.saveProfileKeywords(this.profileId);
    this.configKeywordsService.getFilePath(this.profileId).subscribe(data => {
      if (this.selectedValues == false) {
        filePath = "NA";
      }
      else {
        filePath = data["_body"];
        filePath = filePath + "/btErrorRule.err";
      }
      this.errorDetection['BTErrorRules'].path = filePath;
      this.keywordData.emit(this.errorDetection);
    });
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
      this.configUtilityService.errorMessage("Select a row to edit");
      return;
    }
    else if (this.selectedErrorDetection.length > 1) {
      this.configUtilityService.errorMessage("Select only one row to edit");
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
    if (this.errorDetectionDetail.ruleDesc != null) {
      if (this.errorDetectionDetail.ruleDesc.length > 500) {
        this.configUtilityService.errorMessage(descMsg);
        return;
      }
    }
    this.configKeywordsService.editErrorDetection(this.errorDetectionDetail, this.profileId)
      .subscribe(data => {
        let index = this.getErrorDetectionIndex();
        this.selectedErrorDetection.length = 0;
        // this.selectedErrorDetection.push(data);

        //to insert new row in table ImmutableArray.replace() is created as primeng 4.0.0 does not support above line 
        this.errorDetectionData = ImmutableArray.replace(this.errorDetectionData, data, index);
        this.configUtilityService.successMessage(Messages);
        // this.errorDetectionData[index] = data;
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
    if (this.errorDetectionDetail.ruleDesc != null) {
      if (this.errorDetectionDetail.ruleDesc.length > 500) {
        this.configUtilityService.errorMessage(descMsg);
        return;
      }
    }
    this.configKeywordsService.addErrorDetection(this.errorDetectionDetail, this.profileId)
      .subscribe(data => {
        //Insert data in main table after inserting Error detection in DB
        // this.errorDetectionData.push(data);

        //to insert new row in table ImmutableArray.push() is created as primeng 4.0.0 does not support above line 
        this.errorDetectionData = ImmutableArray.push(this.errorDetectionData, data);
        this.configUtilityService.successMessage(Messages);
      });
    this.addEditErrorDetectionDialog = false;
  }

  /**This method is used to delete Error Detection */
  deleteErrorDetection(): void {
    if (!this.selectedErrorDetection || this.selectedErrorDetection.length < 1) {
      this.configUtilityService.errorMessage("Select row(s) to delete");
      return;
    }
    this.confirmationService.confirm({
      message: 'Do you want to delete the selected row?',
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
            this.configUtilityService.infoMessage("Deleted Successfully");
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

  checkFrom(from, to) {
    if (this.errorDetectionDetail.errorFrom > this.errorDetectionDetail.errorTo) {
      from.setCustomValidity('From value ranges from 400 to 504 and must be smaller than To value.');
    }
    else if (this.errorDetectionDetail.errorFrom == this.errorDetectionDetail.errorTo) {
      from.setCustomValidity('Both From and To status code values cannot be same.');
    }
    else {
      from.setCustomValidity('');
    }
    to.setCustomValidity('');

  }

  checkTo(from, to) {
    if (this.errorDetectionDetail.errorFrom > this.errorDetectionDetail.errorTo) {
      to.setCustomValidity('To value ranges from 401 to 505 and must be greater than From value.');
    }
    else if (this.errorDetectionDetail.errorFrom == this.errorDetectionDetail.errorTo) {
      to.setCustomValidity('Both From and To status code values cannot be same.');
    }
    else {
      to.setCustomValidity('');
    }
    from.setCustomValidity('');
  }
}
