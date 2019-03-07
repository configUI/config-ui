import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'; 
import { ConfirmationService, SelectItem } from 'primeng/primeng'
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Params } from '@angular/router';
import { MethodMonitorData } from '../../../../../containers/instrumentation-data';
import { ConfigUtilityService } from '../../../../../services/config-utility.service';
import { ConfigKeywordsService } from '../../../../../services/config-keywords.service';
import { KeywordData, KeywordList } from '../../../../../containers/keyword-data';

import { deleteMany } from '../../../../../utils/config-utility';
import { ImmutableArray } from '../../../../../utils/immutable-array';

import { Messages, descMsg , addMessage , editMessage } from '../../../../../constants/config-constant'

@Component({
  selector: 'app-method-monitors',
  templateUrl: './method-monitors.component.html',
  styleUrls: ['./method-monitors.component.css']
})
export class MethodMonitorsComponent implements OnInit {

  @Input()
  profileId: number;
  @Output()
  keywordData = new EventEmitter();
  /**It stores method monitor-list data */
  methodMonitorData: MethodMonitorData[];
  /**It stores selected method monitor data for edit or add method-monitor */
  methodMonitorDetail: MethodMonitorData;
  /**It stores selected method monitor data */
  selectedMethodMonitorData: MethodMonitorData[];

  subscription: Subscription;

  /**For add/edit method-monitor flag */
  isNewMethodMonitor: boolean = false;
  /**For open/close add/edit method-monitor detail */
  addEditMethodMonitorDialog: boolean = false;
  saveDisable: boolean = false;

  keywordList: string[] = ['ndMethodMonFile'];
  methodMonitor: Object;
  selectedValues: boolean;
  keywordValue: Object;
  subscriptionEG: Subscription;
  enableGroupKeyword: boolean;

  /** To open file explorer dialog */
  openFileExplorerDialog: boolean = false;

  isMethodMonitorBrowse: boolean = false;
  isProfilePerm: boolean;

  agentType: string = "";
  type: boolean;

  constructor(private configKeywordsService: ConfigKeywordsService, private store: Store<KeywordList>, private confirmationService: ConfirmationService, private route: ActivatedRoute, private configUtilityService: ConfigUtilityService) { }

  ngOnInit() {
    this.agentType = sessionStorage.getItem("agentType");
    this.type = this.agentType == "Java" || this.agentType == "NodeJS" ? true : false;
    this.isProfilePerm=+sessionStorage.getItem("ProfileAccess") == 4 ? true : false;

    if (this.saveDisable || this.isProfilePerm)
    this.configUtilityService.infoMessage("Reset and Save are disabled");

    this.loadMethodMonitorList();

    if (this.configKeywordsService.keywordData != undefined) {
      this.keywordValue = this.configKeywordsService.keywordData;
      let config = {
        'configkeyword' : this.keywordValue
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
      }); */
      let keyVal = JSON.parse(sessionStorage.getItem('keywordValue'));
      this.keywordValue = keyVal['configkeyword'];
    }
    this.methodMonitor = {};
    this.keywordList.forEach((key) => {
      if (this.keywordValue.hasOwnProperty(key)) {
        this.methodMonitor[key] = this.keywordValue[key];
        if (this.methodMonitor[key].value == "true")
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
    if(this.saveDisable == true)
    {
        return;
    }
    let filePath = '';
    for (let key in this.methodMonitor) {
      if (key == 'ndMethodMonFile') {
        if (this.selectedValues == true) {
          this.methodMonitor[key]["value"] = "true";
        //  this.configUtilityService.successMessage("Method Monitors settings are enabled");
        }
        else {
          this.methodMonitor[key]["value"] = "false";
         // this.configUtilityService.infoMessage("Method Monitors settings are disabled");
        }
      }
      this.configKeywordsService.keywordData[key] = this.methodMonitor[key];
      let config = {
        'configkeyword' : this.configKeywordsService.keywordData
      }
      sessionStorage.setItem('keywordValue', JSON.stringify(config));
    }
    // this.configKeywordsService.saveProfileKeywords(this.profileId);
    this.configKeywordsService.getFilePath(this.profileId).subscribe(data => {
      if (this.selectedValues == false) {
        filePath = "NA";
      }
      else {
        filePath = data["_body"];
        filePath = filePath + "/methodmonitors.mml";
      }
      this.methodMonitor['ndMethodMonFile'].path = filePath;
      this.keywordData.emit(this.methodMonitor);
    });

  }
  /**This method is called to load data */

  loadMethodMonitorList() {
    this.route.params.subscribe((params: Params) => {
      this.profileId = params['profileId'];
      if(this.profileId == 1 || this.profileId == 777777 || this.profileId == 888888 || this.profileId == 666666 || this.profileId == 999999)
       this.saveDisable =  true;
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
      this.configUtilityService.errorMessage("Select a row to edit");
      return;
    }
    else if (this.selectedMethodMonitorData.length > 1) {
      this.configUtilityService.errorMessage("Select only one row to edit");
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
      if (this.selectedMethodMonitorData[0].methodName != this.methodMonitorDetail.methodName && this.selectedMethodMonitorData[0].methodDisplayName != this.methodMonitorDetail.methodDisplayName) {
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
        this.configUtilityService.errorMessage("Display Name already exist");
        return true;
      }
      if (this.methodMonitorData[i].methodName == this.methodMonitorDetail.methodName) {
        this.configUtilityService.errorMessage("Method Name already exist");
        return true;
      }
    }
  }

  editMethodMonitor(): void {
    let str = this.methodMonitorDetail.methodName;

    if (this.methodMonitorDetail.methodDisplayName == undefined || this.methodMonitorDetail.methodDisplayName == "") {
      this.methodMonitorDetail.methodDisplayName = str.substring(str.lastIndexOf(".") + 1, str.lastIndexOf("("));
    }
    if (this.methodMonitorDetail.methodDesc != null) {
      if (this.methodMonitorDetail.methodDesc.length > 500) {
        this.configUtilityService.errorMessage(descMsg);
        return;
      }
    }

    this.methodMonitorDetail.agent = this.agentType
    if(this.agentType == "Java" || this.agentType == "NodeJS"){
      this.methodMonitorDetail.module = "-";
    }
    if(this.agentType == "Php"){
      this.methodMonitorDetail.module = "";
    }
    this.configKeywordsService.editMethodMonitorData(this.methodMonitorDetail, this.profileId)
      .subscribe(data => {
        let index = this.getMethodMonitorIndex();
        this.selectedMethodMonitorData.length = 0;
        // this.selectedMethodMonitorData.push(data);
        this.methodMonitorData = ImmutableArray.replace(this.methodMonitorData, data, index);
        this.configUtilityService.successMessage(editMessage);
        // this.methodMonitorData[index] = data;
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
    let str = this.methodMonitorDetail.methodName;

    if (this.methodMonitorDetail.methodDisplayName == undefined || this.methodMonitorDetail.methodDisplayName == "") {
      this.methodMonitorDetail.methodDisplayName = str.substring(str.lastIndexOf(".") + 1, str.lastIndexOf("("));
    }
    if (this.methodMonitorDetail.methodDesc != null) {
      if (this.methodMonitorDetail.methodDesc.length > 500) {
        this.configUtilityService.errorMessage(descMsg);
        return;
      }
    }
    this.methodMonitorDetail.methodName = this.methodMonitorDetail.methodName.trim();
    this.methodMonitorDetail.methodDisplayName = this.methodMonitorDetail.methodDisplayName.trim();
    this.methodMonitorDetail.agent = this.agentType
    if(this.agentType == "Java" || this.agentType == "NodeJS"){
      this.methodMonitorDetail.module = "-";
    }
    if(this.agentType == "Php"){
      this.methodMonitorDetail.module = "";
    }
    this.configKeywordsService.addMethodMonitorData(this.methodMonitorDetail, this.profileId)
      .subscribe(data => {
        //Insert data in main table after inserting Method Monitor in DB
        // this.methodMonitorData.push(data);
        this.methodMonitorData = ImmutableArray.push(this.methodMonitorData, data);
        this.configUtilityService.successMessage(addMessage);
      });
    this.addEditMethodMonitorDialog = false;
  }

  /**This method is used to delete Method Monitor */
  deleteMethodMonitor(): void {
    if (!this.selectedMethodMonitorData || this.selectedMethodMonitorData.length < 1) {
      this.configUtilityService.errorMessage("Select row(s) to delete");
      return;
    }
    this.confirmationService.confirm({
      message: 'Do you want to delete the selected row?',
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
            this.configUtilityService.infoMessage("Deleted Successfully");
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

 /**used to open file manager
  */
  openFileManager() {

    this.openFileExplorerDialog = true;
    this.isMethodMonitorBrowse = true;

  }


  /** This method is called form ProductUI config-nd-file-explorer component with the path
 ..\ProductUI\gui\src\app\modules\file-explorer\components\config-nd-file-explorer\ */

  /* dialog window & set relative path */
  uploadFile(filepath) {
    if (this.isMethodMonitorBrowse == true) {
      this.isMethodMonitorBrowse = false;
      this.openFileExplorerDialog = false;
      //Temporary path of the Method Monitor file to run locally,independently from Product UI
       //let filepath = "";
      this.configKeywordsService.uploadMethodMonitorFile(filepath, this.profileId).subscribe(data => {
        if (data.length == this.methodMonitorData.length) {
         this.configUtilityService.errorMessage("Could not upload. This file may already be imported or contains invalid data ");
         return;
        }
        this.methodMonitorData = data;
        this.configUtilityService.successMessage("File uploaded successfully");
       });
    }
  }

  /* For all selection on header row select*/
  onTableHeaderCheckboxToggle(event: any) {
    if (event.checked === true) {
        this.selectedMethodMonitorData = [];
      for (let m of this.methodMonitorData) {
            this.selectedMethodMonitorData.push(m);
      }
    } else {
      this.selectedMethodMonitorData.length = 0;
    }
  }

  saveMethodMonitorOnFile() {
    this.saveKeywordData();
    this.configKeywordsService.saveMethodMonitorData(this.profileId)
      .subscribe(data => {
        console.log("return type",data)
      })
  }
    // for download Excel, word, Pdf File 
    downloadReports(reports: string) {
      let arrHeader;
      let arrcolSize;
      let arrAlignmentOfColumn;
      let arrFieldName;

      if(this.type){
          arrHeader = { "0": "Fully Qualified Method Name", "1": "Display Name in Monitor" , "2" : "Description"};
          arrcolSize = { "0": 3 , "1" : 1 , "2" : 1 };
          arrAlignmentOfColumn = { "0": "left", "1": "left" , "2" : "left"};
          arrFieldName = {"0": "methodName", "1" : "methodDisplayName" , "2" : "methodDesc"};
      }
      else{
           arrHeader = { "0" : "Module","1": "Fully Qualified Method Name", "2": "Display Name in Monitor" , "3" : "Description"};
           arrcolSize = { "0": 1 , "1" : 2 , "2" : 1 , "3" : 1 };
           arrAlignmentOfColumn = { "0": "left", "1": "left" , "2" : "left"};
           arrFieldName = {"0" : "module" , "1": "methodName", "2" : "methodDisplayName" , "3" : "methodDesc"};
      }
      let object =
        {
          data: this.methodMonitorData,
          headerList: arrHeader,
          colSize: arrcolSize,
          alignArr: arrAlignmentOfColumn,
          fieldName: arrFieldName,
          downloadType: reports,
          title: "Method Monitor",
          fileName: "methodmonitor",
        }
        this.configKeywordsService.downloadReports(JSON.stringify(object)).subscribe(data => {
        this.openDownloadReports(data._body)
      })
    }
  
    /* for open download reports*/
    openDownloadReports(res) {
      window.open("/common/" + res);
    }

  /**
   * Purpose : To invoke the service responsible to open Help Notification Dialog
   * related to the current component.
   */
  sendHelpNotification() {
    this.configKeywordsService.getHelpContent("Instrumentation", "Method Monitor", this.agentType);
  }
 
  ngOnDestroy() {
   this.isMethodMonitorBrowse = false;
  } 


  }
