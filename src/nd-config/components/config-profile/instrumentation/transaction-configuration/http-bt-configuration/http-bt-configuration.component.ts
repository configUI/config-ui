import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SelectItem, ConfirmationService } from 'primeng/primeng';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
// import { Logger } from '../../../../../../../../vendors/angular2-logger/core';

import { ConfigKeywordsService } from '../../../../../services/config-keywords.service';
import { BusinessTransGlobalInfo } from '../../../../../interfaces/business-Trans-global-info';
import { BusinessTransPatternData, BusinessTransGlobalData } from '../../../../../containers/instrumentation-data';

import { ConfigUtilityService } from '../../../../../services/config-utility.service';
import { ConfigUiUtility } from '../../../../../utils/config-utility';
import { ImmutableArray } from '../../../../../utils/immutable-array';
import { deleteMany } from '../../../../../utils/config-utility';

import { ActivatedRoute, Params } from '@angular/router';
import { KeywordData, KeywordList } from '../../../../../containers/keyword-data';
import { Messages } from '../../../../../constants/config-constant';

@Component({
  selector: 'app-http-bt-configuration',
  templateUrl: './http-bt-configuration.component.html',
  styleUrls: ['./http-bt-configuration.component.css']
})
export class HTTPBTConfigurationComponent implements OnInit {

  /**This is to send data to parent component(General Screen Component) for save keyword data */

  @Output()
  keywordData = new EventEmitter();

  profileId: number;

  /* Assign data to Global Bt */
  globalBtDetail: BusinessTransGlobalData;

  /* variable Preselection for URI without Query Parameters */
  selectedQueryPattern: string = 'global';

  /* variable for Global BT  */
  segmentURI: string;
  complete: string;

  /* Assign interface values to businessTransGlobalData */
  businessTransData: BusinessTransGlobalInfo;

  /*It stores selected business Transaction Global Data  for edit */
  businessTransDetail: BusinessTransGlobalData;

  /* Assign dropdown values to segmentList */
  segmentList: SelectItem[];

  /* Assign selected dropdown values to selectedSegmentList */
  selectedSegmentList: string;

  /* Assign dropdown values to Match Mode */
  matchModeList: SelectItem[];

  /* Assign selected dropdown values to selected Mode List */
  selectedMatchMode: string;

  /* Assign  dropdown values to methodTypeList */
  methodTypeList: SelectItem[];

  /* Assign selected dropdown values to selected method type */
  selectesMethodType: string;

  /* Add and Edit Pattern Dialog open */
  addEditPatternDialog: boolean = false;

  /** To open file explorer dialog */
  openFileExplorerDialog: boolean = false;

  /* Add new Pattern Dialog open */
  isNewApp: boolean = false;

  /* Assign data to Pattern data Table */
  selectedPatternData: any;
  businessTransPatternInfo: BusinessTransPatternData[];
  businessTransPatternDetail: BusinessTransPatternData;

  chkInclude: boolean = false;
  saveDisable: boolean = false;

  isBTPatternBrowse: boolean = false;

  subscription: Subscription;

  keywordList: string[] = ['BTRuleConfig'];
  BusinessTransGlobalPattern: Object;

  constructor(private route: ActivatedRoute,
    private configKeywordsService: ConfigKeywordsService,
    private store: Store<KeywordList>,
    private configUtilityService: ConfigUtilityService,
    private confirmationService: ConfirmationService,
    // private log: Logger,
  ) {

    this.segmentList = [];
    let arrLabel = ['First', 'Last', 'Segment Number'];
    let arrValue = ['first', 'last', 'segNo'];
    this.segmentList = ConfigUiUtility.createListWithKeyValue(arrLabel, arrValue);

    this.matchModeList = [];
    arrLabel = ['Exact Match', 'Starts Match'];
    this.matchModeList = ConfigUiUtility.createDropdown(arrLabel);

    this.methodTypeList = [];
    arrLabel = ['GET', 'PUT', 'POST', 'DELETE', 'HEAD', 'TRACE', 'CONNECT', 'OPTIONS'];
    this.methodTypeList = ConfigUiUtility.createDropdown(arrLabel);

    this.initialBusinessTransaction();
  }

  /** Default Values of Global BT */
  initialBusinessTransaction() {
    this.globalBtDetail = new BusinessTransGlobalData();
    /* Assign default value to slowTransaction */
    this.globalBtDetail.slowTransaction = '3000';

    /* Assign default value to slowTransaction */
    this.globalBtDetail.verySlowTransaction = '5000';

    /* Assign default value to slowTransaction */
    this.globalBtDetail.segmentValue = '2';

    this.globalBtDetail.dynamicReqValue = "httpMethod";

    this.globalBtDetail.segmentType = 'first';

    // this.globalBtDetail.segmentURI = 'segmentOfURI';

    this.globalBtDetail.requestHeader = '';

    this.globalBtDetail.requestParam = '';

    this.globalBtDetail.dynamicReqType = false;

    //this.segmentURI = 'segmentOfURI';
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.profileId = params['profileId'];
      this.saveDisable = this.profileId == 1 ? true : false;
    });
    this.configKeywordsService.getBusinessTransGlobalData(this.profileId).subscribe(data => { this.doAssignBusinessTransData(data) });
    this.getKeywordData();
    this.loadBTPatternData();
    this.configKeywordsService.fileListProvider.subscribe(data => {
      this.uploadFile(data);
    });
  }

  getKeywordData() {
    let keywordData;
    //hasOwnProperty is undefined on refreshing page, checking for keywordData if it is undefined or not
    if (this.configKeywordsService.keywordData != undefined) {
      keywordData = this.configKeywordsService.keywordData;
    }
    else {
      this.subscription = this.store.select("keywordData").subscribe(data => {
        var keywordDataVal = {}
        this.keywordList.map(function (key) {
          keywordDataVal[key] = data[key];
        })
        keywordData = keywordDataVal;
      });
    }
    this.BusinessTransGlobalPattern = {};
    this.keywordList.forEach((key) => {
      if (keywordData.hasOwnProperty(key)) {
        this.BusinessTransGlobalPattern[key] = keywordData[key];
        this.selectedQueryPattern = this.BusinessTransGlobalPattern[key].value;
      }
    });
  }

  setSelectedValueOfBT(value) {
    let filePath = '';
    for (let key in this.BusinessTransGlobalPattern) {
      if (key == 'BTRuleConfig') {
        if (value != undefined) {
          this.BusinessTransGlobalPattern[key]["value"] = value;
          this.configKeywordsService.keywordData[key] = this.BusinessTransGlobalPattern[key];
        }
      }
    }
    // this.configKeywordsService.saveProfileKeywords(this.profileId);
    this.configKeywordsService.getFilePath(this.profileId).subscribe(data => {
      filePath = data["_body"];
      if (value == 'pattern') {
        filePath = filePath + "/btPattern.btr";
      }
      else
        filePath = filePath + "/btGlobal.btr"
      this.BusinessTransGlobalPattern['BTRuleConfig'].path = filePath;
      this.keywordData.emit(this.BusinessTransGlobalPattern);
    });
  }

  loadBTPatternData(): void {

    this.configKeywordsService.getBusinessTransPatternData(this.profileId).subscribe(data => this.businessTransPatternInfo = data);
  }

  doAssignBusinessTransData(data) {
    if (data._embedded.bussinessTransGlobal.length == 1) {
      this.globalBtDetail = data._embedded.bussinessTransGlobal[data._embedded.bussinessTransGlobal.length - 1];
      if (String(this.globalBtDetail.complete) == "true")
        this.segmentURI = 'complete';
      else
        this.segmentURI = 'segmentOfURI';

      if (this.globalBtDetail.requestParam == 'false')
        this.globalBtDetail.requestParam = "";
      if (this.globalBtDetail.requestHeader == 'false')
        this.globalBtDetail.requestHeader = "";

    }
    else {
      this.segmentURI = 'segmentOfURI';
    }
  }

  /** Reset All Global BT values */
  resetBusinessTransaction() {
    this.configKeywordsService.getBusinessTransGlobalData(this.profileId).subscribe(data => { this.doAssignBusinessTransData(data) });
  }

  /* Save all values of Business Transaction */
  saveBusinessTransaction() {

    this.globalBtDetail.uriType = this.segmentURI;
    if (this.globalBtDetail.dynamicReqValue == "httpMethod")
      this.globalBtDetail.httpMethod = true;
    else
      this.globalBtDetail.httpMethod = false;

    this.globalBtDetail.verySlowTransaction = "" + this.globalBtDetail.verySlowTransaction;
    this.globalBtDetail.slowTransaction = "" + this.globalBtDetail.slowTransaction;


    this.configKeywordsService.addGlobalData(this.globalBtDetail, this.profileId).subscribe(data => this.configUtilityService.successMessage(Messages));
  }

  /**This method is used to add Pattern detail */
  savePattern(): void {
    if (this.businessTransPatternDetail.dynamicPartReq == true && ((this.businessTransPatternDetail.reqParamKey == undefined || this.businessTransPatternDetail.reqParamKey == "") && (this.businessTransPatternDetail.reqHeaderKey == undefined || this.businessTransPatternDetail.reqHeaderKey == "") && (this.businessTransPatternDetail.reqMethod == undefined || this.businessTransPatternDetail.reqMethod == "-"))) {
      this.configUtilityService.errorMessage("Please provide any one of the dynamic part of request");
      return;
    }
    if (this.chkInclude == true)
      this.businessTransPatternDetail.include = "include"
    else
      this.businessTransPatternDetail.include = "exclude"
    this.setDynamicValuesOFF();    //Method to set values when Dynamic part of request is disabled 
    /**
     * Condition to check if VALUE is filled and KEY is blank
     */
    if ((this.businessTransPatternDetail.reqParamValue != null && this.businessTransPatternDetail.reqParamValue != "") && this.businessTransPatternDetail.reqParamKey == "") {
      this.configUtilityService.errorMessage("Please provide parameter key of the dynamic part of request");
      return;
    }
    if ((this.businessTransPatternDetail.reqHeaderValue != null && this.businessTransPatternDetail.reqHeaderValue != "") && this.businessTransPatternDetail.reqHeaderKey == "") {
      this.configUtilityService.errorMessage("Please provide header key of the dynamic part of request");
      return;
    }

    this.setDynamicValuesON();  //This method is used to set the values of dynamic part components

    this.configKeywordsService.addBusinessTransPattern(this.businessTransPatternDetail, this.profileId)
      .subscribe(data => {
        //Insert data in main table after inserting application in DB
        // this.businessTransPatternInfo.push(data);
        this.businessTransPatternInfo = ImmutableArray.push(this.businessTransPatternInfo, data);
        this.configUtilityService.successMessage(Messages);
      });
    this.closeDialog();
    this.configUtilityService.successMessage("Saved Successfully");

  }

  /* Open Dialog for Add Pattern */
  openAddPatternDialog() {
    this.businessTransPatternDetail = new BusinessTransPatternData();
    this.businessTransPatternDetail.slowTransaction = "3000";
    this.businessTransPatternDetail.verySlowTransaction = "5000";
    this.chkInclude = false;
    this.isNewApp = true;
    this.addEditPatternDialog = true;
  }

  /**For showing edit Pattern dialog */
  editPatternDialog(): void {
    this.businessTransPatternDetail = new BusinessTransPatternData();
    if (!this.selectedPatternData || this.selectedPatternData.length < 1) {
      this.configUtilityService.errorMessage("Select row for edit");
      return;
    }
    else if (this.selectedPatternData.length > 1) {
      this.configUtilityService.errorMessage("Select only one row for edit");
      return;
    }

    if (this.selectedPatternData[0].include == "include")
      this.chkInclude = true;
    else
      this.chkInclude = false;


    this.isNewApp = false;
    this.addEditPatternDialog = true;
    this.businessTransPatternDetail = Object.assign({}, this.selectedPatternData[0]);
  }

  /**This method is used to edit Pattern detail */
  editPattern(): void {
    if (this.chkInclude == true)
      this.businessTransPatternDetail.include = "include";
    else
      this.businessTransPatternDetail.include = "exclude";

    if (this.businessTransPatternDetail.dynamicPartReq == true && ((this.businessTransPatternDetail.reqParamKey == undefined || this.businessTransPatternDetail.reqParamKey == "") && (this.businessTransPatternDetail.reqHeaderKey == undefined || this.businessTransPatternDetail.reqHeaderKey == "") && (this.businessTransPatternDetail.reqMethod == undefined || this.businessTransPatternDetail.reqMethod == "-"))) {
      this.configUtilityService.errorMessage("Please provide any one of the dynamic part of request");
      return;
    }

    this.businessTransPatternDetail.headerKeyValue = this.businessTransPatternDetail.reqHeaderKey + "=" + this.businessTransPatternDetail.reqHeaderValue;
    this.businessTransPatternDetail.paramKeyValue = this.businessTransPatternDetail.reqParamKey + "=" + this.businessTransPatternDetail.reqParamValue;
    this.setDynamicValuesOFF();  //Method to set values when Dynamic part of request is disabled 
    /**
     * Condition to check if VALUE is filled and KEY is blank
     */
    if ((this.businessTransPatternDetail.reqParamValue != null && this.businessTransPatternDetail.reqParamValue != "") && this.businessTransPatternDetail.reqParamKey == "") {
      this.configUtilityService.errorMessage("Please provide parameter key of the dynamic part of request");
      return;
    }
    if ((this.businessTransPatternDetail.reqHeaderValue != null && this.businessTransPatternDetail.reqHeaderValue != "") && this.businessTransPatternDetail.reqHeaderKey == "") {
      this.configUtilityService.errorMessage("Please provide header key of the dynamic part of request");
      return;
    }

    this.setDynamicValuesON();  //This method is used to set the values of dynamic part components

    this.configKeywordsService.editBusinessTransPattern(this.businessTransPatternDetail, this.profileId)
      .subscribe(data => {
        let index = this.getPatternIndex(this.businessTransPatternDetail.id);
        this.selectedPatternData.length = 0;
        if ((data.reqHeaderValue == null || data.reqHeaderValue == "") && data.reqHeaderKey != null)
          data.headerKeyValue = data.reqHeaderKey;
        else if (data.reqHeaderValue != null && data.reqHeaderKey != null)
          data.headerKeyValue = data.headerKeyValue;
        else
          data.headerKeyValue = "-";
        if ((data.reqParamValue == null || data.reqParamValue == "") && data.reqParamKey != null)
          data.paramKeyValue = data.reqParamKey;
        else if (data.reqParamValue != null && data.reqParamKey != null)
          data.paramKeyValue = data.paramKeyValue;
        else
          data.paramKeyValue = "-";
        // this.selectedPatternData.push(data);
        this.businessTransPatternInfo = ImmutableArray.replace(this.businessTransPatternInfo, data, index);
        this.configUtilityService.successMessage(Messages);
      });
    this.closeDialog();

  }
  /**
   * Method to set values when Dynamic part of request is disabled  
   */
  setDynamicValuesOFF(): void {
    if (this.businessTransPatternDetail.dynamicPartReq == false) {
      this.businessTransPatternDetail.reqParamKey = null;
      this.businessTransPatternDetail.reqParamValue = null;
      this.businessTransPatternDetail.reqHeaderKey = null;
      this.businessTransPatternDetail.reqHeaderValue = null;
      this.businessTransPatternDetail.reqMethod = "-";
      this.businessTransPatternDetail.paramKeyValue = "-";
      this.businessTransPatternDetail.headerKeyValue = "-";
    }
  }
  /**
   * This method is used to set the values of dynamic part components
   */
  setDynamicValuesON(): void {
    if (this.businessTransPatternDetail.reqHeaderKey == "" || this.businessTransPatternDetail.reqHeaderKey == null) {
      this.businessTransPatternDetail.reqHeaderValue = null;
      this.businessTransPatternDetail.reqHeaderKey = null;
      this.businessTransPatternDetail.headerKeyValue = "-";
    }
    if (this.businessTransPatternDetail.reqParamKey == "" || this.businessTransPatternDetail.reqParamKey == null) {
      this.businessTransPatternDetail.reqParamValue = null;
      this.businessTransPatternDetail.reqParamKey = null;
      this.businessTransPatternDetail.paramKeyValue = "-";
    }
    if (this.businessTransPatternDetail.reqMethod == null)
      this.businessTransPatternDetail.reqMethod = "-";

  }

  /**This method is common method for save or edit BT Pattern */
  saveADDEditBTPatternTrans(): void {
    //When add new application
    if (this.isNewApp) {
      //Check for app name already exist or not
      if (!this.checkAppNameAlreadyExist()) {
        this.savePattern();
        return;
      }
    }
    //When add edit Pattern
    else {
      if (this.selectedPatternData[0].btName != this.businessTransPatternDetail.btName) {
        if (this.checkAppNameAlreadyExist())
          return;
      }
      this.editPattern();
    }
  }

  /**This method is used to validate the name of Pattern is already exists. */
  checkAppNameAlreadyExist(): boolean {
    for (let i = 0; i < this.businessTransPatternInfo.length; i++) {
      if (this.businessTransPatternInfo[i].btName == this.businessTransPatternDetail.btName) {
        this.configUtilityService.errorMessage("Application Name already exist");
        return true;
      }
    }
  }

  /**This method is used to delete Pattern BT*/
  deletePattern(): void {
    if (!this.selectedPatternData || this.selectedPatternData.length < 1) {
      this.configUtilityService.errorMessage("Select rows to be deleted");
      return;
    }
    this.confirmationService.confirm({
      message: 'Do you want to delete the selected row?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        //Get Selected Applications's AppId
        let selectedApp = this.selectedPatternData;
        let arrAppIndex = [];
        for (let index in selectedApp) {

          arrAppIndex.push(selectedApp[index].id);
        }
        this.configKeywordsService.deleteBusinessTransPattern(arrAppIndex, this.profileId)
          .subscribe(data => {
            this.deletePatternBusinessTransactions(arrAppIndex);
            this.selectedPatternData = [];
            this.configUtilityService.infoMessage("Deleted Successfully");
          })
      },
      reject: () => {
      }
    });
  }


  /**This method returns selected application row on the basis of selected row */
  getPatternIndex(appId: any): number {
    for (let i = 0; i < this.businessTransPatternInfo.length; i++) {
      if (this.businessTransPatternInfo[i].id == appId) {
        return i;
      }
    }
    return -1;
  }

  /**This method is used to delete Pattern from Data Table */
  deletePatternBusinessTransactions(arrIndex) {
    let rowIndex: number[] = [];

    for (let index in arrIndex) {
      rowIndex.push(this.getPatternIndex(arrIndex[index]));
    }
    this.businessTransPatternInfo = deleteMany(this.businessTransPatternInfo, rowIndex);
  }

  /**For close add/edit application dialog box */
  closeDialog(): void {
    this.selectedPatternData = [];
    this.addEditPatternDialog = false;
  }

  checkSlow(slow, vslow) {
    if (this.globalBtDetail.slowTransaction >= this.globalBtDetail.verySlowTransaction) {
      slow.setCustomValidity('Slow value should be less than very slow value.');
    }
    else {
      slow.setCustomValidity('');
    }
    vslow.setCustomValidity('');
  }

  checkVSlow(slow, vslow) {
    if (this.globalBtDetail.slowTransaction >= this.globalBtDetail.verySlowTransaction) {
      vslow.setCustomValidity('Very slow value should be greater than slow value.');
    }
    else {
      vslow.setCustomValidity('');
    }
    slow.setCustomValidity('');
  }

  /**used to open file manager
  */
  openFileManager() {

    this.openFileExplorerDialog = true;
    this.isBTPatternBrowse = true;

  }


  /** This method is called form ProductUI config-nd-file-explorer component with the path
 ..\ProductUI\gui\src\app\modules\file-explorer\components\config-nd-file-explorer\ */

  /* dialog window & set relative path */
  uploadFile(filepath) {
    if (this.isBTPatternBrowse == true) {
      this.isBTPatternBrowse = false;
      this.openFileExplorerDialog = false;

      if (filepath.includes(";")) {
        this.configUtilityService.errorMessage("Multiple files cannot be imported at the same time");
        return;
      }
      //Temporary path of the BT Pattern file to run locally,independently from Product UI
      // let filepath = "";
      this.configKeywordsService.uploadFile(filepath, this.profileId).subscribe(data => {
        if (data.length == this.businessTransPatternInfo.length) {
          this.configUtilityService.errorMessage("Could not upload. This file may already be imported or contains invalid data ");
          return;
        }
        this.businessTransPatternInfo = data;
        this.configUtilityService.successMessage("File uploaded successfully");
      });
    }
  }
}
