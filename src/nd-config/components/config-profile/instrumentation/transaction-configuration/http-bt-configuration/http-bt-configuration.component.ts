import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SelectItem, ConfirmationService } from 'primeng/primeng';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';

import { ConfigKeywordsService } from '../../../../../services/config-keywords.service';
import { BusinessTransGlobalInfo } from '../../../../../interfaces/business-Trans-global-info';
import { BusinessTransPatternData, BusinessTransGlobalData, RequestParamData } from '../../../../../containers/instrumentation-data';

import { ConfigUtilityService } from '../../../../../services/config-utility.service';
import { ConfigUiUtility } from '../../../../../utils/config-utility';
import { ImmutableArray } from '../../../../../utils/immutable-array';
import { deleteMany } from '../../../../../utils/config-utility';

import { ActivatedRoute, Params } from '@angular/router';
import { KeywordData, KeywordList } from '../../../../../containers/keyword-data';
import { Messages , addMessage , editMessage } from '../../../../../constants/config-constant';
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

  reqHeaderKey: string;

  selectedBtId: number;

  asyncTrans: boolean = false;

  //Dialog for global threshold values
  globalThresholdDialog: boolean = false;

  //global slow threshold value
  slowThresholdGlobalValue: any ;
  //global very slow threshold value
  vslowThresholdGlobalValue: any ;

  //To apply global/default threshold values
  globalCheck: boolean = true;

  // To store global file data
  globalFileData: string = "";

  //To display the label of save/apply button in global threshold value dailog
  globalSaveLabel: string = "Save";


  constructor(private route: ActivatedRoute,
    private configKeywordsService: ConfigKeywordsService,
    private store: Store<KeywordList>,
    private configUtilityService: ConfigUtilityService,
    private confirmationService: ConfirmationService,
    private configHomeService: ConfigHomeService
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

    this.globalBtDetail.requestHeader = '';

    this.globalBtDetail.requestParam = '';

    this.globalBtDetail.dynamicReqType = false;

    this.globalBtDetail.segmentNo = '';

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

    //Read global threshold values from .globalThreshold.txt file or create file if not exists
    this.readGlobalThresholdFile();
  }


  /**
   * This method is used to get the keyword data
   */
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


  /**
   * This method is used to set the keyword values
   * @param value 
   */
  setSelectedValueOfBT(value) {
    this.profileId = value.profileId
    if (value.message == true) {
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


  /**
   * This method is used to load the BTPattern data
   */
  loadBTPatternData(): void {
    this.configKeywordsService.getBusinessTransPatternData(this.profileId).subscribe(data => {
      this.selectedPatternData = [];
      // The below method is called to set all values that contains "-" to null
      this.methodToSetValuesForGUI(data);
      this.businessTransPatternInfo = data;
    });
  }


  /**
   * This method is used to assign BTGlobal data to BTGlobal screen
   * @param data 
   */
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


  /**
   * This method is used to reset all BT Global values
   */
  resetBusinessTransaction() {
    this.configKeywordsService.getBusinessTransGlobalData(this.profileId).subscribe(data => { this.doAssignBusinessTransData(data) });
  }


  /**
   * This method is used to reset All BT Global values to default
   */
  resetKeywordsDataToDefault() {
    let profileid: number;
    if (this.agentType == "Java")
      profileid = 1;
    else if (this.agentType == "Dot Net") {
      profileid = 888888;
    }
    else
      profileid = 777777;
    this.configKeywordsService.getBusinessTransGlobalData(profileid).subscribe(data => { this.doAssignBusinessTransData(data) });
  }


  /**
   * This method is used to save BT Global data
   */
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


  /**
   * This method is used to save the newly added BT Pattern
   */
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

    if (this.asyncTrans == true)
      this.businessTransPatternDetail.asyncTrans = 1;
    else
      this.businessTransPatternDetail.asyncTrans = 0;

    if (this.businessTransPatternDetail.reqHeaderValue != undefined && this.businessTransPatternDetail.reqHeaderValue != "")
      this.businessTransPatternDetail.headerKeyValue = this.businessTransPatternDetail.reqHeaderKey + "=" + this.businessTransPatternDetail.reqHeaderValue;
    else
      this.businessTransPatternDetail.headerKeyValue = this.businessTransPatternDetail.reqHeaderKey;

    if (this.businessTransPatternDetail.reqParamValue != undefined && this.businessTransPatternDetail.reqParamValue != "")
      this.businessTransPatternDetail.reqParamKeyVal = this.businessTransPatternDetail.reqParamKey + "=" + this.businessTransPatternDetail.reqParamValue;
    else
      this.businessTransPatternDetail.reqParamKeyVal = this.businessTransPatternDetail.reqParamKey

    this.setDynamicValuesOFF();    //Method to set values when Dynamic part of request is disabled 
    // Condition to check if VALUE is filled and KEY is blank
    if ((this.businessTransPatternDetail.reqParamValue != null && this.businessTransPatternDetail.reqParamValue != "") && this.businessTransPatternDetail.reqParamKey == "") {
      this.configUtilityService.errorMessage("Please provide parameter key of the dynamic part of request");
      return;
    }
    if ((this.businessTransPatternDetail.reqHeaderValue != null && this.businessTransPatternDetail.reqHeaderValue != "") && this.businessTransPatternDetail.reqHeaderKey == "") {
      this.configUtilityService.errorMessage("Please provide header key of the dynamic part of request");
      return;
    }

    this.setDynamicValuesON();  //This method is used to set the values of dynamic part components
    this.businessTransPatternDetail.agent = this.agentType;

    if (this.businessTransPatternInfo.length > 0) {
      for (let i = 0; i < this.businessTransPatternInfo.length; i++) {
        if (this.businessTransPatternDetail.btName == this.businessTransPatternInfo[i].btName) {
          this.businessTransPatternDetail.btId = this.businessTransPatternInfo[i].btId
        }
        if (this.businessTransPatternDetail.urlName == this.businessTransPatternInfo[i].urlName
          && this.businessTransPatternDetail.btName == this.businessTransPatternInfo[i].btName) {
          this.configUtilityService.errorMessage("BT name and URL already exists");
          return;
        }

        if (this.businessTransPatternDetail.urlName == this.businessTransPatternInfo[i].urlName
          && this.businessTransPatternDetail.matchType == this.businessTransPatternInfo[i].matchType
          && this.businessTransPatternDetail.reqMethod == this.businessTransPatternInfo[i].reqMethod
          && this.businessTransPatternDetail.headerKeyValue == this.businessTransPatternInfo[i].headerKeyValue
          && this.businessTransPatternDetail.reqParamKeyVal == this.businessTransPatternInfo[i].reqParamKeyVal) {
          this.configUtilityService.errorMessage("Rule details already exists")
          return;
        }
      }

      for (let i = 0; i < this.businessTransPatternInfo.length; i++) {
        if (this.businessTransPatternDetail.urlName == this.businessTransPatternInfo[i].urlName
          && this.businessTransPatternDetail.matchType == this.businessTransPatternInfo[i].matchType
          && this.businessTransPatternDetail.reqMethod == this.businessTransPatternInfo[i].reqMethod
          && this.businessTransPatternDetail.reqHeaderKey == this.businessTransPatternInfo[i].reqHeaderKey
          && this.businessTransPatternDetail.reqParamKeyVal == this.businessTransPatternInfo[i].reqParamKeyVal) {
          if (this.businessTransPatternInfo[i].parentBtId == -1) {
            this.parentBtId = +this.businessTransPatternInfo[i].btId;
            break;
          }
          else {
            this.parentBtId = +this.businessTransPatternInfo[i].parentBtId;
            break;
          }
        }
        else {
          this.parentBtId = -1;
        }
      }
    }
    else {
      this.parentBtId = -1;
    }
    if (this.businessTransPatternDetail.reqParamKey == null) {
      this.businessTransPatternDetail.reqParamKey = "-"
    }
    if (this.businessTransPatternDetail.reqHeaderKey == null) {
      this.businessTransPatternDetail.reqHeaderKey = "-"
    }
    if (this.businessTransPatternDetail.headerKeyValue == null) {
      this.businessTransPatternDetail.headerKeyValue = "-"
    }
    this.configKeywordsService.addBusinessTransPattern(this.businessTransPatternDetail, this.profileId, this.parentBtId)
      .subscribe(data => {

        // The below method is called to set all values that contains "-" to null
        this.methodToSetValuesForGUI(data);
        //Insert data in main table after inserting application in DB
        this.businessTransPatternInfo = data
        this.configUtilityService.successMessage(addMessage);
      });
    this.closeDialog();
  }


  /**
   * This method is used to open the Add BT Pattern dialog
   */
  openAddPatternDialog() {
    this.businessTransPatternDetail = new BusinessTransPatternData();
    this.reqParamInfo = [];
    this.readGlobalThresholdFile();
    this.businessTransPatternDetail.slowTransaction = "3000";
    this.businessTransPatternDetail.verySlowTransaction = "5000";
    this.businessTransPatternDetail.slowDynamicThreshold = "10";
    this.businessTransPatternDetail.verySlowDynamicThreshold = "20";
    this.chkInclude = false;
    this.isNewApp = true;
    this.addEditPatternDialog = true;
    this.reqParamKeyCheck = false;
    this.asyncTrans = false;
    this.globalCheck = false;
  }


  /**
   * This method is used to open Edit BT Pattern dialog
   */
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

    if (this.selectedPatternData[0].asyncTrans == 1)
      this.asyncTrans = true;
    else
      this.asyncTrans = false;

    if (this.businessTransPatternDetail.dynamicPartReq == true && (this.reqParamKeyCheck == false) && (this.businessTransPatternDetail.reqHeaderKey == undefined || this.businessTransPatternDetail.reqHeaderKey == "" || this.businessTransPatternDetail.reqHeaderKey == "-") && (this.businessTransPatternDetail.reqMethod == undefined || this.businessTransPatternDetail.reqMethod == "-")) {
      this.businessTransPatternDetail.dynamicPartReq = false;
      this.businessTransPatternDetail.reqHeaderKey == "";
    }

    if (this.selectedPatternData[0].reqParamKey == "null") {
      this.selectedPatternData[0].reqParamKey = ""
    }

    if (this.reqParamInfo.length == 0) {
      this.reqParamKeyCheck = false;
    }
    this.readGlobalThresholdFile();
    this.isNewApp = false;
    this.addEditPatternDialog = true;
    this.globalCheck = false;

    this.businessTransPatternDetail = Object.assign({}, this.selectedPatternData[0]);
  }


  /**
   * This method is used to set values to gui after loading the BTPattern data
   * @param data 
   * Author: Himanshu
   */
  methodToSetValuesForGUI(data) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].dynamicPartReq == false) {
        data[i].reqHeaderValue = null;
        data[i].reqParamValue = null;
        data[i].reqHeaderKey = null;
        data[i].reqParamKey = null;
      }
      else {
        if (data[i].reqHeaderValue == "-" && data[i].reqHeaderKey != "-") {
          data[i].reqHeaderValue = null;
        }
        if (data[i].reqHeaderValue == "-" && data[i].reqHeaderKey == "-") {
          data[i].reqHeaderValue = null;
          data[i].reqHeaderKey = null;
        }
        if (data[i].reqHeaderValue != "-" && data[i].reqHeaderKey == "-") {
          data[i].reqHeaderValue = null;
          data[i].reqHeaderKey = null;
        }
        if (data[i].reqParamValue == "-" && data[i].reqParamKey != "-") {
          data[i].reqParamValue = null;
        }
        if (data[i].reqParamValue != "-" && data[i].reqParamKey == "-") {
          data[i].reqParamValue = null;
          data[i].reqParamKey = null;
        }
        if (data[i].reqParamValue == "-" && data[i].reqParamKey == "-") {
          data[i].reqParamValue = null;
          data[i].reqParamKey = null;
        }
        if ((data[i].reqParamValue == "-" && data[i].reqParamKey == "-") && (data[i].reqHeaderValue == "-" && data[i].reqHeaderKey == "-")) {
          data[i].reqParamValue = null;
          data[i].reqParamKey = null;
          data[i].reqHeaderValue = null;
          data[i].reqHeaderKey = null;
        }
      }
    }
  }


  /**
   * This method is used to edit BT Pattern details
   */
  editPattern(): void {
    if (this.chkInclude == true)
      this.businessTransPatternDetail.include = "exclude";
    else
      this.businessTransPatternDetail.include = "include";

    if (this.asyncTrans == true)
      this.businessTransPatternDetail.asyncTrans = 1;
    else
      this.businessTransPatternDetail.asyncTrans = 0;

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

    if (this.businessTransPatternDetail.reqHeaderValue != undefined && this.businessTransPatternDetail.reqHeaderValue != null && this.businessTransPatternDetail.reqHeaderValue != "")
      this.businessTransPatternDetail.headerKeyValue = this.businessTransPatternDetail.reqHeaderKey + "=" + this.businessTransPatternDetail.reqHeaderValue;
    else
      this.businessTransPatternDetail.headerKeyValue = this.businessTransPatternDetail.reqHeaderKey;

    if (this.businessTransPatternDetail.reqParamValue != undefined && this.businessTransPatternDetail.reqParamValue != null && this.businessTransPatternDetail.reqParamValue != "")
      this.businessTransPatternDetail.reqParamKeyVal = this.businessTransPatternDetail.reqParamKey + "=" + this.businessTransPatternDetail.reqParamValue;
    else
      this.businessTransPatternDetail.reqParamKeyVal = this.businessTransPatternDetail.reqParamKey

    this.setDynamicValuesOFF();  //Method to set values when Dynamic part of request is disabled 

    // Condition to check if VALUE is filled and KEY is blank
    if ((this.businessTransPatternDetail.reqParamValue != null && this.businessTransPatternDetail.reqParamValue != "") && this.businessTransPatternDetail.reqParamKey == "") {
      this.configUtilityService.errorMessage("Please provide parameter key of the dynamic part of request");
      return;
    }
    if ((this.businessTransPatternDetail.reqHeaderValue != null && this.businessTransPatternDetail.reqHeaderValue != "") && this.businessTransPatternDetail.reqHeaderKey == "") {
      this.configUtilityService.errorMessage("Please provide header key of the dynamic part of request");
      return;
    }

    this.setDynamicValuesON();  //This method is used to set the values of dynamic part components
    this.businessTransPatternDetail.agent = this.agentType;
    // this.parentBtId = -1;
    for (let i = 0; i < this.businessTransPatternInfo.length; i++) {
      if (this.selectedPatternData[0] != this.businessTransPatternInfo[i]) {
        if (this.businessTransPatternDetail.urlName == this.businessTransPatternInfo[i].urlName
          && this.businessTransPatternDetail.btName == this.businessTransPatternInfo[i].btName) {
          this.configUtilityService.errorMessage("BT name and URL already exists");
          return;
        }

        if (this.businessTransPatternDetail.urlName == this.businessTransPatternInfo[i].urlName
          && this.businessTransPatternDetail.matchType == this.businessTransPatternInfo[i].matchType
          && this.businessTransPatternDetail.reqMethod == this.businessTransPatternInfo[i].reqMethod
          && this.businessTransPatternDetail.reqHeaderKey == this.businessTransPatternInfo[i].reqHeaderKey
          && this.businessTransPatternDetail.reqParamKeyVal == this.businessTransPatternInfo[i].reqParamKeyVal) {
          if (this.businessTransPatternDetail.parentBtId != -1) {
            if (this.businessTransPatternInfo[i].parentBtId == -1) {
              this.businessTransPatternDetail.parentBtId = +this.businessTransPatternInfo[i].btId;
              break;
            }
            else {
              this.businessTransPatternDetail.parentBtId = +this.businessTransPatternInfo[i].parentBtId;
            }
          }
          else {
            if (this.businessTransPatternInfo[i].parentBtId == -1) {
              this.businessTransPatternDetail.parentBtId = +this.businessTransPatternInfo[i].btId;
              break;
            }
            else {
              this.businessTransPatternDetail.parentBtId = +this.businessTransPatternInfo[i].parentBtId;
            }
          }
        }
        else {
          this.businessTransPatternDetail.parentBtId = -1;
        }
      }
      else
        continue;
    }

    for (let i = 0; i < this.businessTransPatternInfo.length; i++) {
      if (this.selectedPatternData[0] != this.businessTransPatternInfo[i]) {
        if (this.businessTransPatternDetail.urlName == this.businessTransPatternInfo[i].urlName
          && this.businessTransPatternDetail.matchType == this.businessTransPatternInfo[i].matchType
          && this.businessTransPatternDetail.reqMethod == this.businessTransPatternInfo[i].reqMethod
          && this.businessTransPatternDetail.headerKeyValue == this.businessTransPatternInfo[i].headerKeyValue
          && this.businessTransPatternDetail.reqParamKeyVal == this.businessTransPatternInfo[i].reqParamKeyVal) {
          this.configUtilityService.errorMessage("Rule details already exists")
          return
        }
      }
      else
        continue;
    }


    //Same btId for same BTName 
    for (let i = 0; i < this.businessTransPatternInfo.length; i++) {
      if (this.selectedPatternData[0] != this.businessTransPatternInfo[i]) {
        if (this.businessTransPatternDetail.btName == this.businessTransPatternInfo[i].btName) {
          this.businessTransPatternDetail.btId = this.businessTransPatternInfo[i].btId
          break;
        }
        else {
          this.businessTransPatternDetail.btId = 0;
        }
      }
    }

    this.businessTransPatternDetail.reqParamKeyVal = this.businessTransPatternDetail.reqParamKeyVal
    if (this.businessTransPatternDetail.reqParamKey == null) {
      this.businessTransPatternDetail.reqParamKey = "-"
    }
    if (this.businessTransPatternDetail.reqHeaderKey == null) {
      this.businessTransPatternDetail.reqHeaderKey = "-"
    }
    if (this.businessTransPatternDetail.headerKeyValue == null) {
      this.businessTransPatternDetail.headerKeyValue = "-"
    }
    this.configKeywordsService.editBusinessTransPattern(this.businessTransPatternDetail, this.profileId)
      .subscribe(data => {
        let index = this.getPatternIndex(this.businessTransPatternDetail.id);
        this.selectedPatternData.length = 0;
        if (data.dynamicPartReq == false) {
          data.reqHeaderValue = null;
          data.reqParamValue = null;
          data.reqHeaderValue = null;
          data.reqHeaderKey = null;
          data.reqParamKey = null;
        }
        else {
          if (data.reqHeaderValue == "-" && data.reqHeaderKey != "-") {
            data.reqHeaderValue = null;
          }
          if (data.reqHeaderValue == "-" && data.reqHeaderKey == "-") {
            data.reqHeaderValue = null
            data.reqHeaderKey = null;
          }
          if (data.reqHeaderValue != "-" && data.reqHeaderKey == "-") {
            data.reqHeaderKey = null;
            data.reqHeaderValue = null;
          }
          if (data.reqParamValue == "-" && data.reqParamKey != "-") {
            data.reqParamValue = null;
          }

          if (data.reqParamValue != "-" && data.reqParamKey == "-") {
            data.reqParamValue = null;
            data.reqParamKey = null;
          }
          if (data.reqParamValue == "-" && data.reqParamKey == "-") {
            data.reqParamValue = null;
            data.reqParamKey = null;
          }
          if ((data.reqParamValue == "-" && data.reqParamKey == "-") && (data.reqHeaderValue == "-" && data.reqHeaderKey == "-")) {
            data.reqParamValue = null;
            data.reqParamKey = null;
            data.reqHeaderValue = null;
            data.reqHeaderKey = null;
          }
        }

        this.selectedPatternData.push(data);
        this.businessTransPatternInfo = ImmutableArray.replace(this.businessTransPatternInfo, data, index);
        this.loadBTPatternData()
        this.configUtilityService.successMessage(editMessage);
      });
    this.closeDialog();

  }


  /**
   * This method is used to set values when Dynamic part of request is disabled  
   */
  setDynamicValuesOFF(): void {
    if (this.businessTransPatternDetail.dynamicPartReq == false) {
      this.businessTransPatternDetail.reqParamKey = null;
      this.businessTransPatternDetail.reqParamValue = null;
      this.businessTransPatternDetail.reqHeaderKey = null;
      this.businessTransPatternDetail.reqHeaderValue = null;
      this.businessTransPatternDetail.reqMethod = "-";
      this.businessTransPatternDetail.reqParamKeyVal = "-";
      this.businessTransPatternDetail.headerKeyValue = "-";
    }
  }


  /**
   * This method is used to set values when Dynamic part of request is enabled
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
      this.businessTransPatternDetail.reqParamKeyVal = "-";
    }
    if (this.businessTransPatternDetail.reqMethod == null)
      this.businessTransPatternDetail.reqMethod = "-";

  }


  /**
   * This is a common method to save BT Pattern details
   * for both Add and Edit BT Pattern data
   */
  saveADDEditBTPatternTrans(): void {
    //When new BT Pattern entry is added
    if (this.isNewApp) {
      //Check for BT Pattern details already exist or not
      if (!this.checkBTPatternDetailsAlreadyExist()) {
        this.savePattern();
        return;
      }
    }
    //When already existing entry is edited
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
        if (this.checkBTPatternDetailsAlreadyExist())
          return;
        else
          this.editPattern();
      }
    }
  }


  /**
   * This method is used to validate if BT Pattern details exists or not
   */
  checkBTPatternDetailsAlreadyExist(): boolean {
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


  /**
   * This method is used to delete the existing BT Pattern entries
   */
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
            this.businessTransPatternInfo = data;
            this.deletePatternBusinessTransactions(arrAppIndex);
            this.selectedPatternData = [];
            this.configUtilityService.infoMessage("Deleted Successfully");
          })
      },
      reject: () => {
      }
    });
  }


  /**
   * This method returns the index of selected row from BT Pattern table
   */
  getPatternIndex(appId: any): number {
    for (let i = 0; i < this.businessTransPatternInfo.length; i++) {
      if (this.businessTransPatternInfo[i].id == appId) {
        return i;
      }
    }
    return -1;
  }


  /**
   * This method is used to delete Pattern from Data Table
   */
  deletePatternBusinessTransactions(arrIndex) {
    let rowIndex: number[] = [];

    for (let index in arrIndex) {
      rowIndex.push(this.getPatternIndex(arrIndex[index]));
    }
    this.businessTransPatternInfo = deleteMany(this.businessTransPatternInfo, rowIndex);
  }


  /**
   * This method is used to close Add and Edit BT Pattern dialog
   */
  closeDialog(): void {
    this.selectedPatternData = [];
    this.addEditPatternDialog = false;
  }


  /**
   * This method is used for validating slow and very slow transactions
   * @param slow 
   * @param vslow 
   */
  checkSlow(slow, vslow) {
    if (this.globalBtDetail.slowTransaction >= this.globalBtDetail.verySlowTransaction) {
      slow.setCustomValidity('Slow value should be less than very slow value.');
    }
    else {
      slow.setCustomValidity('');
    }
    vslow.setCustomValidity('');
  }


  /**
   * This method is used for validating slow and very slow transactions
   * @param slow 
   * @param vslow 
   */
  checkVSlow(slow, vslow) {
    if (this.globalBtDetail.slowTransaction >= this.globalBtDetail.verySlowTransaction) {
      vslow.setCustomValidity('Very slow value should be greater than slow value.');
    }
    else {
      vslow.setCustomValidity('');
    }
    slow.setCustomValidity('');
  }


  /**
   * This method is called on clicking the browse button 
   * for opening the file manager
   */
  openFileManager() {
    this.openFileExplorerDialog = true;
    this.isBTPatternBrowse = true;
  }


  /**
   * This method is called form ProductUI config-nd-file-explorer component with the path
   * ..\ProductUI\gui\src\app\modules\file-explorer\components\config-nd-file-explorer\
   * @param filepath
   * filepath is the relative filepath for the selected file in the file manager
   */
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
          if (data[i].reqParamKeyVal == null || data[i].reqParamKeyVal == "NA") {
            data[i].reqParamKeyVal = "-";
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
        //this.businessTransPatternInfo = data;
        this.loadBTPatternData();
        this.configUtilityService.successMessage("File uploaded successfully");
      });
    }
  }


  /**
   * This method is used to download the report file in the form 
   * of Excel, word, Pdf File
   * @param reports 
   */
  downloadReports(reports: string) {
    let arrHeader = { "0": "BT Name", "1": "Match Type", "2": "URL", "3": "BT Included", "4": "Slow Transaction Threshold(ms)", "5": "Very Slow Transaction Threshold(ms)", "6": "Slow Dynamic Threshold(%)", "7": "Very Slow Dynamic Threshold(%)", "8": "Query HTTP Parameters Key", "9": "HTTP Method Type", "10": "HTTP Request Headers Key" };
    let arrcolSize = { "0": 2, "1": 1, "2": 2, "3": 1, "4": 1, "5": 1, "6": 1, "7": 1, "8": 2, "9": 1, "10": 2 };
    let arrAlignmentOfColumn = { "0": "left", "1": "left", "2": "left", "3": "left", "4": "right", "5": "right", "6": "right", "7": "right", "8": "left", "9": "left", "10": "left" };
    let arrFieldName = { "0": "btName", "1": "matchType", "2": "urlName", "3": "include", "4": "slowTransaction", "5": "verySlowTransaction", "6": "slowDynamicThreshold", "7": "verySlowDynamicThreshold", "8": "paramKeyValue", "9": "reqMethod", "10": "headerKeyValue" };
    let object =
      {
        data: this.businessTransPatternInfo,
        headerList: arrHeader,
        colSize: arrcolSize,
        alignArr: arrAlignmentOfColumn,
        fieldName: arrFieldName,
        downloadType: reports,
        title: "BT Pattern",
        fileName: "btpattern",
      }
    this.configKeywordsService.downloadReports(JSON.stringify(object)).subscribe(data => {
      this.openDownloadReports(data._body)
    })
  }


  /**
   * This method is used to open the report file
   * @param res 
   */
  openDownloadReports(res) {
    window.open("/common/" + res);
  }

  /** Open global threshold values dialog to apply values to all BTs or to change global threshold values */
  openGlobalThresholdDialog(){

    //Put label = Save if no BT is selected otherwise put Save and Apply
    if(this.selectedPatternData.length == 0){
      this.globalSaveLabel = "Save";
    }
    else{
      this.globalSaveLabel = "Save and Apply";
    }
    this.globalThresholdDialog = true;
    //Updating global threshold values when dialog opens
    this.readGlobalThresholdFile()
  }

  //Read global threshold values from .globalThreshold.txt file or create file if not exists
  readGlobalThresholdFile(){

    this.configKeywordsService.readGlobalThresholdFile(this.profileId).subscribe(data => {
      this.globalFileData = data._body.split("|")
      this.slowThresholdGlobalValue = this.globalFileData[0];
      this.vslowThresholdGlobalValue = this.globalFileData[1];
      
    })

  }

  /** To save global threshold values in hidden file and apply these values to selected BT */
  applyGlobalThresholdValues(){
    let fileData = this.slowThresholdGlobalValue + "|" + this.vslowThresholdGlobalValue
    this.configKeywordsService.saveGlobalThresholdFile(this.profileId, fileData).subscribe(data => {

      // If any BT is selected then update its value with global threshold values
      if(this.selectedPatternData.length > 0){
        this.confirmationService.confirm({
          message: 'Do you want to update the selected Business Transaction Global Threshold values?',
          header: 'Update Confirmation',
          icon: 'fa fa-trash',
          accept: () => {
            this.updateBTWithGlobalThreshold(fileData);
          },
          reject: () => {

          }
          })
      }
      else{
        this.globalThresholdDialog = false;
        this.configUtilityService.successMessage(Messages);
      }

    })

  }

  /** UPDATE selected BT with global threshold values  */
  updateBTWithGlobalThreshold(fileData){
    let btIdArr = [];
    //Get the selected BTs bt_pattern_id and store in an array
    for(let bt of this.selectedPatternData){
      btIdArr.push(bt.id);
    }
    this.configKeywordsService.updateBTWithGlobalThreshold(btIdArr, this.profileId).subscribe(data => {
      this.loadBTPatternData();
    })
    this.configUtilityService.successMessage("Transaction Threshold global values updated successfully")
    this.globalThresholdDialog = false;

  }

  /**Change the threshold values on toggle change- If ON then apply global values */
  changeThresholdOnClick(){
    if(!this.globalCheck){
      this.businessTransPatternDetail.slowTransaction = this.slowThresholdGlobalValue
      this.businessTransPatternDetail.verySlowTransaction = this.vslowThresholdGlobalValue
    }
    else{
      //ADD Pattern case
      if(this.isNewApp){
        this.businessTransPatternDetail.slowTransaction = "3000";
        this.businessTransPatternDetail.verySlowTransaction = "5000";
      }
      //Edit pattern case
      else{
        this.businessTransPatternDetail.slowTransaction = this.selectedPatternData[0].slowTransaction;
        this.businessTransPatternDetail.verySlowTransaction = this.selectedPatternData[0].verySlowTransaction;
      }
    }
  }

    /**
   * This method is used for validating slow and very slow transactions
   * @param slow 
   * @param vslow 
   */
  checkGlobalThresholdValidity(slow, vslow) {
    if (this.slowThresholdGlobalValue >= this.vslowThresholdGlobalValue) {
      vslow.setCustomValidity('Very slow value should be greater than slow value.');
    }
    else {
      vslow.setCustomValidity('');
    }
    slow.setCustomValidity('');
  }

  /* change Browse boolean value on change component */
  ngOnDestroy() {
    this.isBTPatternBrowse = false;
  }

}
