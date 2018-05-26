import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ConfirmationService, SelectItem } from 'primeng/primeng'
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Params } from '@angular/router';

import { ExceptionMonitorData } from '../../../../../containers/instrumentation-data';
import { ConfigUtilityService } from '../../../../../services/config-utility.service';
import { ConfigKeywordsService } from '../../../../../services/config-keywords.service';
import { KeywordData, KeywordList } from '../../../../../containers/keyword-data';
import { deleteMany } from '../../../../../utils/config-utility';
import { ImmutableArray } from '../../../../../utils/immutable-array';
import { Messages, descMsg } from '../../../../../constants/config-constant'

@Component({
  selector: 'app-exception-monitors',
  templateUrl: './exception-monitors.component.html',
  styleUrls: ['./exception-monitors.component.css']
})
export class ExceptionMonitorsComponent implements OnInit {

  @Input()
  profileId: number;
  @Output()
  keywordData = new EventEmitter();
  /**It stores method exception-list data */
  exceptionMonitorData: ExceptionMonitorData[];
  /**It stores selected exception monitor data for edit or add exception-monitor */
  exceptionMonitorDetail: ExceptionMonitorData;
  /**It stores selected exception monitor data */
  selectedExceptionMonitorData: ExceptionMonitorData[];

  subscription: Subscription;

  /**For add/edit exception-monitor flag */
  isNewExceptionMonitor: boolean = false;
  /**For open/close add/edit exception-monitor detail */
  addEditExceptionMonitorDialog: boolean = false;
  saveDisable: boolean = false;

  keywordList: string[] = ['ndExceptionMonFile'];
  exceptionMonitor: Object;
  selectedValues: boolean;
  keywordValue: Object;
  /** To open file explorer dialog */
  openFileExplorerDialog: boolean = false;
  isExceptioMonitorBrowse: boolean = false;
  isProfilePerm: boolean;
  constructor(private configKeywordsService: ConfigKeywordsService, private store: Store<KeywordList>, private confirmationService: ConfirmationService, private route: ActivatedRoute, private configUtilityService: ConfigUtilityService) { }

  ngOnInit() {
    this.isProfilePerm = +sessionStorage.getItem("ProfileAccess") == 4 ? true : false;
    this.loadExceptionMonitorList();

    if (this.configKeywordsService.keywordData != undefined) {
      this.keywordValue = this.configKeywordsService.keywordData;
      let config = {
        'configkeyword': this.keywordValue
      }
      sessionStorage.setItem('keywordValue', JSON.stringify(config));
    }
    else {
      // Commenting this as store is giving default value instead of saved
      /*
      this.subscription = this.store.select("keywordData").subscribe(data => {
        var keywordDataVal = {}
        this.keywordList.map(function (key) {
          keywordDataVal[key] = data[key];
        })
        this.keywordValue = keywordDataVal;
      });*/
      let keyVal = JSON.parse(sessionStorage.getItem('keywordValue'));
      this.keywordValue = keyVal['configkeyword'];
    }

    this.exceptionMonitor = {};
    this.keywordList.forEach((key) => {
      if (this.keywordValue.hasOwnProperty(key)) {
        this.exceptionMonitor[key] = this.keywordValue[key];
        if (this.exceptionMonitor[key].value == "true")
          this.selectedValues = true;
        else
          this.selectedValues = false;
      }
    });
    this.configKeywordsService.fileListProvider.subscribe(data => {
      this.uploadFile(data);
    });
  }
  saveKeywordData() {
    if (this.saveDisable == true) {
      return;
    }
    let filePath = '';
    for (let key in this.exceptionMonitor) {
      if (key == 'ndExceptionMonFile') {
        if (this.selectedValues == true) {
          this.exceptionMonitor[key]["value"] = "true";
          // this.configUtilityService.successMessage("Exception Monitors settings are enabled");
        }
        else {
          this.exceptionMonitor[key]["value"] = "false";
          // this.configUtilityService.infoMessage("Exception Monitors settings are disabled");
        }
      }
      this.configKeywordsService.keywordData[key] = this.exceptionMonitor[key];
      let config = {
        'configkeyword': this.configKeywordsService.keywordData
      }
      sessionStorage.setItem('keywordValue', JSON.stringify(config));
    }
    //this.configKeywordsService.saveProfileKeywords(this.profileId);
    this.configKeywordsService.getFilePath(this.profileId).subscribe(data => {
      if (this.selectedValues == false) {
        filePath = "NA";
      }
      else {
        filePath = data["_body"];
        filePath = filePath + "/exceptionMonitors.txt";
      }
      this.exceptionMonitor['ndExceptionMonFile'].path = filePath;
      this.keywordData.emit(this.exceptionMonitor);
    });

  }
  /**This method is called to load data */

  loadExceptionMonitorList() {
    this.route.params.subscribe((params: Params) => {
      this.profileId = params['profileId'];
      if (this.profileId == 1 || this.profileId == 777777 || this.profileId == 888888)
        this.saveDisable = true;
    });
    this.configKeywordsService.getExceptionMonitorList(this.profileId).subscribe(data => {
      this.exceptionMonitorData = data;
    });
  }
  /**For showing add Exception Monitor dialog */
  openAddExceptionMonitorDialog(): void {
    this.exceptionMonitorDetail = new ExceptionMonitorData();
    this.isNewExceptionMonitor = true;
    this.addEditExceptionMonitorDialog = true;
  }

  /**For showing Exception Monitor dialog */
  openEditExceptionMonitorDialog(): void {
    if (!this.selectedExceptionMonitorData || this.selectedExceptionMonitorData.length < 1) {
      this.configUtilityService.errorMessage("Select a row to edit");
      return;
    }
    else if (this.selectedExceptionMonitorData.length > 1) {
      this.configUtilityService.errorMessage("Select only one row to edit");
      return;
    }
    this.exceptionMonitorDetail = new ExceptionMonitorData();
    this.isNewExceptionMonitor = false;
    this.exceptionMonitorDetail = new ExceptionMonitorData();
    this.addEditExceptionMonitorDialog = true;
    this.exceptionMonitorDetail = Object.assign({}, this.selectedExceptionMonitorData[0]);
  }

  saveExceptionMonitor(): void {
    //When add new Exception Monitor
    if (this.isNewExceptionMonitor) {
      //Check for ExceptionMonitor name already exist or not
      if (!this.checkExceptionMonitorNameAlreadyExist()) {
        this.saveExceptionMonitorData();
        return;
      }
    }
    /**When add edit Exception Monitor */
    else {
      if (this.selectedExceptionMonitorData[0].exceptionName != this.exceptionMonitorDetail.exceptionName && this.selectedExceptionMonitorData[0].exceptionDisplayName != this.exceptionMonitorDetail.exceptionDisplayName) {
        if (this.checkExceptionMonitorNameAlreadyExist())
          return;
      }
      this.editExceptionMonitor();
    }
  }

  /**This method is used to validate the name of exception monitor  already exists. */
  checkExceptionMonitorNameAlreadyExist(): boolean {
    for (let i = 0; i < this.exceptionMonitorData.length; i++) {
      if (this.exceptionMonitorData[i].exceptionDisplayName == this.exceptionMonitorDetail.exceptionDisplayName) {
        this.configUtilityService.errorMessage("Display Name already exist");
        return true;
      }
      if (this.exceptionMonitorData[i].exceptionName == this.exceptionMonitorDetail.exceptionName) {
        this.configUtilityService.errorMessage("Exception Name already exist");
        return true;
      }
    }
  }

  editExceptionMonitor(): void {
    let str = this.exceptionMonitorDetail.exceptionName;

    if (this.exceptionMonitorDetail.exceptionDisplayName == undefined || this.exceptionMonitorDetail.exceptionDisplayName == "") {
      this.exceptionMonitorDetail.exceptionDisplayName = str.substring(str.lastIndexOf(".") + 1, str.lastIndexOf("("));
    }
    if (this.exceptionMonitorDetail.exceptionDesc != null) {
      if (this.exceptionMonitorDetail.exceptionDesc.length > 500) {
        this.configUtilityService.errorMessage(descMsg);
        return;
      }
    }
    this.configKeywordsService.editExceptionMonitorData(this.exceptionMonitorDetail, this.profileId)
      .subscribe(data => {
        let index = this.getExceptionMonitorIndex();
        this.selectedExceptionMonitorData.length = 0;
        // this.selectedExceptionMonitorData.push(data);
        this.exceptionMonitorData = ImmutableArray.replace(this.exceptionMonitorData, data, index);
        this.configUtilityService.successMessage(Messages);
        // this.exceptionMonitorData[index] = data;
      });
    this.addEditExceptionMonitorDialog = false;
  }

  getExceptionMonitorIndex(): number {
    if (this.exceptionMonitorDetail) {
      let exceptionId = this.exceptionMonitorDetail.exceptionId;
      for (let i = 0; i < this.exceptionMonitorData.length; i++) {
        if (this.exceptionMonitorData[i].exceptionId == exceptionId) {
          return i;
        }
      }
    }
    return -1;
  }
  /**This method save Exception Monitor data at backend */
  saveExceptionMonitorData(): void {
    let str = this.exceptionMonitorDetail.exceptionName;

    if (this.exceptionMonitorDetail.exceptionDisplayName == undefined || this.exceptionMonitorDetail.exceptionDisplayName == "") {
      this.exceptionMonitorDetail.exceptionDisplayName = str.substring(str.lastIndexOf(".") + 1, str.lastIndexOf("("));
    }
    if (this.exceptionMonitorDetail.exceptionDesc != null) {
      if (this.exceptionMonitorDetail.exceptionDesc.length > 500) {
        this.configUtilityService.errorMessage(descMsg);
        return;
      }
    }
    this.exceptionMonitorDetail.exceptionName = this.exceptionMonitorDetail.exceptionName;
    this.exceptionMonitorDetail.exceptionDisplayName = this.exceptionMonitorDetail.exceptionDisplayName;
    this.configKeywordsService.addExceptionMonitorData(this.exceptionMonitorDetail, this.profileId)
      .subscribe(data => {
        //Insert data in main table after inserting Exception Monitor in DB
        // this.exceptionMonitorData.push(data);
        this.exceptionMonitorData = ImmutableArray.push(this.exceptionMonitorData, data);
        this.configUtilityService.successMessage(Messages);
      });
    this.addEditExceptionMonitorDialog = false;
  }

  /**This method is used to delete Exception Monitor */
  deleteExceptionMonitor(): void {
    if (!this.selectedExceptionMonitorData || this.selectedExceptionMonitorData.length < 1) {
      this.configUtilityService.errorMessage("Select row(s) to delete");
      return;
    }
    this.confirmationService.confirm({
      message: 'Do you want to delete the selected row?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        //Get Selected Applications's AppId
        let selectedApp = this.selectedExceptionMonitorData;
        let arrAppIndex = [];
        for (let index in selectedApp) {
          arrAppIndex.push(selectedApp[index].exceptionId);
        }
        this.configKeywordsService.deleteExceptionMonitorData(arrAppIndex, this.profileId)
          .subscribe(data => {
            this.deleteExceptionMonitorFromTable(arrAppIndex);
            this.selectedExceptionMonitorData = [];
            this.configUtilityService.infoMessage("Deleted Successfully");
          })
      },
      reject: () => {
      }
    });
  }
  /**This method is used to delete  from Data Table */
  deleteExceptionMonitorFromTable(arrIndex) {
    let rowIndex: number[] = [];

    for (let index in arrIndex) {
      rowIndex.push(this.getExceptionMonitor(arrIndex[index]));
    }
    this.exceptionMonitorData = deleteMany(this.exceptionMonitorData, rowIndex);
  }
  /**This method returns selected application row on the basis of selected row */
  getExceptionMonitor(appId: any): number {
    for (let i = 0; i < this.exceptionMonitorData.length; i++) {
      if (this.exceptionMonitorData[i].exceptionId == appId) {
        return i;
      }
    }
    return -1;
  }

  /**used to open file manager
   */
  openFileManager() {

    this.openFileExplorerDialog = true;
    this.isExceptioMonitorBrowse = true;

  }

  /** This method is called form ProductUI config-nd-file-explorer component with the path
 ..\ProductUI\gui\src\app\modules\file-explorer\components\config-nd-file-explorer\ */

  /* dialog window & set relative path */
  uploadFile(filepath) {
    if (this.isExceptioMonitorBrowse == true) {
      this.isExceptioMonitorBrowse = false;
      this.openFileExplorerDialog = false;

      let str: string;
      let str1: string;
      str = filepath.substring(filepath.lastIndexOf("/"), filepath.length)
      str1 = str.substring(str.lastIndexOf("."), str.length);
      let type: boolean = true;
      if (str1 == ".txt" || str1 == ".eml") {
        type = false;
      }
      if (type) {
        this.configUtilityService.errorMessage("Extension(s) other than .txt and .eml are not supported");
        return
      }

      if (filepath.includes(";")) {
        this.configUtilityService.errorMessage("Multiple files cannot be imported at the same time");
        return;
      }
      console.log("before hitting service")
      this.configKeywordsService.uploadExceptionMonitorFile(filepath, this.profileId).subscribe(data => {
        if (data.length == this.exceptionMonitorData.length) {
          this.configUtilityService.errorMessage("Could not upload. This file may already be imported or contains invalid data ");
          return;
        }
        this.exceptionMonitorData = data;
        // this.exceptionMonitorData = ImmutableArray.push(this.exceptionMonitorData, data);
        this.configUtilityService.successMessage("File uploaded successfully");
      });
    }
  }
  saveExceptionMonitorOnFile() {
    this.saveKeywordData();
    this.configKeywordsService.saveExceptionMonitorData(this.profileId)
      .subscribe(data => {

      })
  }

  // for download Excel, word, Pdf File 
  downloadReports(reports: string) {
    let arrHeader = { "0": "Exception Name", "1": "Display Name", "2": "Description" };
    let arrcolSize = { "0": 3, "1": 3, "2": 4 };
    let arrAlignmentOfColumn = { "0": "left", "1": "left", "2": "left" };
    let arrFieldName = { "0": "exceptionName", "1": "exceptionDisplayName", "2": "exceptionDesc" };
    let object =
      {
        data: this.exceptionMonitorData,
        headerList: arrHeader,
        colSize: arrcolSize,
        alignArr: arrAlignmentOfColumn,
        fieldName: arrFieldName,
        downloadType: reports,
        title: "Exception Monitor",
        fileName: "exceptionmonitor",
      }
    this.configKeywordsService.downloadReports(JSON.stringify(object)).subscribe(data => {
      this.openDownloadReports(data._body)
    })
  }

  /* for open download reports*/
  openDownloadReports(res) {
    window.open("/common/" + res);
  }

  /* change Browse boolean value on change component */
  ngOnDestroy() {
    this.isExceptioMonitorBrowse = false;
  }
}
