import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SelectItem, ConfirmationService } from 'primeng/primeng';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
// import { Logger } from '../../../../../../../../vendors/angular2-logger/core';

import { ConfigKeywordsService } from '../../../../../services/config-keywords.service';
import { BusinessTransGlobalInfo } from '../../../../../interfaces/business-Trans-global-info';
import { BusinessTransPatternData, BusinessTransGlobalData, RequestParamData } from '../../../../../containers/instrumentation-data';

import { ConfigUtilityService } from '../../../../../services/config-utility.service';
import { ConfigUiUtility } from '../../../../../utils/config-utility';
import { ImmutableArray } from '../../../../../utils/immutable-array';
import { deleteMany } from '../../../../../utils/config-utility';

import { ActivatedRoute, Params } from '@angular/router';
import { KeywordData, KeywordList } from '../../../../../containers/keyword-data';
import { Messages } from '../../../../../constants/config-constant';
import { ConfigHomeService } from '../../../../../services/config-home.service';

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
  parentBtId: number;
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

  isProfilePerm: boolean;
  subscription: Subscription;

  reqParamKeyCheck: boolean = false;
  openReqKeyVal: boolean = false;

  //Reuest parameter key and value table
  reqParamInfo: any[];
  selectedReqParam: RequestParamData[];
  reqParamDetail: RequestParamData;

  reqParamCount: number = 0;
  editReqParamCount: number = 0;

  editReqParam: boolean = false;

  isNewParam: boolean = false;

  keywordList: string[] = ['BTRuleConfig'];
  BusinessTransGlobalPattern: Object;
  agentType: string = "";

  // keywords for add sub Bt pattern
  detailOfSubBTPatternDialog: boolean;
  addEditSubPatternDialog: boolean;
  subBusinessTransPatternInfo: BusinessTransPatternData[];
  isNewSubApp: boolean = false;
  selectedSubPatternData: any;
  reqHeaderKey: string;

  selectedBtId: number;


  constructor(private route: ActivatedRoute,
    private configKeywordsService: ConfigKeywordsService,
    private store: Store<KeywordList>,
    private configUtilityService: ConfigUtilityService,
    private confirmationService: ConfirmationService,
    private configHomeService: ConfigHomeService
    // private log: Logger,
  ) {

    this.configHomeService.selectedValueOfBT$.subscribe(data => {
      this.setSelectedValueOfBT(data);
    });

    this.agentType = sessionStorage.getItem("agentType");

    this.segmentList = [];
    let arrLabel = ['First', 'Last'];
    let arrValue = ['FromFirst', 'FromLast'];
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

    this.globalBtDetail.slowDynamicThreshold = '10';
    this.globalBtDetail.verySlowDynamicThreshold = '20';

    /* Assign default value to slowTransaction */
    this.globalBtDetail.segmentValue = '2';

    this.globalBtDetail.dynamicReqValue = "httpMethod";

    this.globalBtDetail.segmentType = 'FromFirst';

    // this.globalBtDetail.segmentURI = 'segmentOfURI';

    this.globalBtDetail.requestHeader = '';

    this.globalBtDetail.requestParam = '';

    this.globalBtDetail.dynamicReqType = false;

    this.globalBtDetail.segmentNo = '';

    //this.segmentURI = 'segmentOfURI';
  }

  ngOnInit() {
    this.isProfilePerm = +sessionStorage.getItem("ProfileAccess") == 4 ? true : false;
    this.route.params.subscribe((params: Params) => {
      this.profileId = params['profileId'];
      if (this.profileId == 1 || this.profileId == 777777 || this.profileId == 888888)
        this.saveDisable = true;
    });
    this.configKeywordsService.getBusinessTransGlobalData(this.profileId).subscribe(data => {
      this.doAssignBusinessTransData(data)
    });

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
    if (value == true) {
      value = this.selectedQueryPattern;
    }
    this.saveBusinessTransaction();
    if (this.saveDisable == true) {
      return;
    }
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
        filePath = filePath + "/btPattern.btr;BTTConfig=" + filePath + "/btPatternThreshold.btt";
      }
      else
        filePath = filePath + "/btGlobal.btr;BTTConfig=" + filePath + "/btGlobalThreshold.btt";
      this.BusinessTransGlobalPattern['BTRuleConfig'].path = filePath;
      this.keywordData.emit(this.BusinessTransGlobalPattern);
    });
  }

  loadBTPatternData(): void {
    this.configKeywordsService.getBusinessTransPatternData(this.profileId).subscribe(data => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].paramKeyValue == null || data[i].paramKeyValue == "NA") {
          data[i].paramKeyValue = "-";
        }
        if (data[i].reqMethod == null) {
          data[i].reqMethod = "-";
        }
        if (data[i].headerKeyValue == null || data[i].headerKeyValue == "NA") {
          data[i].headerKeyValue = "-";
        }
      }

      this.businessTransPatternInfo = data;
    });
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
      if (this.globalBtDetail.dynamicReqValue == 'segmentNo') {
        if (this.globalBtDetail.segmentNo.includes("%2C")) {
          this.globalBtDetail.segmentNo = this.globalBtDetail.segmentNo.replace(/%2C/g, ",")
        }
      }


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

    if (this.globalBtDetail.dynamicReqValue == 'segmentNo') {
      if (this.globalBtDetail.segmentNo.includes(",")) {
        this.globalBtDetail.segmentNo = this.globalBtDetail.segmentNo.replace(/\,/g, "%2C")
      }
    }
    this.globalBtDetail.verySlowTransaction = "" + this.globalBtDetail.verySlowTransaction;
    this.globalBtDetail.slowTransaction = "" + this.globalBtDetail.slowTransaction;

    this.configKeywordsService.addGlobalData(this.globalBtDetail, this.profileId).subscribe(data => {
      if (this.globalBtDetail.segmentNo != null) {
        if (this.globalBtDetail.segmentNo.includes("%2C")) {
          this.globalBtDetail.segmentNo = this.globalBtDetail.segmentNo.replace(/%2C/g, ",")
        }
      }
    }
    );
  }

  /**This method is used to add Pattern detail */
  savePattern(): void {
    if (this.businessTransPatternDetail.dynamicPartReq == true && (this.reqParamKeyCheck == false) && (this.businessTransPatternDetail.reqHeaderKey == undefined || this.businessTransPatternDetail.reqHeaderKey == "") && (this.businessTransPatternDetail.reqParamKey == undefined || this.businessTransPatternDetail.reqParamKey == "") && (this.businessTransPatternDetail.reqMethod == undefined || this.businessTransPatternDetail.reqMethod == "-")) {
      this.configUtilityService.errorMessage("Please provide any one of the dynamic part of request");
      return;
    }
    if (this.businessTransPatternDetail.dynamicPartReq == true && this.reqParamKeyCheck == true && this.reqParamInfo.length == 0) {
      this.configUtilityService.errorMessage("Provide request parameters");
      return;
    }
    if (this.businessTransPatternDetail.dynamicPartReq == false) {
      this.reqParamKeyCheck = false;
      this.reqParamInfo = [];
    }
    if (this.chkInclude == true)
      this.businessTransPatternDetail.include = "exclude"
    else
      this.businessTransPatternDetail.include = "include"

      if(this.businessTransPatternDetail.reqHeaderValue != undefined && this.businessTransPatternDetail.reqHeaderValue != "")
        this.businessTransPatternDetail.headerKeyValue = this.businessTransPatternDetail.reqHeaderKey + "=" + this.businessTransPatternDetail.reqHeaderValue;
      else
        this.businessTransPatternDetail.headerKeyValue = this.businessTransPatternDetail.reqHeaderKey;

        if(this.businessTransPatternDetail.reqParamValue  != undefined && this.businessTransPatternDetail.reqParamValue  != "")
          this.businessTransPatternDetail.paramKeyValue = this.businessTransPatternDetail.reqParamKey + "=" + this.businessTransPatternDetail.reqParamValue;
        else
          this.businessTransPatternDetail.paramKeyValue = this.businessTransPatternDetail.reqParamKey

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

    let tempParam = this.createKeyValString();
    // this.businessTransPatternDetail.reqParamKeyVal = tempParam;
    this.businessTransPatternDetail.agent = this.agentType;
    if(this.businessTransPatternInfo.length > 0){
    for(let i= 0;i<this.businessTransPatternInfo.length;i++){
      if(this.businessTransPatternDetail.urlName == this.businessTransPatternInfo[i].urlName
        && this.businessTransPatternDetail.matchType == this.businessTransPatternInfo[i].matchType
        && this.businessTransPatternDetail.reqMethod == this.businessTransPatternInfo[i].reqMethod
        && this.businessTransPatternDetail.headerKeyValue == this.businessTransPatternInfo[i].headerKeyValue
        && this.businessTransPatternDetail.paramKeyValue == this.businessTransPatternInfo[i].paramKeyValue){
        this.configUtilityService.errorMessage("Header key/value pair already exists")
        return;
      }
    }
    for(let i= 0;i<this.businessTransPatternInfo.length;i++){
       if(this.businessTransPatternDetail.urlName == this.businessTransPatternInfo[i].urlName
        && this.businessTransPatternDetail.matchType == this.businessTransPatternInfo[i].matchType
        && this.businessTransPatternDetail.reqMethod == this.businessTransPatternInfo[i].reqMethod
        && this.businessTransPatternDetail.reqHeaderKey == this.businessTransPatternInfo[i].reqHeaderKey
        && this.businessTransPatternDetail.paramKeyValue == this.businessTransPatternInfo[i].paramKeyValue)
      {
        this.parentBtId = +this.businessTransPatternInfo[i].btId;
        break;
      }
      else{
        this.parentBtId = -1;
      }
    }
  }
  else{
    this.parentBtId = -1;    
  }
      this.configKeywordsService.addBusinessTransPattern(this.businessTransPatternDetail, this.profileId, this.parentBtId)
      .subscribe(data => {
        //Insert data in main table after inserting application in DB
        // this.businessTransPatternInfo.push(data);
        this.businessTransPatternInfo = ImmutableArray.push(this.businessTransPatternInfo, data);
        this.configUtilityService.successMessage(Messages);
      });
    this.closeDialog();
    this.configUtilityService.successMessage("Saved Successfully");

  }


  //method to convert key and value table data into a string
  createKeyValString() {
    var tempParam = "";
    if (!this.reqParamKeyCheck) {
      this.reqParamInfo = [];
      tempParam = "-";
    }
    else {
      for (var i = 0; i < this.reqParamInfo.length; i++) {

        //If there is only one key and value pair
        if (i == 0) {
          if (this.reqParamInfo[i].value == undefined || this.reqParamInfo[i].value == "" || this.reqParamInfo[i].value == "-")
            tempParam = this.reqParamInfo[i].key
          else
            tempParam = this.reqParamInfo[i].key + "=" + this.reqParamInfo[i].value;
        }

        //For more than one key and value pair
        else {
          if (this.reqParamInfo[i].value == undefined || this.reqParamInfo[i].value == "" || this.reqParamInfo[i].value == "-")
            tempParam = tempParam + "&" + this.reqParamInfo[i].key
          else
            tempParam = tempParam + "&" + this.reqParamInfo[i].key + "=" + this.reqParamInfo[i].value;
        }
      }
    }
    return tempParam;
  }

  /* Open Dialog for Add Pattern */
  openAddPatternDialog() {
    this.businessTransPatternDetail = new BusinessTransPatternData();
    this.reqParamInfo = [];
    this.businessTransPatternDetail.slowTransaction = "3000";
    this.businessTransPatternDetail.verySlowTransaction = "5000";
    this.businessTransPatternDetail.slowDynamicThreshold = "10";
    this.businessTransPatternDetail.verySlowDynamicThreshold = "20";
    this.chkInclude = false;
    this.isNewApp = true;
    this.addEditPatternDialog = true;
    this.reqParamKeyCheck = false;
  }

  /**For showing edit Pattern dialog */
  editPatternDialog(): void {
    this.businessTransPatternDetail = new BusinessTransPatternData();
    this.reqParamDetail = new RequestParamData();
    this.reqParamInfo = [];
    if (!this.selectedPatternData || this.selectedPatternData.length < 1) {
      this.configUtilityService.errorMessage("Select a row to edit");
      return;
    }
    else if (this.selectedPatternData.length > 1) {
      this.configUtilityService.errorMessage("Select only one row to edit");
      return;
    }

    if (this.selectedPatternData[0].include == "include")
      this.chkInclude = false;
    else
      this.chkInclude = true;

    if (this.businessTransPatternDetail.dynamicPartReq == true && (this.reqParamKeyCheck == false) && (this.businessTransPatternDetail.reqHeaderKey == undefined || this.businessTransPatternDetail.reqHeaderKey == "" || this.businessTransPatternDetail.reqHeaderKey == "-") && (this.businessTransPatternDetail.reqMethod == undefined || this.businessTransPatternDetail.reqMethod == "-")) {
      this.businessTransPatternDetail.dynamicPartReq = false;
      this.businessTransPatternDetail.reqHeaderKey == "";
    }

    if (this.reqParamInfo.length == 0) {
      this.reqParamKeyCheck = false;
    }
    this.isNewApp = false;
    this.addEditPatternDialog = true;

    // //Splitting the request parameter key/value in the form of table data
    // if (this.selectedPatternData[0].paramKeyValue != "-") {

    //   /**
    //    * If there are more than one request parameter key/value then
    //    * Format - key1=val1&key2=val2&key3
    //    * Then splitting them to get each key/value pair 
    //    */
    //   if (this.selectedPatternData[0].paramKeyValue != null) {
    //     if (this.selectedPatternData[0].paramKeyValue.includes("&")) {
    //       let arrKeyVal = this.selectedPatternData[0].paramKeyValue.split("&");
    //       let that = this;
    //       if (arrKeyVal.length > 1) {
    //         this.reqParamKeyCheck = true;
    //         for (let i = 0; i < arrKeyVal.length; i++) {

    //           /**Splitting key and value to fill in table
    //            * In this case, both key and value are given like key1=val1
    //            */
    //           if (arrKeyVal[i].includes("=")) {
    //             let arr = arrKeyVal[i].split("=");
    //             let details = [{ "key": arr[0], "value": arr[1] }];
    //             this.reqParamInfo = ImmutableArray.push(this.reqParamInfo, details[0]);
    //           }

    //           //In this case, only key is given i.e. key1
    //           else {
    //             let details = [{ "key": arrKeyVal[i], "value": "-" }];
    //             this.reqParamInfo = ImmutableArray.push(this.reqParamInfo, details[0]);
    //           }
    //         }
    //       }
    //     }
    //     /**
    //      * For a single key/value pair
    //      * Format- key=val
    //      */
    //     else {

    //       //Splitting when key and value both are provided
    //       if (this.selectedPatternData[0].paramKeyValue != null) {
    //         if (this.selectedPatternData[0].paramKeyValue.includes("=")) {
    //           this.reqParamKeyCheck = true;
    //           let arr = this.selectedPatternData[0].paramKeyValue.split("=");
    //           let details = [{ "key": arr[0], "value": arr[1] }];

    //           this.reqParamInfo = ImmutableArray.push(this.reqParamInfo, details[0]);
    //         }

    //         //Splitting when only key is provided
    //         else if (this.selectedPatternData[0].paramKeyValue != "") {
    //           this.reqParamKeyCheck = true;
    //           let details = [{ "key": this.selectedPatternData[0].paramKeyValue, "value": "-" }];

    //           this.reqParamInfo = ImmutableArray.push(this.reqParamInfo, details[0]);

    //         }
    //       }
    //     }
    //   }
    // }
    this.businessTransPatternDetail = Object.assign({}, this.selectedPatternData[0]);
  }

  /**This method is used to edit Pattern detail */
  editPattern(): void {
    if (this.chkInclude == true)
      this.businessTransPatternDetail.include = "exclude";
    else
      this.businessTransPatternDetail.include = "include";

    if (this.businessTransPatternDetail.dynamicPartReq == true && (this.reqParamKeyCheck == false) && (this.businessTransPatternDetail.reqHeaderKey == undefined || this.businessTransPatternDetail.reqHeaderKey == "") && (this.businessTransPatternDetail.reqParamKey == undefined || this.businessTransPatternDetail.reqParamKey == "") && (this.businessTransPatternDetail.reqMethod == undefined || this.businessTransPatternDetail.reqMethod == "-")) {
      this.configUtilityService.errorMessage("Please provide any one of the dynamic part of request");
      return;
    }

    //If request parameter is checked but data table is empty , then showing an error message
    if (this.businessTransPatternDetail.dynamicPartReq == true && this.reqParamKeyCheck == true && this.reqParamInfo.length == 0) {
      this.configUtilityService.errorMessage("Provide request parameters");
      return;
    }
    if (this.businessTransPatternDetail.dynamicPartReq == false) {
      this.reqParamKeyCheck = false;
      this.reqParamInfo = [];
    }

    if(this.businessTransPatternDetail.reqHeaderValue != undefined && this.businessTransPatternDetail.reqHeaderValue != null && this.businessTransPatternDetail.reqHeaderValue != "")
    this.businessTransPatternDetail.headerKeyValue = this.businessTransPatternDetail.reqHeaderKey + "=" + this.businessTransPatternDetail.reqHeaderValue;
  else
    this.businessTransPatternDetail.headerKeyValue = this.businessTransPatternDetail.reqHeaderKey;

    if(this.businessTransPatternDetail.reqParamValue  != undefined && this.businessTransPatternDetail.reqParamValue  != null  && this.businessTransPatternDetail.reqParamValue  != "")
      this.businessTransPatternDetail.paramKeyValue = this.businessTransPatternDetail.reqParamKey + "=" + this.businessTransPatternDetail.reqParamValue;
    else
      this.businessTransPatternDetail.paramKeyValue = this.businessTransPatternDetail.reqParamKey
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


    let tempParam = this.createKeyValString();
    // this.businessTransPatternDetail.reqParamKeyVal = tempParam;
    this.businessTransPatternDetail.agent = this.agentType;
    // this.parentBtId = -1;
    for(let i= 0;i<this.businessTransPatternInfo.length;i++){
      if(this.selectedPatternData[0] != this.businessTransPatternInfo[i]){
       if(this.businessTransPatternDetail.urlName == this.businessTransPatternInfo[i].urlName
        && this.businessTransPatternDetail.matchType == this.businessTransPatternInfo[i].matchType
        && this.businessTransPatternDetail.reqMethod == this.businessTransPatternInfo[i].reqMethod
        && this.businessTransPatternDetail.reqHeaderKey == this.businessTransPatternInfo[i].reqHeaderKey
        && this.businessTransPatternDetail.paramKeyValue == this.businessTransPatternInfo[i].paramKeyValue)
      {
        this.businessTransPatternDetail.parentBtId = +this.businessTransPatternInfo[i].btId;
        break;
      }
      else{
        this.businessTransPatternDetail.parentBtId = -1;
      }
    }
    else
      continue;
  }
  for(let i= 0;i<this.businessTransPatternInfo.length;i++){
      if(this.selectedPatternData[0] != this.businessTransPatternInfo[i]){
        if(this.businessTransPatternDetail.urlName == this.businessTransPatternInfo[i].urlName
         && this.businessTransPatternDetail.matchType == this.businessTransPatternInfo[i].matchType
         && this.businessTransPatternDetail.reqMethod == this.businessTransPatternInfo[i].reqMethod
         && this.businessTransPatternDetail.headerKeyValue == this.businessTransPatternInfo[i].headerKeyValue
         && this.businessTransPatternDetail.paramKeyValue == this.businessTransPatternInfo[i].paramKeyValue){
           this.configUtilityService.errorMessage("Header key value pair already exists")
           return
    }
  }
  else
    continue;
}
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
        this.selectedPatternData.push(data);
        // this.selectedPatternData[0].paramKeyValue = data.reqParamKeyVal
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
      if (this.businessTransPatternDetail.dynamicPartReq == false || this.businessTransPatternDetail.dynamicPartReq == undefined) {
        this.businessTransPatternDetail.reqHeaderKey = null;
        this.businessTransPatternDetail.reqParamKey = null;
        this.businessTransPatternDetail.reqMethod = "-";
      }
      if ((this.selectedPatternData[0].btName == this.businessTransPatternDetail.btName) && (this.selectedPatternData[0].urlName == this.businessTransPatternDetail.urlName) && (this.selectedPatternData[0].reqParamKey == this.businessTransPatternDetail.reqParamKey) && (this.selectedPatternData[0].reqHeaderKey == this.businessTransPatternDetail.reqHeaderKey) && (this.selectedPatternData[0].reqMethod == this.businessTransPatternDetail.reqMethod)) {
        this.editPattern();
      }
      else {
        if (this.checkAppNameAlreadyExist())
          return;
        else
          this.editPattern();
      }
    }
  }

  /**This method is used to validate the name of Pattern is already exists. */
  checkAppNameAlreadyExist(): boolean {
    if (this.businessTransPatternDetail.dynamicPartReq == false || this.businessTransPatternDetail.dynamicPartReq == undefined) {
      this.businessTransPatternDetail.reqHeaderKey = null;
      this.businessTransPatternDetail.reqParamKey = null;
      this.businessTransPatternDetail.reqMethod = "-";
    }
    if (this.businessTransPatternDetail.dynamicPartReq == true) {
      if (this.businessTransPatternDetail.reqHeaderKey != null || this.businessTransPatternDetail.reqHeaderKey != undefined) {
        if (this.businessTransPatternDetail.reqHeaderKey == "")
          this.businessTransPatternDetail.reqHeaderKey = null;
        this.businessTransPatternDetail.reqHeaderKey = this.businessTransPatternDetail.reqHeaderKey;
      }
      else {
        this.businessTransPatternDetail.reqHeaderKey = null;
      }
      if (this.businessTransPatternDetail.reqParamKey != null || this.businessTransPatternDetail.reqParamKey != undefined) {
        if (this.businessTransPatternDetail.reqParamKey == "")
          this.businessTransPatternDetail.reqParamKey = null
        this.businessTransPatternDetail.reqParamKey = this.businessTransPatternDetail.reqParamKey;
      }
      else {
        this.businessTransPatternDetail.reqParamKey = null;
      }
      if (this.businessTransPatternDetail.reqMethod != undefined || this.businessTransPatternDetail.reqMethod != null) {
        this.businessTransPatternDetail.reqMethod = this.businessTransPatternDetail.reqMethod;
      }
      else {
        this.businessTransPatternDetail.reqMethod = "-";
      }
    }
    for (let i = 0; i < this.businessTransPatternInfo.length; i++) {
      if (this.businessTransPatternInfo[i].urlName == this.businessTransPatternDetail.urlName &&
        this.businessTransPatternInfo[i].btName == this.businessTransPatternDetail.btName
        && this.businessTransPatternInfo[i].reqParamKey == this.businessTransPatternDetail.reqParamKey &&
        this.businessTransPatternInfo[i].reqHeaderKey == this.businessTransPatternDetail.reqHeaderKey
        && this.businessTransPatternInfo[i].reqMethod == this.businessTransPatternDetail.reqMethod) {
        this.configUtilityService.errorMessage("BT pattern already exists");
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
    //  this.selectedPatternData = [];
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
        for (let i = 0; i < data.length; i++) {
          if (data[i].paramKeyValue == null || data[i].paramKeyValue == "NA") {
            data[i].paramKeyValue = "-";
          }
          if (data[i].reqMethod == null) {
            data[i].reqMethod = "-";
          }
          if (data[i].headerKeyValue == null || data[i].headerKeyValue == "NA") {
            data[i].headerKeyValue = "-";
          }
        }
        if (data.length == this.businessTransPatternInfo.length) {
          this.configUtilityService.errorMessage("Could not upload. This file may already be imported or contains invalid data ");
          return;
        }
        this.businessTransPatternInfo = data;
        this.configUtilityService.successMessage("File uploaded successfully");
      });
    }
  }

  //Opens request parameter dialog
  openReqKeyValDialog() {
    this.openReqKeyVal = true;
    this.editReqParam = false;
    this.isNewParam = true;
    this.reqParamDetail = new RequestParamData();
  }

  //To save and edit request parameter values
  saveReqParam() {
    if (this.reqParamInfo == undefined)
      this.reqParamInfo = [];

    if (!this.reqParamDetail.value || this.reqParamDetail.value == undefined || this.reqParamDetail.value == "") {
      this.reqParamDetail.value = "-";
    }
    if (this.editReqParam) {
      //to edit request parameter key and value
      this.editReqParam = false;
      this.openReqKeyVal = false;
      let that = this;
      this.reqParamInfo.map(function (val) {
        if (val.id == that.reqParamDetail.id) {
          val.key = that.reqParamDetail.key;
          val.value = that.reqParamDetail.value;
        }
      });
      this.selectedReqParam = [];

    }
    else {
      // to add request parameter key and value
      this.reqParamDetail["id"] = this.reqParamCount
      this.reqParamInfo = ImmutableArray.push(this.reqParamInfo, this.reqParamDetail);
      this.reqParamCount = this.reqParamCount + 1;
    }


    this.openReqKeyVal = false;
  }

  //Delete request parameters key/val
  deleteReqParam() {
    if (!this.selectedReqParam || this.selectedReqParam.length < 1) {
      this.configUtilityService.errorMessage("Select row(s) to delete");
      return;
    }
    else {
      let selectReqParam = this.selectedReqParam;
      let arrReqIndex = [];
      for (let index in selectReqParam) {
        arrReqIndex.push(selectReqParam[index]);
      }
      this.deleteConditionFromTable(arrReqIndex);
      this.selectedReqParam = [];

    }
  }

  /**This method is used to delete request parameter from Data Table */
  deleteConditionFromTable(arrReqIndex: any[]): void {
    //For stores table row index
    let rowIndex: number[] = [];

    for (let index in arrReqIndex) {
      rowIndex.push(this.getParamIndex(arrReqIndex[index]));
    }
    this.reqParamInfo = deleteMany(this.reqParamInfo, rowIndex);
  }

  /**This method returns selected parameter row on the basis of selected row */
  getParamIndex(appId: any): number {
    for (let i = 0; i < this.reqParamInfo.length; i++) {
      if (this.reqParamInfo[i] == appId) {
        return i;
      }
    }
    return -1;
  }

  openEditReqParamDialog() {
    if (!this.selectedReqParam || this.selectedReqParam.length < 1) {
      this.configUtilityService.errorMessage("Select a row to edit");
      return;
    }
    if (this.selectedReqParam.length > 1) {
      this.configUtilityService.errorMessage("Select only one row to edit");
      return;
    }

    else {
      this.reqParamDetail = new RequestParamData();
      let that = this;
      this.reqParamInfo.map(function (val) {
        val.id = that.reqParamCount;
        that.reqParamCount = that.reqParamCount + 1;
      })
      if (this.selectedReqParam[0].value == "-") {
        this.selectedReqParam[0].value = "";
      }
      this.isNewParam = false;
      this.editReqParam = true;
      this.openReqKeyVal = true;
      this.reqParamDetail = Object.assign({}, this.selectedReqParam[0]);

    }
  }

  closeReqKeyValDialog() {
    this.openReqKeyVal = false;
    this.selectedReqParam = [];
  }

  /**
   * code for add Sub for BT Pattern 
   */
  openSubPatternDetailDialog(application) {
    this.subBusinessTransPatternInfo = [];
    this.businessTransPatternDetail = new BusinessTransPatternData();
    this.detailOfSubBTPatternDialog = true;
    this.reqHeaderKey = application.reqHeaderKey;
    this.selectedBtId = application.btId
    this.detailOfSubBTPatternDialog = true;
    this.configKeywordsService.getSubBtPattern(this.profileId, this.selectedBtId).subscribe(data => {
      this.subBusinessTransPatternInfo = data
    })
    this.selectedSubPatternData = [];
  }
  openAddSubPatternDialog() {
    this.isNewSubApp = true;
    this.chkInclude = false;
    this.businessTransPatternDetail = new BusinessTransPatternData();
    this.businessTransPatternDetail.reqHeaderKey = this.reqHeaderKey;
    this.businessTransPatternDetail.slowTransaction = "3000";
    this.businessTransPatternDetail.verySlowTransaction = "5000";
    this.addEditSubPatternDialog = true;
  }
  saveADDEditSubBTPatternTrans() {

    if (this.chkInclude == true)
      this.businessTransPatternDetail.include = "include";
    else
      this.businessTransPatternDetail.include = "exclude";
    if (this.businessTransPatternDetail.reqHeaderValue == "" || this.businessTransPatternDetail.reqHeaderValue == null || this.businessTransPatternDetail.reqHeaderValue == undefined)
      this.businessTransPatternDetail.headerKeyValue = this.businessTransPatternDetail.reqHeaderKey;
    else
      this.businessTransPatternDetail.headerKeyValue = this.businessTransPatternDetail.reqHeaderKey + "=" + this.businessTransPatternDetail.reqHeaderValue;

    this.businessTransPatternDetail.agent = this.agentType;

    if (this.isNewSubApp == true) {
      this.businessTransPatternDetail.agent = this.agentType;

      //If same key value pair is entered.
      for (let i = 0; i < this.subBusinessTransPatternInfo.length; i++) {
        if (this.subBusinessTransPatternInfo[i].headerKeyValue == this.businessTransPatternDetail.headerKeyValue) {
          this.configUtilityService.errorMessage("Header key/value pair already exists")
          return;
        }
      }
      //When same btname is entered
      for (let i = 0; i < this.subBusinessTransPatternInfo.length; i++) {
        if (this.subBusinessTransPatternInfo[i].btName == this.businessTransPatternDetail.btName) {
          this.businessTransPatternDetail.btId = this.subBusinessTransPatternInfo[i].btId
          break;
        }
      }
      this.configKeywordsService.addBusinessTransPattern(this.businessTransPatternDetail, this.profileId, this.selectedBtId)
        .subscribe(data => {
          //Insert data in main table after inserting application in DB
          this.subBusinessTransPatternInfo = ImmutableArray.push(this.subBusinessTransPatternInfo, data);
          this.configUtilityService.successMessage(Messages);
        });
    }
    else {
      this.businessTransPatternDetail.parentBtId = this.selectedBtId

      //If same key value pair is entered.
      for (let i = 0; i < this.subBusinessTransPatternInfo.length; i++) {
        if (this.businessTransPatternDetail == this.subBusinessTransPatternInfo[i]) {
          continue;
        }
        else {
          if (this.subBusinessTransPatternInfo[i].headerKeyValue == this.businessTransPatternDetail.headerKeyValue && this.subBusinessTransPatternInfo[i].headerKeyValue != this.selectedSubPatternData[0].headerKeyValue) {
            this.configUtilityService.errorMessage("Header key-value already exists")
            return;
          }
        }
      }

      //If same key value pair is entered.
      for (let i = 0; i < this.subBusinessTransPatternInfo.length; i++) {

          if (this.subBusinessTransPatternInfo[i].btName == this.businessTransPatternDetail.btName) {
            this.businessTransPatternDetail.btId = this.subBusinessTransPatternInfo[i].btId
            break;

          }
          else
            this.businessTransPatternDetail.btId = 0;
      }


      this.configKeywordsService.editBusinessTransPattern(this.businessTransPatternDetail, this.profileId)
        .subscribe(data => {
          let index = this.getSubPatternIndex(this.businessTransPatternDetail.id);
          if (data.reqHeaderValue != null && data.reqHeaderKey != null)
            data.headerKeyValue = data.headerKeyValue;
          else
            data.headerKeyValue = "-";

          this.selectedSubPatternData.push(data);
          this.subBusinessTransPatternInfo = ImmutableArray.replace(this.subBusinessTransPatternInfo, data, index);
          this.configUtilityService.successMessage(Messages);
          this.selectedSubPatternData = []
        });
    }
    this.selectedSubPatternData = [];
    this.addEditSubPatternDialog = false;
  }

  editSubPatternDialog() {
    if (!this.selectedSubPatternData || this.selectedSubPatternData.length < 1) {
      this.configUtilityService.errorMessage("Select a row to edit");
      return;
    }
    else if (this.selectedSubPatternData.length > 1) {
      this.configUtilityService.errorMessage("Select only one row to edit");
      return;
    }
    if (this.selectedSubPatternData[0]["include"] == "include")
      this.chkInclude = true;
    else
      this.chkInclude = false;

    this.businessTransPatternDetail = Object.assign({}, this.selectedSubPatternData[0]);
    this.addEditSubPatternDialog = true;
    this.isNewSubApp = false;

  }

  deleteSubPattern() {
    if (!this.selectedSubPatternData || this.selectedSubPatternData.length < 1) {
      this.configUtilityService.errorMessage("Select rows to be deleted");
      return;
    }
    this.confirmationService.confirm({
      message: 'Do you want to delete the selected row?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        //Get Selected Applications's AppId
        let selectedApp = this.selectedSubPatternData;
        let arrAppIndex = [];
        for (let index in selectedApp) {

          arrAppIndex.push(selectedApp[index].id);
        }
        this.configKeywordsService.deleteBusinessTransPattern(arrAppIndex, this.profileId)
          .subscribe(data => {
            this.deleteSubPatternBusinessTransactions(arrAppIndex);
            this.selectedSubPatternData = [];
            this.configUtilityService.infoMessage("Deleted Successfully");
          })
      },
      reject: () => {
      }
    });
  }
  /**This method returns selected application row on the basis of selected row */
  getSubPatternIndex(appId: any): number {
    for (let i = 0; i < this.subBusinessTransPatternInfo.length; i++) {
      if (this.subBusinessTransPatternInfo[i].id == appId) {
        return i;
      }
    }
    return -1;
  }
  /**This method is used to delete Pattern from Data Table */
  deleteSubPatternBusinessTransactions(arrIndex) {
    let rowIndex: number[] = [];

    for (let index in arrIndex) {
      rowIndex.push(this.getSubPatternIndex(arrIndex[index]));
    }
    this.subBusinessTransPatternInfo = deleteMany(this.subBusinessTransPatternInfo, rowIndex);
  }
  closeAddEditSubBTDialog() {
    this.addEditSubPatternDialog = false;
  }
  closeSubPatternListDialog() {
    this.detailOfSubBTPatternDialog = false;
  }

}

