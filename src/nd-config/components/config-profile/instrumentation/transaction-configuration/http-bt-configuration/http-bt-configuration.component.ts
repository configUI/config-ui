import { Component, OnInit, Output, EventEmitter, PipeTransform, Pipe } from '@angular/core';
import { SelectItem, ConfirmationService } from 'primeng/primeng';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';

import { ConfigKeywordsService } from '../../../../../services/config-keywords.service';
import { BusinessTransGlobalInfo } from '../../../../../interfaces/business-Trans-global-info';
import { BusinessTransPatternData, BusinessTransGlobalData, RequestParamData, RulesData, BusinessTransMethodData, BTHTTPHeaderData, BTHTTPHeaderConditions, BTResponseHeaderData, BTResponseHeaderConditions, BTHTTPBodyConditions, BTHTTPBody } from '../../../../../containers/instrumentation-data';

import { ConfigUtilityService } from '../../../../../services/config-utility.service';
import { ConfigUiUtility } from '../../../../../utils/config-utility';
import { ImmutableArray } from '../../../../../utils/immutable-array';
import { deleteMany } from '../../../../../utils/config-utility';

import { ActivatedRoute, Params } from '@angular/router';
import { KeywordData, KeywordList } from '../../../../../containers/keyword-data';
import { Messages, addMessage, editMessage } from '../../../../../constants/config-constant';
import { ConfigHomeService } from '../../../../../services/config-home.service';
import { ArgumentTypeData, MethodBasedCustomData } from '../../../../../containers/method-based-custom-data';

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
  slowThresholdGlobalValue: any;
  //global very slow threshold value
  vslowThresholdGlobalValue: any;

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



    let arrLabel1 = ['Numeric', 'String', 'Boolean', 'Char or byte'];
    let arrValue1 = ['0', '1', '2', '3'];

    this.returnTypeList = [];
    this.returnTypeList = ConfigUiUtility.createListWithKeyValue(arrLabel1, arrValue1);

    this.methodRulesInfo = [];
    this.methodArgRulesInfo = [];
    this.methodInvocationRulesInfo = [];

    this.configHomeService.getBTMethodDataFromAD$.subscribe(val => {
      this.flag = val;
    });
    this.configHomeService.selectedFromAD$.subscribe(val => {
      if (val.includes('#')) {
        this.profileId = val.split("#")[0];
        this.fqm = val.split("#")[1];

      }
      this.configKeywordsService.getBusinessTransMethodData(this.profileId).subscribe(data => {
        let that = this;
        data.map(function (val) {
          that.modifyData(val);
        })
        this.businessTransMethodInfo = data;
        this.openMethodDialog();
      });
    });
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

    this.isProfilePerm = +sessionStorage.getItem("ProfileAccess") == 4 ? true : false;
    // if (this.flag)
    // this.loadBTMethodData();
    //New Method
    // this.loadBTs();/

    this.getKeywordData();
    this.loadBTPatternData();
    this.configKeywordsService.fileListProvider.subscribe(data => {
      this.uploadFile(data);
    });

    //Read global threshold values from .globalThreshold.txt file or create file if not exists
    this.readGlobalThresholdFile();
    this.isProfilePerm = +sessionStorage.getItem("ProfileAccess") == 4 ? true : false;
    this.route.params.subscribe((params: Params) => {
      this.profileId = params['profileId'];
      if (this.profileId == 1 || this.profileId == 777777 || this.profileId == 888888)
        this.saveDisable = true;
    });
    this.configKeywordsService.fileListProvider.subscribe(data => {
      this.uploadFile(data);
    });
    //Request to get all BT HTTP headers data
    // this.configKeywordsService.getBTHttpHdrData(this.profileId).subscribe(data => {
    //     this.btHttpHeadersInfo = data;
    //     this.modifyData(data);
    // });

    this.btHttpHeadersDetail = new BTHTTPHeaderData();
    this.headerConditionDetail = new BTHTTPHeaderConditions();

    // this.isProfilePerm=+sessionStorage.getItem("ProfileAccess") == 4 ? true : false;
    // this.route.params.subscribe((params: Params) => {
    //     this.profileId = params['profileId'];
    //     if(this.profileId == 1 || this.profileId == 777777 || this.profileId == 888888)
    //         this.saveDisable =  true;
    // });

    //Response to get all BT Response headers data
    // this.configKeywordsService.getBTResponseHdrData(this.profileId).subscribe(data => {
    //     this.btResponseHeadersInfo = data;
    //     this.modifyData(data);
    // });

    this.btResponseHeadersDetail = new BTResponseHeaderData();
    this.resHeaderConditionDetail = new BTResponseHeaderConditions();

    this.btNameList = [];
    var name = ['XML'];
    var val = ['XML'];

    this.btNameList = ConfigUiUtility.createListWithKeyValue(name, val);

    //Request to get all BT HTTP body data
    this.configKeywordsService.getBtHttpBodyData(this.profileId).subscribe(data => {
      this.httpBodyInfo = data;
      this.modifyBodyData(data);
    });
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

        //get the currently added btpattern from the response
        let currentId = 0;
        let currentRuleId = 0;
        for (let row of this.businessTransPatternInfo) {
          if (row.btName == this.businessTransPatternDetail.btName && row.urlName == this.businessTransPatternDetail.urlName) {
            currentId = row.id;
            currentRuleId = row.btRuleId;
            break;
          }
        }

        //UPDATE BT METHOD PARENT_RULE_ID AND BT_PATTERN_ID AFTER RECIEVING RESPONSE FOR ADDED BTPATTERN
        this.configKeywordsService.updateParentId(currentId, currentRuleId, this.businessTransMethodInfo).subscribe(data => {

        })

        //UPDATE BT HTTP REQUES HDR PARENT_RULE_ID AND BT_PATTERN_ID AFTER RECIEVING RESPONSE FOR ADDED BTPATTERN
        this.configKeywordsService.updateReqParentId(currentId, currentRuleId, this.btHttpHeadersInfo).subscribe(data => {

        })

        //UPDATE BT HTTP RESPONSE HDR PARENT_RULE_ID AND BT_PATTERN_ID AFTER RECIEVING RESPONSE FOR ADDED BTPATTERN
        this.configKeywordsService.updateResParentId(currentId, currentRuleId, this.btResponseHeadersInfo).subscribe(data => {

        })

        //UPDATE BT HTTP BODY PARENT_RULE_ID AND BT_PATTERN_ID AFTER RECIEVING RESPONSE FOR ADDED BTPATTERN
        this.configKeywordsService.updateBodyParentId(currentId, currentRuleId, this.httpBodyInfo).subscribe(data => {

        })

        this.configUtilityService.successMessage(addMessage);
      });
    this.closeDialog();
  }


  //To invoke other 
  //  invokeChildBTs(btPatternId, parentRuleId, operation) {
  //   this.configKeywordsService.getInvokeChildBTs(btPatternId, parentRuleId, operation);
  // }


  /**
   * This method is used to open the Add BT Pattern dialog
   */
  openAddPatternDialog() {
    this.businessTransPatternDetail = new BusinessTransPatternData();
    this.businessTransMethodInfo = []
    this.btHttpHeadersInfo = []
    this.btResponseHeadersInfo = [];
    this.httpBodyInfo = [];
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
    // this.invokeChildBTs(-1, -1, 'AddPattern')
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

    // get the list of associated btMethod (if any)
    this.configKeywordsService.getAssocBTMethod(this.businessTransPatternDetail.id).subscribe(data => {
      this.businessTransMethodInfo = data;
    })

    //get list of assocuated bt http request hdr(if any)
    this.configKeywordsService.getAssocReqHdr(this.businessTransPatternDetail.id).subscribe(data => {
      this.btHttpHeadersInfo = data
    })

    //get list of assocuated bt http response hdr(if any)
    this.configKeywordsService.getAssocResHdr(this.businessTransPatternDetail.id).subscribe(data => {
      this.btResponseHeadersInfo = data
    })

    //get list of associated BT HTTP Body(if any)
    this.configKeywordsService.getAssocHttpBody(this.businessTransPatternDetail.id).subscribe(data => {
      this.httpBodyInfo = data
    })
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
        //get the currently added btpattern from the response
        let currentId = 0;
        let currentRuleId = 0;
        for (let row of this.businessTransPatternInfo) {
          if (row.btName == this.businessTransPatternDetail.btName && row.urlName == this.businessTransPatternDetail.urlName) {
            currentId = row.id;
            currentRuleId = row.btRuleId;
            break;
          }
        }

        //UPDATE BT METHOD PARENT_RULE_ID AND BT_PATTERN_ID AFTER RECIEVING RESPONSE FOR ADDED BTPATTERN
        this.configKeywordsService.updateParentId(currentId, currentRuleId, this.businessTransMethodInfo).subscribe(data => {

        })
        //UPDATE BT HTTP REQUEST HDR PARENT_RULE_ID AND BT_PATTERN_ID AFTER RECIEVING RESPONSE FOR ADDED BTPATTERN
        this.configKeywordsService.updateReqParentId(currentId, currentRuleId, this.btHttpHeadersInfo).subscribe(data => {

        })

        //UPDATE BT HTTP RESPONSE HDR PARENT_RULE_ID AND BT_PATTERN_ID AFTER RECIEVING RESPONSE FOR ADDED BTPATTERN
        this.configKeywordsService.updateResParentId(currentId, currentRuleId, this.btResponseHeadersInfo).subscribe(data => {

        })

        //UPDATE BT HTTP BODY PARENT_RULE_ID AND BT_PATTERN_ID AFTER RECIEVING RESPONSE FOR ADDED BTPATTERN
        this.configKeywordsService.updateBodyParentId(currentId, currentRuleId, this.httpBodyInfo).subscribe(data => {

        })

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

      //if bt pattern entry is blank
      let flag1 = this.businessTransPatternDetail.btName == undefined || this.businessTransPatternDetail.btName == null || this.businessTransPatternDetail.btName == "";
      //if other tables are not blank
      let flag2 = this.businessTransMethodInfo.length > 0 || this.httpBodyInfo.length > 0 || this.btResponseHeadersInfo.length > 0 || this.btHttpHeadersInfo.length > 0;
      if (flag1 && flag2) {
        return;
      }

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
  openGlobalThresholdDialog() {

    //Put label = Save if no BT is selected otherwise put Save and Apply
    if (this.selectedPatternData.length == 0) {
      this.globalSaveLabel = "Save";
    }
    else {
      this.globalSaveLabel = "Save and Apply";
    }
    this.globalThresholdDialog = true;
    //Updating global threshold values when dialog opens
    this.readGlobalThresholdFile()
  }

  //Read global threshold values from .globalThreshold.txt file or create file if not exists
  readGlobalThresholdFile() {

    this.configKeywordsService.readGlobalThresholdFile(this.profileId).subscribe(data => {
      this.globalFileData = data._body.split("|")
      this.slowThresholdGlobalValue = this.globalFileData[0];
      this.vslowThresholdGlobalValue = this.globalFileData[1];

    })

  }

  /** To save global threshold values in hidden file and apply these values to selected BT */
  applyGlobalThresholdValues() {
    let fileData = this.slowThresholdGlobalValue + "|" + this.vslowThresholdGlobalValue
    this.configKeywordsService.saveGlobalThresholdFile(this.profileId, fileData).subscribe(data => {

      // If any BT is selected then update its value with global threshold values
      if (this.selectedPatternData.length > 0) {
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
      else {
        this.globalThresholdDialog = false;
        this.configUtilityService.successMessage(Messages);
      }

    })

  }

  /** UPDATE selected BT with global threshold values  */
  updateBTWithGlobalThreshold(fileData) {
    let btIdArr = [];
    //Get the selected BTs bt_pattern_id and store in an array
    for (let bt of this.selectedPatternData) {
      btIdArr.push(bt.id);
    }
    this.configKeywordsService.updateBTWithGlobalThreshold(btIdArr, this.profileId).subscribe(data => {
      this.loadBTPatternData();
    })
    this.configUtilityService.successMessage("Transaction Threshold global values updated successfully")
    this.globalThresholdDialog = false;

  }

  /**Change the threshold values on toggle change- If ON then apply global values */
  changeThresholdOnClick() {
    if (!this.globalCheck) {
      this.businessTransPatternDetail.slowTransaction = this.slowThresholdGlobalValue
      this.businessTransPatternDetail.verySlowTransaction = this.vslowThresholdGlobalValue
    }
    else {
      //ADD Pattern case
      if (this.isNewApp) {
        this.businessTransPatternDetail.slowTransaction = "3000";
        this.businessTransPatternDetail.verySlowTransaction = "5000";
      }
      //Edit pattern case
      else {
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





















  /* Assign data to Method Business Transaction Data table */
  businessTransMethodInfo: BusinessTransMethodData[];
  businessTransMethodDetail: BusinessTransMethodData;
  selectedbusinessTransMethod: any[];

  /* Assign data to Rules Business Transaction Data table */
  methodRulesInfo: RulesData[];
  methodArgRulesInfo: RulesData[];

  btMethodRulesDetail: RulesData;

  selectedMethodRules: RulesData[];
  selectedArgRules: RulesData[];

  // /* For holding form fields*/
  // returnTypeRules: ReturnTypeData;
  // argumentTypeRules: ArgumentTypeData;

  /* open dialog box */
  addBusinessTransMethodDialog: boolean = false;
  addRulesDialog: boolean = false;
  addArgRulesDialog: boolean = false;

  /* Assign value to return type drop down */
  returnTypeList: SelectItem[];

  /*selected item from Return type list*/
  selectedReturnType: string;

  /* to hold data to display in table of return type and argument type in table */
  // returnTypeData: ReturnTypeData[];
  argumentTypeData: ArgumentTypeData[];

  /* Assign value to Return type drop down */
  returnOperationList: SelectItem[];
  /* Assign value to Argument type drop down */
  operationList: SelectItem[];

  /**It stores selected data for edit or add functionality */
  methodBasedCustomData: MethodBasedCustomData;

  /* hold the data that needs to be displayed in table */
  tableData: MethodBasedCustomData[];

  /*selected item from return type list*/
  selectedOperation: string;

  isNewMethod: boolean = false;
  isNewReturn: boolean = false;
  isNewArg: boolean = false;

  //flag used for titles in edit dialog of rules
  editReturnRules: boolean = false;
  editArgumentRules: boolean = false;

  /*For cheking FQM */
  first: boolean;
  second: boolean;

  enableArgumentType: string;

  indexList: SelectItem[];

  capturingType: string;

  argCount: number = 0;
  returnCount: number = 0;
  returnCountEdit: number = 0;
  argCountEdit: number = 0;

  methodBtTypeDelete = [];

  bTMethodBrowse: boolean;
  isbTMethodBrowse: boolean;
  /** To open file explorer dialog */
  flag: boolean = true;

  //used to hold value of "type " i.e data type of return value or argument value whichever is selected
  type: string;
  fqm: any;

  //All below variables are to implement BT Method Invocation
  methodInvocationRulesInfo: RulesData[];
  selectedInvocationRules: RulesData[];
  btMethodInvococationRulesDetail: RulesData;
  methodInvocation: string
  addInvocationRulesDialog: boolean;
  isNewInvocation: boolean;
  returnCountForInvocation: number = 0;
  returnCountForInvocationEdit: number = 0;
  invocationCount: number = 0
  invocationCountEdit: number = 0;
  editInvocationRules: boolean = false;
  third: boolean;
  indexListForInvoc: SelectItem[];

  btPatternId: number;
  parentRuleId: number;

  arrStringLabelReturnType: any[] = ['Equals', 'Not equals', 'Contains', 'Starts with', 'Ends with', 'Exception', 'Invocation'];
  arrStringValueReturnType: any[] = ['EQUALS', 'NOT_EQUALS', 'CONTAINS', 'STARTS_WITH', 'ENDS_WITH', 'EXCEPTION', 'INVOCATION'];


  arrNumericLabelReturnType: any[] = ['Equals', 'Not equals', 'Less than', 'Greater than', 'Less than equals to', 'Greater than equals to', 'Exception', 'Invocation'];
  arrNumericValueReturnType: any[] = ['EQ', 'NE', 'LT', 'GT', 'LE', 'GE', 'EXCEPTION', 'INVOCATION'];

  arrCharLabelReturnType: any[] = ['Exception', 'Equals', 'Not equals', 'Invocation'];
  arrCharValueReturnType: any[] = ['EXCEPTION', 'EQ', 'NE'];

  arrBooleanLabelReturnType: any[] = ['True', 'False', 'Exception', 'Invocation'];
  arrBooleanValueReturnType: any[] = ['TRUE', 'FALSE', 'EXCEPTION', 'INVOCATION'];

  arrVoidLabelReturnType: any[] = ['Invocation'];
  arrVoidValueReturnType: any[] = ['INVOCATION'];

  arrStringLabelArgType: any[] = ['Equals', 'Not equals', 'Contains', 'Starts with', 'Ends with', 'Exception'];
  arrStringValueArgType: any[] = ['EQUALS', 'NOT_EQUALS', 'CONTAINS', 'STARTS_WITH', 'ENDS_WITH', 'EXCEPTION'];

  arrNumericLabelArgType: any[] = ['Equals', 'Not equals', 'Less than', 'Greater than', 'Less than equals to', 'Greater than equals to', 'Exception'];
  arrNumericValueArgType: any[] = ['EQ', 'NE', 'LT', 'GT', 'LE', 'GE', 'EXCEPTION'];

  arrCharLabelArgType: any[] = ['Exception', 'Equals', 'Not equals'];
  arrCharValueArgType: any[] = ['EXCEPTION', 'EQ', 'NE'];

  arrBooleanLabelArgType: any[] = ['True', 'False', 'Exception'];
  arrBooleanValueArgType: any[] = ['TRUE', 'FALSE', 'EXCEPTION'];

  DATA_TYPE = {
    BOOLEAN: 'Z',
    SHORT: 'S',
    INTEGER: 'I',
    STRING: 'Ljava/lang/String;',
    BYTE: 'B',
    FLOAT: 'F',
    DOUBLE: 'D',
    LONG: 'J',
    CHAR: 'C',
    VOID: 'V'
  };

  DATA_TYPE_ARR = [
    this.DATA_TYPE.BOOLEAN,
    this.DATA_TYPE.SHORT,
    this.DATA_TYPE.INTEGER,
    this.DATA_TYPE.STRING,
    this.DATA_TYPE.BYTE,
    this.DATA_TYPE.FLOAT,
    this.DATA_TYPE.DOUBLE,
    this.DATA_TYPE.LONG,
    this.DATA_TYPE.CHAR,
    this.DATA_TYPE.VOID
  ];

  changeOpertionType(type) {

    if (type == "object/string") {
      this.returnOperationList = ConfigUiUtility.createListWithKeyValue(this.arrStringLabelReturnType, this.arrStringValueReturnType);
      this.operationList = ConfigUiUtility.createListWithKeyValue(this.arrStringLabelArgType, this.arrStringValueArgType);
      this.type = '1';
    }
    else if (type == "int" || type == "short" || type == "float" || type == "long" || type == "double") {
      this.returnOperationList = ConfigUiUtility.createListWithKeyValue(this.arrNumericLabelReturnType, this.arrNumericValueReturnType);
      this.operationList = ConfigUiUtility.createListWithKeyValue(this.arrNumericLabelArgType, this.arrNumericValueArgType);
      this.type = '0';
    }
    else if (type == "byte" || type == "char") {
      this.returnOperationList = ConfigUiUtility.createListWithKeyValue(this.arrCharLabelReturnType, this.arrCharValueReturnType);
      this.operationList = ConfigUiUtility.createListWithKeyValue(this.arrCharLabelArgType, this.arrCharValueArgType);
      this.type = '3';
    }

    else if (type == "boolean") {
      this.returnOperationList = ConfigUiUtility.createListWithKeyValue(this.arrBooleanLabelReturnType, this.arrBooleanValueReturnType);
      this.operationList = ConfigUiUtility.createListWithKeyValue(this.arrBooleanLabelArgType, this.arrBooleanValueArgType);
      this.type = '2';
    }

    else if (type == "void") {
      this.returnOperationList = ConfigUiUtility.createListWithKeyValue(this.arrVoidLabelReturnType, this.arrVoidValueReturnType);
      this.type = '4';
    }
  }


  // loadBTs() {
  //   this.configKeywordsService.childBTOfPattern$.subscribe(data => {
  //     console.log("Inside Method BTTT  data coming is====>", data);
  //     this.btPatternId = data['btPatternId'];
  //     this.parentRuleId = data['parentRuleId'];
  //     // To open add pattern dialog, method bt must also be blank table
  //     console.log("this.btPatternId=====>", this.btPatternId);
  //     console.log("this.parentRuleId=====>", this.parentRuleId);
  //     if (data['operation'] == 'Add') {
  //       this.saveMethod();
  //     }
  //   });
  // }

  /** Fetch BT Mehtod Data and Assign on Loading */
  loadBTMethodData(): void {
    // this.businessTransMethodDetail = new BusinessTransMethodData();
    this.route.params.subscribe((params: Params) => {
      this.profileId = params['profileId'];
      if (this.profileId == 1 || this.profileId == 777777 || this.profileId == 888888)
        this.saveDisable = true;
    });
    //this.businessTransMethodInfo = data
    this.configKeywordsService.getBusinessTransMethodData(this.profileId).subscribe(data => {
      let that = this;
      data.map(function (val) {
        that.modifyData(val);
      })
      this.businessTransMethodInfo = data;
    }

    );
  }

  /** this method used for open dialog for add Method Business Transaction */
  openMethodDialog() {
    this.businessTransMethodDetail = new BusinessTransMethodData();
    this.businessTransMethodDetail.fqm = this.fqm;
    this.btMethodRulesDetail = new RulesData();
    this.methodRulesInfo = [];
    this.methodArgRulesInfo = [];
    this.methodInvocationRulesInfo = [];
    this.enableArgumentType = "";
    this.methodInvocation = "";

    this.addBusinessTransMethodDialog = true;
    this.isNewMethod = true;

  }

  /** This method is used to open a dialog for add Rules
   * Call a method for fill Operation drop down according Return Type
  */
  openAddReturnRulesDialog() {
    this.addRulesDialog = true;
    this.btMethodRulesDetail = new RulesData();
    /*calling this function
    * to know data type of return value of provided fqm
    * and creating opertaion list a/c to return type
    */
    this.createMatchCriteria();
    // this.changeOpertionType();
  }

  createMatchCriteria() {
    let type = this.getTypeReturnType(this.businessTransMethodDetail.fqm);
    this.changeOpertionType(type);
  }

  openAddArgumentRulesDialog() {
    this.btMethodRulesDetail = new RulesData();
    this.addArgRulesDialog = true;
  }

  /** Edit BT Method */
  editMethodTrans(): void {
    if (!this.selectedbusinessTransMethod || this.selectedbusinessTransMethod.length < 1) {
      this.configUtilityService.errorMessage("Select a row to edit");
      return;
    }
    else if (this.selectedbusinessTransMethod.length > 1) {
      this.configUtilityService.errorMessage("Select only one row to edit");
      return;
    }

    this.addBusinessTransMethodDialog = true;
    this.isNewMethod = false;
    //  this.businessTransMethodDetail.argumentIndex = Number(this.businessTransMethodDetail.argumentIndex);
    this.businessTransMethodDetail = Object.assign({}, this.selectedbusinessTransMethod[0]);

    if (this.businessTransMethodDetail.enableArgumentType && ((this.businessTransMethodDetail.methodInvocation == null || this.businessTransMethodDetail.methodInvocation == '-1'))) {
      this.validateArgAndGetArgumentsNumberList('ARGUMENT');
      this.methodArgRulesInfo = this.selectedbusinessTransMethod[0].rules;
      this.methodRulesInfo = [];
      this.methodInvocationRulesInfo = [];
      this.enableArgumentType = "argument";
    }
    else if (this.businessTransMethodDetail.enableArgumentType && this.businessTransMethodDetail.methodInvocation == '1') {
      this.validateArgAndGetArgumentsNumberList('INVOCATION');
      this.methodInvocationRulesInfo = this.selectedbusinessTransMethod[0].rules;
      this.methodArgRulesInfo = [];
      this.methodRulesInfo = [];
      this.enableArgumentType = "invocation";
    }
    else {
      this.methodRulesInfo = this.selectedbusinessTransMethod[0].rules;
      this.methodArgRulesInfo = [];
      this.methodInvocationRulesInfo = [];
      this.enableArgumentType = "returnType";
    }
    this.selectedArgRules = [];
    this.selectedMethodRules = [];
    this.selectedInvocationRules = [];
    this.indexList = [];
  }

  //Open view window on FQM name click
  openViewMethodTrans(data) {
    this.businessTransMethodDetail = new BusinessTransMethodData();
    this.addBusinessTransMethodDialog = true;
    this.isNewMethod = false;
    this.businessTransMethodDetail = Object.assign({}, data);
    if (this.businessTransMethodDetail.enableArgumentType) {
      this.methodArgRulesInfo = this.businessTransMethodDetail.rules;
      this.enableArgumentType = "argument";
    }
    else {
      this.methodRulesInfo = this.businessTransMethodDetail.rules;
      this.enableArgumentType = "returnType";
    }
  }

  getIndex(fqm): number {
    for (let i = 0; i < this.businessTransMethodInfo.length; i++) {
      if (this.businessTransMethodInfo[i].fqm == fqm) {
        return i;
      }
    }
    return -1;
  }

  /**This method is used to edit Method detail */
  editMethod(): void {
    if (this.enableArgumentType == "returnType") {
      this.businessTransMethodDetail.enableArgumentType = false;
      this.businessTransMethodDetail.rules = this.methodRulesInfo;
      this.businessTransMethodDetail.methodInvocation = '-1';
      this.businessTransMethodDetail.methodInvocationIndex = -1;
      this.businessTransMethodDetail.argumentIndex = -1;
      //If return type is selected then, to delete all the rules from argument table
      if (this.methodRulesInfo != []) {
        for (let index in this.methodArgRulesInfo) {
          if (this.methodArgRulesInfo[index].btMethodRuleId != null)
            this.methodBtTypeDelete.push(this.methodArgRulesInfo[index].btMethodRuleId);
        }
        this.methodArgRulesInfo = [];
        //If return type is selected then, to delete all the rules from Invocation table
        for (let index in this.methodInvocationRulesInfo) {
          if (this.methodInvocationRulesInfo[index].btMethodRuleId != null)
            this.methodBtTypeDelete.push(this.methodInvocationRulesInfo[index].btMethodRuleId);
        }
        this.methodInvocationRulesInfo = [];
      }
    }
    else if (this.enableArgumentType == "argument") {
      // this.operationListArgumentType();
      this.businessTransMethodDetail.enableArgumentType = true;
      this.businessTransMethodDetail.rules = this.methodArgRulesInfo;
      this.businessTransMethodDetail.methodInvocation = '-1';
      this.businessTransMethodDetail.methodInvocationIndex = -1;

      //If argument type is selected then, to delete all the rules from return table
      if (this.methodRulesInfo != []) {
        for (let index in this.methodRulesInfo) {
          if (this.methodRulesInfo[index].btMethodRuleId != null)
            this.methodBtTypeDelete.push(this.methodRulesInfo[index].btMethodRuleId)
        }
        this.methodRulesInfo = [];
        //If argument type is selected then, to delete all the rules from Invocation table
        for (let index in this.methodInvocationRulesInfo) {
          if (this.methodInvocationRulesInfo[index].btMethodRuleId != null)
            this.methodBtTypeDelete.push(this.methodInvocationRulesInfo[index].btMethodRuleId)
        }
        this.methodInvocationRulesInfo = [];
      }
    }
    else if (this.enableArgumentType == "invocation") {
      this.businessTransMethodDetail.enableArgumentType = true;
      this.businessTransMethodDetail.methodInvocation = '1';
      this.businessTransMethodDetail.argumentIndex = -1;
      this.businessTransMethodDetail.rules = this.methodInvocationRulesInfo;
      //If argument type is selected then, to delete all the rules from return table
      if (this.methodRulesInfo != []) {
        for (let index in this.methodRulesInfo) {
          if (this.methodRulesInfo[index].btMethodRuleId != null)
            this.methodBtTypeDelete.push(this.methodRulesInfo[index].btMethodRuleId)
        }
        this.methodRulesInfo = [];
        //If argument type is selected then, to delete all the rules from Argument table
        for (let index in this.methodArgRulesInfo) {
          if (this.methodArgRulesInfo[index].btMethodRuleId != null)
            this.methodBtTypeDelete.push(this.methodArgRulesInfo[index].btMethodRuleId);
        }
        this.methodArgRulesInfo = [];
      }
    }
    if (this.enableArgumentType == "invocation") {
      this.businessTransMethodDetail.returnType = '4';
    }
    else
      this.businessTransMethodDetail.returnType = this.type;
    if (this.enableArgumentType == "returnType" && this.methodRulesInfo.length == 0) {
      this.configUtilityService.errorMessage("Provide return type settings");
      return;
    }
    if (this.enableArgumentType == "argument" && this.methodArgRulesInfo.length == 0) {
      this.configUtilityService.errorMessage("Provide argument type settings");
      return;
    }
    if (this.enableArgumentType == "invocation" && this.methodInvocationRulesInfo.length == 0) {
      this.configUtilityService.errorMessage("Provide invocation type settings");
      return;
    }
    this.businessTransMethodDetail.btMethodId = this.selectedbusinessTransMethod[0].btMethodId;
    this.selectedbusinessTransMethod = [];
    /****for edit case
       *  first triggering the request to delete the  rules and
       *  when response comes then triggering request to add the new added rules
       *
       */
    this.configKeywordsService.deleteMethodBtRules(this.methodBtTypeDelete).subscribe(data => {
      let that = this;
      //Edit call, sending row data to service
      this.configKeywordsService.editBusinessTransMethod(this.businessTransMethodDetail).subscribe(data => {

        this.businessTransMethodInfo.map(function (val) {
          if (val.btMethodId == data.btMethodId) {
            val.argumentIndex = data.argumentIndex;
            val.btMethodId = data.btMethodId;
            val.enableArgumentType = data.enableArgumentType;
            val.fqm = data.fqm;
            val.returnType = data.returnType;
            val.rules = data.rules;
            val.methodInvocation = data.methodInvocation;
            val.methodInvocationIndex = data.methodInvocationIndex;
          }
          that.modifyData(val);
        })
        this.configUtilityService.successMessage(editMessage);
      });
    })
    this.closeDialog1();
  }

  /**This method is used to delete Mehtod BT*/
  deleteMethodTrans(): void {
    if (!this.selectedbusinessTransMethod || this.selectedbusinessTransMethod.length < 1) {
      this.configUtilityService.errorMessage("Select row(s) to delete");
      return;
    }
    this.confirmationService.confirm({
      message: 'Do you want to delete the selected row?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        //Get Selected Applications's AppId
        let selectedApp = this.selectedbusinessTransMethod;
        let arrAppIndex = [];
        for (let index in selectedApp) {
          arrAppIndex.push(selectedApp[index].btMethodId);
        }
        this.configKeywordsService.deleteBusinessTransMethodData(arrAppIndex, this.profileId)
          .subscribe(data => {
            this.deleteMethodsBusinessTransactions(arrAppIndex);
            this.selectedbusinessTransMethod = [];
            this.configUtilityService.infoMessage("Deleted Successfully");
          })
      },
      reject: () => {
      }
    });
  }

  /**This method is used to delete Method Rules */
  deleteRules() {
    if (!this.selectedMethodRules || this.selectedMethodRules.length < 1) {
      this.configUtilityService.errorMessage("Select row(s) to delete");
      return;
    }
    let selectedRules = this.selectedMethodRules;
    let arrRulesIndex = [];
    for (let index in selectedRules) {
      arrRulesIndex.push(selectedRules[index]);
      if (selectedRules[index].hasOwnProperty('btMethodRuleId')) {
        this.methodBtTypeDelete.push(selectedRules[index].btMethodRuleId);
      }
    }
    this.deleteRulesFromTable(arrRulesIndex);
    this.selectedMethodRules = [];
  }

  //deletimg Argument rules
  deleteArgumentsRules(): void {
    if (!this.selectedArgRules || this.selectedArgRules.length < 1) {
      this.configUtilityService.errorMessage("Select row(s) to delete");
      return;
    }
    let selectedRules = this.selectedArgRules;
    let arrArgIndex = [];
    for (let index in selectedRules) {
      arrArgIndex.push(selectedRules[index]);
      if (selectedRules[index].hasOwnProperty('btMethodRuleId')) {
        this.methodBtTypeDelete.push(selectedRules[index].btMethodRuleId);
      }
    }
    this.deleteArgRulesFromTable(arrArgIndex);
    this.selectedArgRules = [];

  }

  /**This method returns selected application row on the basis of selected row */
  getRulesIndex(appId: any): number {
    for (let i = 0; i < this.methodRulesInfo.length; i++) {
      if (this.methodRulesInfo[i] == appId) {
        return i;
      }
    }
    return -1;
  }

  /**This method returns selected argument row on the basis of selected row */
  getArgRulesIndex(appId: any): number {
    for (let i = 0; i < this.methodArgRulesInfo.length; i++) {
      if (this.methodArgRulesInfo[i] == appId) {
        return i;
      }
    }
    return -1;
  }

  /**This method returns selected application row on the basis of selected row */
  getMethodBusinessIndex(appId: any): number {
    for (let i = 0; i < this.businessTransMethodInfo.length; i++) {
      if (this.businessTransMethodInfo[i].btMethodId == appId) {
        return i;
      }
    }
    return -1;
  }

  /**This method is used to delete Rules from Data Table */
  deleteRulesFromTable(arrRulesIndex: any[]): void {
    //For stores table row index
    let rowIndex: number[] = [];

    for (let index in arrRulesIndex) {
      rowIndex.push(this.getRulesIndex(arrRulesIndex[index]));
    }
    this.methodRulesInfo = deleteMany(this.methodRulesInfo, rowIndex);
  }

  /**This method is used to delete  Argument Rules from Data Table */
  deleteArgRulesFromTable(arrRulesIndex: any[]): void {
    //For stores table row index
    let rowIndex: number[] = [];

    for (let index in arrRulesIndex) {
      rowIndex.push(this.getArgRulesIndex(arrRulesIndex[index]));
    }
    this.methodArgRulesInfo = deleteMany(this.methodArgRulesInfo, rowIndex);
  }

  /**This method is used to delete Rules from Data Table */
  deleteMethodsBusinessTransactions(arrIndex) {
    let rowIndex: number[] = [];

    for (let index in arrIndex) {
      rowIndex.push(this.getMethodBusinessIndex(arrIndex[index]));
    }
    this.businessTransMethodInfo = deleteMany(this.businessTransMethodInfo, rowIndex);
  }

  //For checking FQM 
  saveRules() {
    if (this.btMethodRulesDetail.value == null || this.btMethodRulesDetail.value == undefined || this.btMethodRulesDetail.value == '') {
      this.btMethodRulesDetail.value = 'NA';
    }
    //in edit form, to edit return rules
    if (!this.isNewMethod) {
      if (this.editReturnRules) {
        this.editReturnRules = false;
        let that = this;
        this.methodRulesInfo.map(function (val) {
          if (val.id == that.btMethodRulesDetail.id) {
            val.btName = that.btMethodRulesDetail.btName;
            val.opCode = that.btMethodRulesDetail.opCode;
            val.opCodeDropDown = that.btMethodRulesDetail.opCodeDropDown;
            val.operationName = that.btMethodRulesDetail.operationName;
            val.previousBtMethodRulesIds = that.btMethodRulesDetail.previousBtMethodRulesIds;
            val.value = that.btMethodRulesDetail.value;
          }
        })
        this.selectedMethodRules = [];
      }
      else {
        //In edit form, to add new return rule
        this.btMethodRulesDetail["id"] = this.returnCountEdit;
        this.businessTransMethodDetail.rules = ImmutableArray.push(this.methodRulesInfo, this.btMethodRulesDetail);
        this.methodRulesInfo = this.businessTransMethodDetail.rules;
        this.returnCountEdit = this.returnCountEdit + 1;
      }
    }
    else {
      //in add form, to edit return rules
      if (this.editReturnRules) {
        this.editReturnRules = false;
        let that = this;
        this.methodRulesInfo.map(function (val) {
          if (val.id == that.btMethodRulesDetail.id) {
            val.btName = that.btMethodRulesDetail.btName;
            val.opCode = that.btMethodRulesDetail.opCode;
            val.opCodeDropDown = that.btMethodRulesDetail.opCodeDropDown;
            val.operationName = that.btMethodRulesDetail.operationName;
            val.previousBtMethodRulesIds = that.btMethodRulesDetail.previousBtMethodRulesIds;
            val.value = that.btMethodRulesDetail.value;
          }
        })
        this.selectedMethodRules = [];
      }
      else {
        //In add form, to add new return rule
        this.btMethodRulesDetail["id"] = this.returnCount;
        this.methodRulesInfo = ImmutableArray.push(this.methodRulesInfo, this.btMethodRulesDetail);
        this.returnCount = this.returnCount + 1;
      }
    }
    this.selectedMethodRules = [];
    this.addRulesDialog = false;
    this.btMethodRulesDetail = new RulesData();
  }

  saveArgRules() {
    //in edit form, to edit Argument rules
    if (!this.isNewMethod) {
      if (this.editArgumentRules) {
        this.editArgumentRules = false;
        let that = this;
        this.methodArgRulesInfo.map(function (val) {
          if (val.id == that.btMethodRulesDetail.id) {
            val.btName = that.btMethodRulesDetail.btName;
            val.opCode = that.btMethodRulesDetail.opCode;
            val.opCodeDropDown = that.btMethodRulesDetail.opCodeDropDown;
            val.operationName = that.btMethodRulesDetail.operationName;
            val.previousBtMethodRulesIds = that.btMethodRulesDetail.previousBtMethodRulesIds;
            val.value = that.btMethodRulesDetail.value;
          }
        })
        this.selectedArgRules = [];
      }
      else {
        //In edit form, to add new argument rule
        this.btMethodRulesDetail["id"] = this.argCountEdit;
        this.businessTransMethodDetail.rules = ImmutableArray.push(this.methodArgRulesInfo, this.btMethodRulesDetail);
        this.methodArgRulesInfo = this.businessTransMethodDetail.rules;
        this.argCountEdit = this.argCountEdit + 1;
      }
    }
    else {
      //in add form, to edit return rules
      if (this.editArgumentRules) {
        this.editArgumentRules = false;
        let that = this;
        this.methodArgRulesInfo.map(function (val) {
          if (val.id == that.btMethodRulesDetail.id) {
            val.btName = that.btMethodRulesDetail.btName;
            val.opCode = that.btMethodRulesDetail.opCode;
            val.opCodeDropDown = that.btMethodRulesDetail.opCodeDropDown;
            val.operationName = that.btMethodRulesDetail.operationName;
            val.previousBtMethodRulesIds = that.btMethodRulesDetail.previousBtMethodRulesIds;
            val.value = that.btMethodRulesDetail.value;
          }
        })
        this.selectedArgRules = [];
      }
      else {
        //In add form, to add new return rule

        this.btMethodRulesDetail["id"] = this.argCount;
        this.methodArgRulesInfo = ImmutableArray.push(this.methodArgRulesInfo, this.btMethodRulesDetail);
        this.argCount = this.argCount + 1;
      }
    }
    this.addArgRulesDialog = false;
    this.selectedArgRules = [];
    this.btMethodRulesDetail = new RulesData();
  }

  getTypeReturnType(fqm) {
    //for getting return Type
    let returnType = "NA";
    if (fqm != null) {
      let li = fqm.indexOf(')');
      let i = li + 1;

      let pi = 1;
      let charArr = fqm.split('');
      if (charArr[i] == '') {
        return null;
      }
      //      System.out.println("pi " + pi + ", index - " + index + ", char - " + charArr[i] + ", i" + i + " bracket -" + (bi +1));
      else {
        switch (charArr[i]) {
          case 'Z':
            returnType = "boolean";
            break;
          case 'B':
            returnType = "byte";
            break;
          case 'C':
            returnType = "char";
            break;
          case 'S':
            returnType = "short";
            break;
          case 'I':
            returnType = "int";
            break;
          case 'J':
            returnType = "long";
            break;
          case 'F':
            returnType = "float";
            break;
          case 'D':
            returnType = "double";
            break;
          case 'L':
          case '[':
            while (charArr[i++] != ';')
              ;
            returnType = "object/string";
            break;
          case 'V':
            returnType = "void";
            break;
          default:
            returnType = null;
            break;
        }
      }

      return returnType;
      //let list = opData.opValList(returnType);
    }
  }

  /**This method is common method for save or edit BT Method */
  saveADDEditMethodTrans(fqmField): void {
    //openAddReturnRulesDialog()
    if (this.first) {
      this.first = false;
      this.isNewReturn = true;
      let returnType = this.getTypeReturnType(this.businessTransMethodDetail.fqm);
      if (returnType == 'null') {
        this.configUtilityService.errorMessage("FQM doesn't have any return type.");
      }
      else {
        this.openAddReturnRulesDialog();
      }
    }
    else if (this.second) {
      this.second = false;
      this.isNewArg = true;
      this.openAddArgumentRulesDialog();
    }
    else if (this.third) {
      this.third = false;
      this.isNewInvocation = true;
      this.openAddInvocationDialog();
    }
    else {
      //When add new application
      if (this.isNewMethod) {
        //Check for app name already exist or not
        // if (!this.checkMethodNameAlreadyExist()) {

        this.saveMethod();
        this.btMethodRulesDetail = new RulesData();
        return;
        // }
      }
      //When add edit Method
      else {
        if (this.selectedbusinessTransMethod[0].fqm != this.businessTransMethodDetail.fqm) {
          if (this.checkMethodNameAlreadyExist())
            return;
        }
        this.editMethod();
      }
    }

  }
  /**This method is used to validate the name of Method is already exists. */
  checkMethodNameAlreadyExist(): boolean {

    for (let i = 0; i < this.businessTransMethodInfo.length; i++) {
      if (this.businessTransMethodInfo[i].fqm == this.businessTransMethodDetail.fqm) {
        this.configUtilityService.errorMessage("Fully qualified method name already exists");
        return true;
      }
    }

  }

  modifyData(val) {
    if (val.enableArgumentType == true && (val.methodInvocation == null || val.methodInvocation == '-1')) {
      val.capturingType = "Argument";
    }
    else if (val.enableArgumentType == true && val.methodInvocation == '1') {
      val.capturingType = "Invocation";
    }
    else {
      val.capturingType = "Return";
    }
  }

  getHdrNames(data) {
    let hdrNamesHref = '';
    data.map(function (val, index) {
      if (index != (data.length - 1)) {
        hdrNamesHref = hdrNamesHref + val.headerName + ",";
      }
      else {
        hdrNamesHref = hdrNamesHref + val.headerName
      }
    })
    return hdrNamesHref;
  }

  operationListArgumentType() {
    let type = this.getTypeArgumentType(this.businessTransMethodDetail.fqm, this.businessTransMethodDetail.argumentIndex)
    this.changeOpertionType(type)
  }

  getTypeArgumentType(fqm, index) {

    //    let fqm = this.props.fqm;
    if (fqm != null) {
      if (index != -1) {
        let li = fqm.indexOf(')');
        let bi = fqm.indexOf('(');
        let i = bi + 1;

        let pi = 1;
        let charArr = fqm.split('');

        while (i < li) {
          //      System.out.println("pi " + pi + ", index - " + index + ", char - " + charArr[i] + ", i" + i + " bracket -" + (bi +1));
          switch (charArr[i]) {
            case 'Z':
              if (pi == index)
                return "boolean";
              break;
            case 'B':
              if (pi == index)
                return "byte";
              break;
            case 'C':
              if (pi == index)
                return "char";
              break;
            case 'S':
              if (pi == index)
                return "short";
              break;
            case 'I':
              if (pi == index)
                return "int";
              break;
            case 'J':
              if (pi == index)
                return "long";
              break;
            case 'F':
              if (pi == index)
                return "float";
              break;
            case 'D':
              if (pi == index)
                return "double";
              break;
            case 'L':
            case '[':
              while (charArr[i++] != ';') {
              }
              i--;
              if (pi == index)
                return "object/string";
            default:
              if (pi == index)
                return "void";
              break;
          }
          ++pi; i++;
        }
        //throw new InvalidOperationTypeException("Method argument index is not correct");
        return "NA";
      }
    }
  }

  //for creating list for index i.e arguments number list
  validateArgAndGetArgumentsNumberList(argVal) {
    if (this.businessTransMethodDetail.fqm == null || this.businessTransMethodDetail.fqm == "") {
      this.configUtilityService.errorMessage("Fill out fully qualified method name first");
      this.indexList = [];
      this.indexListForInvoc = [];
      return;
    }
    else {
      let argStart = this.businessTransMethodDetail.fqm.indexOf("(");
      let argEnd = this.businessTransMethodDetail.fqm.indexOf(")");
      let args = this.businessTransMethodDetail.fqm.substring(argStart + 1, argEnd);
      //flag used for creating string "Ljava/lang/String;"
      let flag = false;
      let length = 0;
      let string = '';
      if (args.length == 0) {
        this.configUtilityService.errorMessage("No Arguments present in Fqm")
      }
      else {
        for (let i = 0; i < args.length; i++) {
          if (args[i] == "L") {
            flag = true;
            string = string + args[i];
            continue;
          }
          else if (flag) {
            if (args[i] == ";") {
              string = string + args[i];

              // if (this.DATA_TYPE_ARR.indexOf(string) == -1) {
              //   this.configUtilityService.errorMessage("Invalid Argument Data Type")
              //   flag = false;
              //   return;
              // }
              // else {
              length++;
              string = '';
              flag = false;
              // }
            }
            else
              string = string + args[i];

          }
          else {
            if (this.DATA_TYPE_ARR.indexOf(args[i]) == -1) {
              this.configUtilityService.errorMessage("Invalid Argument Data Type")
              return;
            }
            else {
              length++;
            }
          }
        }
      }
      // this.indexList.push({ value: -1, label: '--Select Index--' });
      if (argVal == "ARGUMENT") {
        this.indexList = [];
        for (let i = 1; i <= length; i++) {
          this.indexList.push({ 'value': i, 'label': i + '' });
        }
      }
      else {
        this.indexListForInvoc = [];
        for (let i = 0; i <= length; i++) {
          this.indexListForInvoc.push({ 'value': i, 'label': i + '' });
        }
      }
    }
  }

  saveMethod() {
    // this.loadBTMethodData();
    // if (this.btPatternId == -1) {
    // this.businessTransMethodInfo = [];
    // }
    // If any method bt is given then FQM is also provided, only then save otherwise not
    if (this.businessTransMethodDetail.fqm != "" && this.businessTransMethodDetail.fqm != undefined) {

      this.businessTransMethodDetail.rules = [];
      if (this.enableArgumentType == "returnType") {
        this.businessTransMethodDetail.enableArgumentType = false;
        this.businessTransMethodDetail.rules = this.methodRulesInfo;
        this.businessTransMethodDetail.methodInvocation = '-1';
        this.businessTransMethodDetail.methodInvocationIndex = -1;
      }
      else if (this.enableArgumentType == "argument") {
        this.businessTransMethodDetail.enableArgumentType = true;
        this.businessTransMethodDetail.rules = this.methodArgRulesInfo;
        this.businessTransMethodDetail.methodInvocation = '-1';
        this.businessTransMethodDetail.methodInvocationIndex = -1;
      }
      else if (this.enableArgumentType == "invocation") {
        this.businessTransMethodDetail.enableArgumentType = true;
        this.businessTransMethodDetail.rules = this.methodInvocationRulesInfo;
        this.businessTransMethodDetail.methodInvocation = "1";
      }
      if (this.enableArgumentType == "invocation") {
        this.businessTransMethodDetail.returnType = '4';
      }
      else
        this.businessTransMethodDetail.returnType = this.type;

      if (this.enableArgumentType == "") {
        this.configUtilityService.errorMessage("Select enable return/argument type capturing");
        return;
      }
      if (this.enableArgumentType == "returnType" && this.methodRulesInfo.length == 0) {
        this.configUtilityService.errorMessage("Provide return type settings");
        return;
      }
      if (this.enableArgumentType == "argument" && this.methodArgRulesInfo.length == 0) {
        this.configUtilityService.errorMessage("Provide argument type settings");
        return;
      }
      if (this.enableArgumentType == "invocation" && this.methodInvocationRulesInfo.length == 0) {
        this.configUtilityService.errorMessage("Provide invocation type settings");
        return;
      }

      this.businessTransMethodDetail.btPatternId = this.btPatternId;
      this.businessTransMethodDetail.parentRuleId = this.parentRuleId;
      // let dataDTO : BusinessTransMethodData[] = [];
      // dataDTO.push(this.businessTransMethodDetail);
      // dataDTO[0].parentRuleId = this.parentRuleId;
      // dataDTO[0].btMethodId = this.btPatternId;

      // console.log('Array of DTO is ====>',dataDTO)
      this.configUtilityService.successMessage(addMessage);
      // console.log("Arg value is ====>", arg)
      // if (arg == 'From Main Save') {
      // if(arg == 'From Child'){


      console.log("Before Hitting Service data is ======>", this.businessTransMethodDetail);

      this.configKeywordsService.addBusinessTransMethod(this.businessTransMethodDetail, this.profileId).subscribe(data => {
        // this.businessTransMethodInfo.push(data)
        this.modifyData(data);
        this.businessTransMethodInfo = ImmutableArray.push(this.businessTransMethodInfo, data);
        if (!this.flag) {
          this.configKeywordsService.saveBusinessTransMethodData(this.profileId)
            .subscribe(data => {

              this.configUtilityService.successMessage(addMessage);

            })
        }
      });
      this.addBusinessTransMethodDialog = false;
      this.selectedbusinessTransMethod = [];
      this.indexList = [];
      // }
      // else {
      // this.addBusinessTransMethodDialog = false;
      // }
    }
  }

  //For openong edit form of return type rules
  openEditReturnRulesDialog() {
    if (!this.selectedMethodRules || this.selectedMethodRules.length < 1) {
      this.configUtilityService.errorMessage("Select a row to edit");
    }
    else if (this.selectedMethodRules.length > 1) {
      this.configUtilityService.errorMessage("Select only one row to edit")
    }
    else {
      // this.isNewReturn = false;
      this.editReturnRules = true;
      let selectedRules = this.selectedMethodRules;
      // this.addRulesDialog = true;
      let that = this;
      this.methodRulesInfo.map(function (val) {
        val.id = that.returnCount;
        that.returnCount = that.returnCount + 1;
        // val.typeName = that.getTypeName(val.type)
      })
      this.btMethodRulesDetail = Object.assign({}, this.selectedMethodRules[0]);
    }
  }

  //For openong edit form of argument type rules
  openEditArgRulesDialog() {
    if (!this.selectedArgRules || this.selectedArgRules.length < 1) {
      this.configUtilityService.errorMessage("Select a row to edit");
    }
    else if (this.selectedArgRules.length > 1) {
      this.configUtilityService.errorMessage("Select only one row to edit")
    }
    else {
      this.isNewArg = false;
      this.editArgumentRules = true;
      let selectedRules = this.selectedArgRules;
      let that = this;
      this.methodArgRulesInfo.map(function (val) {
        val.id = that.argCount;
        that.argCount = that.argCount + 1;
        // val.typeName = that.getTypeName(val.type)
      })
      // this.addArgRulesDialog = true;
      this.btMethodRulesDetail = Object.assign({}, this.selectedArgRules[0]);
    }
  }

  /**For close add/edit Method dialog box */
  closeDialog1(): void {
    this.addBusinessTransMethodDialog = false;
    this.selectedbusinessTransMethod = [];
    this.selectedMethodRules = [];
    this.methodBtTypeDelete = [];
    this.selectedArgRules = [];
    this.indexList = [];
    // this.btMethodRulesDetail = new RulesData();
  }

  closeReturnDialog(): void {
    this.addRulesDialog = false;
    this.selectedMethodRules = [];
    this.addBusinessTransMethodDialog = true;
  }

  closeArgDialog(): void {
    this.addArgRulesDialog = false;
    this.selectedArgRules = [];
    this.addBusinessTransMethodDialog = true;
  }

  validateReturnType(fqm) {
    //for getting return Type
    let returnType = "NA";
    if (fqm != null) {
      let li = fqm.indexOf(')');
      let i = li + 1;

      let pi = 1;
      let charArr = fqm.split('');
      if (charArr[i] == '') {
        return null;
      }
      //      System.out.println("pi " + pi + ", index - " + index + ", char - " + charArr[i] + ", i" + i + " bracket -" + (bi +1));
      else {
        switch (charArr[i]) {
          case 'Z':
            returnType = "boolean";
            break;
          case 'B':
            returnType = "byte";
            break;
          case 'C':
            returnType = "char";
            break;
          case 'S':
            returnType = "short";
            break;
          case 'I':
            returnType = "int";
            break;
          case 'J':
            returnType = "long";
            break;
          case 'F':
            returnType = "float";
            break;
          case 'D':
            returnType = "double";
            break;
          case 'L':
          case '[':
            while (charArr[i++] != ';')
              ;
            returnType = "object/string";
            break;
          case 'V':
            returnType = "void";
            // this.enableArgumentType = "void";
            // this.configUtilityService.errorMessage("Operation not permitted for FQM's having return type as Void");
            break;
          default:
            returnType = null;
            break;
        }
      }
      return returnType;
    }
  }

  //Method Invoked to open Dialog of Invocation during ADD
  openAddInvocationDialog() {
    this.btMethodRulesDetail = new RulesData();
    this.addInvocationRulesDialog = true;
  }
  //Method Invoked to open Dialog of Invocation during EDIT
  openEditInvocationDialog() {
    if (!this.selectedInvocationRules || this.selectedInvocationRules.length < 1) {
      this.configUtilityService.errorMessage("Select a row to edit");
    }
    else if (this.selectedInvocationRules.length > 1) {
      this.configUtilityService.errorMessage("Select only one row to edit")
    }
    else {
      this.isNewInvocation = false;
      this.editInvocationRules = true;
      let selectedRules = this.selectedInvocationRules;
      let that = this;
      this.methodInvocationRulesInfo.map(function (val) {
        val.id = that.invocationCount;
        that.invocationCount = that.invocationCount + 1;
      })
      // this.addInvocationRulesDialog = true;
      this.btMethodRulesDetail = Object.assign({}, this.selectedInvocationRules[0]);
    }
  }
  //saveInvocationRules called from Dialog of INVOCATION
  saveInvocationRules() {
    this.btMethodRulesDetail.operationName = "METHODRETVALUE";
    //in edit form, to edit Invocation rules
    if (!this.isNewMethod) {

      if (this.editInvocationRules) {
        this.editInvocationRules = false;
        let that = this;
        this.methodInvocationRulesInfo.map(function (val) {
          if (val.id == that.btMethodRulesDetail.id) {
            val.btName = that.btMethodRulesDetail.btName;
            val.opCode = that.btMethodRulesDetail.opCode;
            val.operationName = that.btMethodRulesDetail.operationName;
            val.previousBtMethodRulesIds = that.btMethodRulesDetail.previousBtMethodRulesIds;
            val.value = that.btMethodRulesDetail.value;
          }
        })
        this.selectedInvocationRules = [];
      }
      else {
        //In edit form, to add new Invocation rule
        this.btMethodRulesDetail["id"] = this.invocationCountEdit;
        this.businessTransMethodDetail.rules = ImmutableArray.push(this.methodInvocationRulesInfo, this.btMethodRulesDetail);
        this.methodInvocationRulesInfo = this.businessTransMethodDetail.rules;
        this.invocationCountEdit = this.invocationCountEdit + 1;
      }
    }
    else {
      //in add form, to edit Invocation rules
      if (this.editInvocationRules) {
        this.editInvocationRules = false;
        let that = this;
        this.methodInvocationRulesInfo.map(function (val) {
          if (val.id == that.btMethodRulesDetail.id) {
            val.btName = that.btMethodRulesDetail.btName;
            val.opCode = that.btMethodRulesDetail.opCode;
            val.operationName = that.btMethodRulesDetail.operationName;
            val.previousBtMethodRulesIds = that.btMethodRulesDetail.previousBtMethodRulesIds;
            val.value = that.btMethodRulesDetail.value;
          }
        })
        this.selectedInvocationRules = [];
      }
      else {
        //In add form, to add new Invocation rule
        this.btMethodRulesDetail["id"] = this.invocationCountEdit;
        this.methodInvocationRulesInfo = ImmutableArray.push(this.methodInvocationRulesInfo, this.btMethodRulesDetail);
        this.invocationCountEdit = this.invocationCountEdit + 1;
      }
    }
    this.addInvocationRulesDialog = false;
    this.selectedInvocationRules = [];
    this.btMethodRulesDetail = new RulesData();
  }

  //Deletimg  Method Invocation rules
  deleteInvocationsRules(): void {
    if (!this.selectedInvocationRules || this.selectedInvocationRules.length < 1) {
      this.configUtilityService.errorMessage("Select row(s) to delete");
      return;
    }
    let selectedRules = this.selectedInvocationRules;
    let arrInvocationIndex = [];
    for (let index in selectedRules) {
      arrInvocationIndex.push(selectedRules[index]);
      if (selectedRules[index].hasOwnProperty('btMethodRuleId')) {
        this.methodBtTypeDelete.push(selectedRules[index].btMethodRuleId);
      }
    }
    this.deleteInvocationRulesFromTable(arrInvocationIndex);
    this.selectedInvocationRules = [];
  }

  /**This method is used to delete  Method Invocation Rules from Data Table */
  deleteInvocationRulesFromTable(arrRulesIndex: any[]): void {
    //For stores table row index
    let rowIndex: number[] = [];

    for (let index in arrRulesIndex) {
      rowIndex.push(this.getInvocationRulesIndex(arrRulesIndex[index]));
    }
    this.methodInvocationRulesInfo = deleteMany(this.methodInvocationRulesInfo, rowIndex);
  }

  /**This method returns selected method invocation row on the basis of selected row */
  getInvocationRulesIndex(methodInvocationId: any): number {
    for (let i = 0; i < this.methodInvocationRulesInfo.length; i++) {
      if (this.methodInvocationRulesInfo[i] == methodInvocationId) {
        return i;
      }
    }
    return -1;
  }

  /**This method is used to validate the name of MethodBT  already exists. */
  checkMethodBTNameNameAlreadyExist(): boolean {
    for (let i = 0; i < this.methodInvocationRulesInfo.length; i++) {
      if (this.methodInvocationRulesInfo[i].btName == this.btMethodRulesDetail.btName) {
        this.configUtilityService.errorMessage("Default BT Name already exist");
        return true;
      }
    }
  }
  closeInvocationDialog() {
    this.addInvocationRulesDialog = false;
    this.selectedInvocationRules = [];
    this.addBusinessTransMethodDialog = true;
  }





















  /**Assign data to BT HTTP Headers table */
  btHttpHeadersInfo: BTHTTPHeaderData[];
  btHttpHeadersDetail: BTHTTPHeaderData;
  selectedHTTPHeaders: BTHTTPHeaderData[];

  /** Assign data to BT HTTP Request header conditions */
  headerConditionInfo: BTHTTPHeaderConditions[];
  headerConditionDetail: BTHTTPHeaderConditions;
  selectedRequestHeader: BTHTTPHeaderConditions[];

  //For initializing drop down data
  requestHeader: SelectItem[];
  headerType: SelectItem[];
  operationName: SelectItem[];

  addResReqHeaderDialog: boolean = false;
  addReqDialog: boolean = false;

  enableRequest: boolean;

  editConditions: boolean = false;
  editHeaders: boolean = false;

  //For checking if it is new row or existing
  isNewHeader: boolean = false;
  isNewCond: boolean = false;

  httpHdrDelete = [];

  //Counter for adding/editing conditions
  condCount: number = 0;
  condCountEdit: number = 0;

  isbTHTTPHdrBrowse: boolean;

  //opens add request conditions dialog
  openReqDialog() {
    this.addReqDialog = true;
    this.isNewCond = true;
    this.headerConditionDetail = new BTHTTPHeaderConditions();
    this.loadOperationName();
  }

  //Opens Add BT HTTP header dialog
  openHeader() {
    this.btHttpHeadersDetail = new BTHTTPHeaderData();
    this.headerConditionDetail = new BTHTTPHeaderConditions();
    this.loadOperationName();
    this.isNewHeader = true;
    this.addResReqHeaderDialog = true;
    this.headerConditionInfo = [];
    if (this.btHttpHeadersInfo == undefined)
      this.btHttpHeadersInfo = [];
  }


  //To load opeartion operationName
  loadOperationName() {
    this.operationName = [];
    var opName = ['EQUALS', 'OCCURS', 'VALUE', 'NOT_EQUALS', 'CONTAINS', 'STARTS_WITH', 'ENDS_WITH'];
    var opVal = ['EQUALS', 'OCCURS', 'VALUE', 'NOT_EQUALS', 'CONTAINS', 'STARTS_WITH', 'ENDS_WITH'];

    this.operationName = ConfigUiUtility.createListWithKeyValue(opName, opVal);
  }

  //Method to add and edit BT HTTP headers data
  saveAddEditHttpheaders() {
    //When add new HTTP Headers
    if (this.isNewHeader) {
      if (this.checkHeaderNameAlreadyExist()) {
        return;
      }
      this.saveHttpHeaders();
    }

    //When add edit HTTP Headers
    else {
      if (this.selectedHTTPHeaders[0].headerName != this.btHttpHeadersDetail.headerName) {
        if (this.checkHeaderNameAlreadyExist()) {
          return;
        }
      }
      this.editHttpHeader();
    }
  }
  //Method to check redundancy for Header Name
  checkHeaderNameAlreadyExist(): boolean {
    for (let i = 0; i < this.btHttpHeadersInfo.length; i++) {
      if (this.btHttpHeadersInfo[i].headerName == this.btHttpHeadersDetail.headerName) {
        this.configUtilityService.errorMessage("Header Name already exist");
        return true;
      }
    }
  }

  //Method to save new HTTP Headers
  saveHttpHeaders() {
    this.btHttpHeadersDetail.conditions = [];

    this.btHttpHeadersDetail.conditions = this.headerConditionInfo;
    if (this.headerConditionInfo.length == 0) {
      this.configUtilityService.errorMessage("Provide header conditions for selected Header name");
      return;
    }
    this.configKeywordsService.addBtHttpHeaders(this.btHttpHeadersDetail, this.profileId).subscribe(data => {
      this.btHttpHeadersInfo = ImmutableArray.push(this.btHttpHeadersInfo, data);
      this.configUtilityService.successMessage(addMessage);
      this.modifyData1(this.btHttpHeadersInfo);

    });
    this.addResReqHeaderDialog = false;
  }

  //Method to edit HTTP Headers
  editHttpHeader() {
    if (this.headerConditionInfo.length == 0) {
      this.configUtilityService.errorMessage("Provide header conditions for selected Header name");
      return;
    }
    this.btHttpHeadersDetail.conditions = this.headerConditionInfo;
    this.btHttpHeadersDetail.headerId = this.selectedHTTPHeaders[0].headerId;
    /****for edit case
  *  first triggering the request to delete the  conditions and
  *  when response comes then triggering request to add the new HTTP Headers
  *
  */
    this.selectedHTTPHeaders = [];
    this.configKeywordsService.deleteHTTPHdrConditions(this.httpHdrDelete).subscribe(data => {
      let that = this;
      //Edit call, sending row data to service
      this.configKeywordsService.editBTHTTPHeaders(this.btHttpHeadersDetail).subscribe(data => {

        this.btHttpHeadersInfo.map(function (val) {
          if (val.headerId == data.headerId) {
            val.conditions = data.conditions;
            val.hdrBtNames = data.hdrBtNames;
            val.headerName = data.headerName;
            val.headerValType = data.headerValType;
            val.id = data.id;
          }
          // that.modifyData(val);
          if (val.conditions != null && val.conditions.length != 0) {
            let btNames = that.getBtNames(val.conditions);
            val.hdrBtNames = btNames
          }
          else {
            val.hdrBtNames = "NA"
          }

        });
        this.configUtilityService.successMessage(editMessage);
      });
    })
    this.closeDialog2();
  }

  //Opens edit HTTP Headers dialog
  openEditHttpHeader() {
    this.selectedRequestHeader = [];
    this.btHttpHeadersDetail = new BTHTTPHeaderData();
    if (!this.selectedHTTPHeaders || this.selectedHTTPHeaders.length < 1) {
      this.configUtilityService.errorMessage("Select a row to edit");
      return;
    }
    else if (this.selectedHTTPHeaders.length > 1) {
      this.configUtilityService.errorMessage("Select only one row to edit");
      return;
    }
    else {
      this.isNewHeader = false;
      this.addResReqHeaderDialog = true;
      // this.editConditions = true;
      this.isNewCond = true;
      let that = this;
      this.httpHdrDelete = [];
      this.btHttpHeadersDetail = Object.assign({}, this.selectedHTTPHeaders[0]);
      this.loadOperationName();
      this.headerConditionInfo = this.selectedHTTPHeaders[0].conditions;
      //providing Id for editing conditions in edit header form
      this.headerConditionInfo.map(function (val) {
        val.id = that.condCountEdit;
        that.condCountEdit = that.condCountEdit + 1;
      })
    }

  }

  //Method to show bt names seperated by commas in BT HTTP headers table
  modifyData1(data) {
    let that = this;
    data.map(function (val) {
      if (val.conditions != null && val.conditions.length != 0) {
        let btNames = that.getBtNames(val.conditions);
        val.hdrBtNames = btNames
      }
      else {
        val.hdrBtNames = "NA"
      }
    })
    this.btHttpHeadersInfo = data
  }


  getBtNames(data) {
    let btNamesHref = '';
    data.map(function (val, index) {
      if (index != (data.length - 1)) {
        if (val.btName == null) {
          btNamesHref = btNamesHref + " - " + ",";
        }
        else
          btNamesHref = btNamesHref + val.btName + ",";
      }
      else {
        if (val.btName == null) {
          btNamesHref = btNamesHref + " - "
        }
        else
          btNamesHref = btNamesHref + val.btName
      }
    })
    return btNamesHref;
  }

  //Method to add BT http request conditions
  saveConditions() {
    if (this.headerConditionDetail.operation == "VALUE") {
      this.headerConditionDetail.btName = "-";
      this.headerConditionDetail.hdrValue = "-";
    }
    if (this.headerConditionDetail.operation == "OCCURS") {
      this.headerConditionDetail.hdrValue = "-";
    }
    //EDIT functionality
    if (!this.isNewHeader) {
      if (this.editConditions) {
        //In edit form to edit conditions
        // Purpose: The below if block is required for checking redundancy for  BT Name 
        if (this.selectedRequestHeader[0].btName != this.headerConditionDetail.btName) {
          if (this.checkBTNameAlreadyExist()) {
            return;
          }
        }

        this.isNewCond = false;
        this.editConditions = false;
        let that = this;
        this.headerConditionInfo.map(function (val) {
          if (val.id == that.headerConditionDetail.id) {
            val.btName = that.headerConditionDetail.btName;
            val.hdrValue = that.headerConditionDetail.hdrValue;
            val.operation = that.headerConditionDetail.operation;
          }
        });
        this.selectedRequestHeader = [];
      }

      else {
        if (this.checkBTNameAlreadyExist()) {
          return;
        }
        this.isNewCond = true;
        this.headerConditionDetail["id"] = this.condCountEdit;
        this.headerConditionInfo = ImmutableArray.push(this.headerConditionInfo, this.headerConditionDetail);
        this.condCountEdit = this.condCountEdit + 1;
      }
    }

    //ADD functionality
    else {
      //In add form, to edit conditions
      if (this.editConditions) {
        // Purpose: The below if block is required for checking redundancy for Bt Name
        if (this.selectedRequestHeader[0].btName != this.headerConditionDetail.btName) {
          if (this.checkBTNameAlreadyExist()) {
            return;
          }
        }
        this.isNewCond = false;
        this.editConditions = false;
        let that = this;
        this.headerConditionInfo.map(function (val) {
          if (val.id == that.headerConditionDetail.id) {
            val.btName = that.headerConditionDetail.btName;
            val.hdrValue = that.headerConditionDetail.hdrValue;
            val.operation = that.headerConditionDetail.operation;
          }
        });
        this.selectedRequestHeader = [];
      }

      else {
        if (this.checkBTNameAlreadyExist()) {
          return;
        }
        else //In add form to add conditions
        {
          this.isNewCond = true;
          this.headerConditionDetail["id"] = this.condCount;
          this.headerConditionInfo = ImmutableArray.push(this.headerConditionInfo, this.headerConditionDetail);
          this.condCount = this.condCount + 1;
        }
      }
    }
    this.addReqDialog = false;
    this.headerConditionDetail = new BTHTTPHeaderConditions();
  }

  //Method to check redundancy for BT Name
  checkBTNameAlreadyExist(): boolean {
    for (let i = 0; i < this.headerConditionInfo.length; i++) {
      if (this.headerConditionInfo[i].btName == this.headerConditionDetail.btName) {
        this.configUtilityService.errorMessage("BT Name already exist");
        return true;
      }
    }
  }

  //Method to delete request headers
  deleteReqHdr() {
    if (!this.selectedRequestHeader || this.selectedRequestHeader.length < 1) {
      this.configUtilityService.errorMessage("Select row(s) to delete");
      return;
    }
    let selectReqHdrs = this.selectedRequestHeader;
    let arrReqIndex = [];
    for (let index in selectReqHdrs) {
      arrReqIndex.push(selectReqHdrs[index]);
      if (selectReqHdrs[index].hasOwnProperty('hdrCondId')) {
        this.httpHdrDelete.push(selectReqHdrs[index].hdrCondId);
      }
    }
    this.deleteConditionFromTable(arrReqIndex);
    this.selectedRequestHeader = [];
  }

  /**This method is used to delete BT HTTP Headers*/
  deleteBTHTTPHeaders(): void {
    if (!this.selectedHTTPHeaders || this.selectedHTTPHeaders.length < 1) {
      this.configUtilityService.errorMessage("Select row(s) to delete");
      return;
    }
    this.confirmationService.confirm({
      message: 'Do you want to delete the selected row?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        //Get Selected headers's headerId
        let selectedApp = this.selectedHTTPHeaders;
        let arrAppIndex = [];
        for (let index in selectedApp) {
          arrAppIndex.push(selectedApp[index].headerId);
        }
        this.configKeywordsService.deleteBTHTTPHeaders(arrAppIndex, this.profileId)
          .subscribe(data => {
            this.deleteBtHttpHeaders(arrAppIndex);
            this.selectedHTTPHeaders = [];
            this.configUtilityService.infoMessage("Deleted Successfully");
          })
      },
      reject: () => {
      }
    });
  }

  /**This method is used to delete headers from Data Table */
  deleteBtHttpHeaders(arrIndex) {
    let rowIndex: number[] = [];

    for (let index in arrIndex) {
      rowIndex.push(this.getHeadersIndex(arrIndex[index]));
    }
    this.btHttpHeadersInfo = deleteMany(this.btHttpHeadersInfo, rowIndex);
  }

  /**This method returns selected headers row on the basis of selected row */
  getHeadersIndex(appId: any): number {
    for (let i = 0; i < this.btHttpHeadersInfo.length; i++) {
      if (this.btHttpHeadersInfo[i].headerId == appId) {
        return i;
      }
    }
    return -1;
  }

  /**This method is used to delete conditions from Data Table */
  deleteConditionFromTable(arrReqIndex: any[]): void {
    //For stores table row index
    let rowIndex: number[] = [];

    if (arrReqIndex.length < 1) {
      this.configUtilityService.errorMessage("Select row(s) to delete");
      return;
    }
    for (let index in arrReqIndex) {
      rowIndex.push(this.getCondIndex(arrReqIndex[index]));
    }
    this.headerConditionInfo = deleteMany(this.headerConditionInfo, rowIndex);
  }

  /**This method returns selected condition row on the basis of selected row */
  getCondIndex(appId: any): number {
    for (let i = 0; i < this.headerConditionInfo.length; i++) {
      if (this.headerConditionInfo[i] == appId) {
        return i;
      }
    }
    return -1;
  }

  //Opens Edit conditions window
  openEditReqDialog() {
    if (!this.selectedRequestHeader || this.selectedRequestHeader.length < 1) {
      this.configUtilityService.errorMessage("Select a row to edit");
    }
    else if (this.selectedRequestHeader.length > 1) {
      this.configUtilityService.errorMessage("Select only one row to edit")
    }
    else {
      this.isNewCond = false;
      this.editConditions = true;
      // this.addReqDialog = true;
      // On opening edit conditions dialog, replacing '-' with ''
      if (this.selectedRequestHeader[0].operation == "VALUE") {
        this.selectedRequestHeader[0].btName = "";
        this.selectedRequestHeader[0].hdrValue = "";
      }
      else if (this.selectedRequestHeader[0].operation == "OCCURS") {
        this.selectedRequestHeader[0].hdrValue = "";
      }
      this.headerConditionDetail = Object.assign({}, this.selectedRequestHeader[0]);
    }

  }

  //Closing conditions dialog
  closeResponseDialog() {
    this.addReqDialog = false;
  }

  //Closing BT HTTP Headers dialog
  closeDialog2() {
    this.addResReqHeaderDialog = false;
  }





  openFileManager() {
    this.openFileExplorerDialog = true;
    this.isbTHTTPHdrBrowse = true;
  }

  /** This method is called form ProductUI config-nd-file-explorer component with the path
 ..\ProductUI\gui\src\app\modules\file-explorer\components\config-nd-file-explorer\ */

  /* dialog window & set relative path */
  uploadFile(filepath) {
    if (this.isbTHTTPHdrBrowse == true) {
      this.isbTHTTPHdrBrowse = false;
      this.openFileExplorerDialog = false;
      let fileNameWithExt: string;
      let fileExt: string;
      fileNameWithExt = filepath.substring(filepath.lastIndexOf("/"), filepath.length)
      fileExt = fileNameWithExt.substring(fileNameWithExt.lastIndexOf("."), fileNameWithExt.length);
      let check: boolean;
      if (fileExt == ".btr" || fileExt == ".txt") {
        check = true;
      }
      else {
        check = false;
      }
      if (check == false) {
        this.configUtilityService.errorMessage("File Extension(s) other than .txt and .btr are not supported");
        return;
      }

      if (filepath.includes(";")) {
        this.configUtilityService.errorMessage("Multiple files cannot be imported at the same time");
        return;
      }
      this.configKeywordsService.uploadBTHTTPHdrFile(filepath, this.profileId).subscribe(data => {
        if (data.length == this.btHttpHeadersInfo.length) {
          this.configUtilityService.errorMessage("Could not upload. This file may already be imported or contains invalid data");
        }
        this.btHttpHeadersInfo = data;
        this.modifyData1(data);
      });
    }
  }

















































  /**Assign data to BT Response Headers table */
  btResponseHeadersInfo: BTResponseHeaderData[];
  btResponseHeadersDetail: BTResponseHeaderData;
  selectedResponseHeaders: BTResponseHeaderData[];

  /** Assign data to BT Response header conditions */
  resHeaderConditionInfo: BTResponseHeaderConditions[];
  resHeaderConditionDetail: BTResponseHeaderConditions;
  selectedResponseHeader: BTResponseHeaderConditions[];

  resHeaderType: SelectItem[];
  resOperationName: SelectItem[];

  addResReqHeaderDialog2: boolean = false;
  addResDialog: boolean = false;

  editResConditions: boolean = false;

  //For checking if it is new row or existing
  isNewResHeader: boolean = false;
  isNewResCond: boolean = false;

  responseHdrDelete = [];

  //Counter for adding/editing conditions
  resCondCount: number = 0;
  resCondCountEdit: number = 0;

  //opens add Response conditions dialog
  openResDialog() {
    this.addResDialog = true;
    this.isNewResCond = true;
    this.resHeaderConditionDetail = new BTResponseHeaderConditions();
    this.loadOperationName2();
  }

  //Opens Add BT Response header dialog
  openResHeader() {
    this.btResponseHeadersDetail = new BTResponseHeaderData();
    this.resHeaderConditionDetail = new BTResponseHeaderConditions();
    this.isNewResHeader = true;
    this.addResReqHeaderDialog2 = true;
    this.resHeaderConditionInfo = [];
    if (this.btResponseHeadersInfo == undefined)
      this.btResponseHeadersInfo = [];
    this.loadOperationName2();
  }

  //To load opeartion resOperationName
  loadOperationName2() {
    this.resOperationName = [];
    var opName = ['EQUALS', 'OCCURS', 'VALUE', 'NOT_EQUALS', 'CONTAINS', 'STARTS_WITH', 'ENDS_WITH'];
    var opVal = ['EQUALS', 'OCCURS', 'VALUE', 'NOT_EQUALS', 'CONTAINS', 'STARTS_WITH', 'ENDS_WITH'];

    this.resOperationName = ConfigUiUtility.createListWithKeyValue(opName, opVal);
  }

  //Method to add and edit BT Response headers data
  saveAddEditResponseheaders() {
    //When add new Response Headers
    if (this.isNewResHeader) {

      this.saveResponseHeaders();
    }

    //When add edit Response Headers
    else {
      this.editResponseHeader();
    }
  }

  //Method to save new Response Headers
  saveResponseHeaders() {
    this.btResponseHeadersDetail.conditions = [];

    this.btResponseHeadersDetail.conditions = this.resHeaderConditionInfo;
    if (this.resHeaderConditionInfo.length == 0) {
      this.configUtilityService.errorMessage("Provide header conditions for selected Header name");
      return;
    }
    this.configKeywordsService.addBtResponseHeaders(this.btResponseHeadersDetail, this.profileId).subscribe(data => {
      this.btResponseHeadersInfo = ImmutableArray.push(this.btResponseHeadersInfo, data);
      this.configUtilityService.successMessage(addMessage);
      this.modifyData2(this.btResponseHeadersInfo);

    });
    this.addResReqHeaderDialog2 = false;
  }

  //Method to edit Response Headers
  editResponseHeader() {
    if (this.resHeaderConditionInfo.length == 0) {
      this.configUtilityService.errorMessage("Provide header conditions for selected Header name");
      return;
    }
    this.btResponseHeadersDetail.conditions = this.resHeaderConditionInfo;
    this.btResponseHeadersDetail.headerId = this.selectedResponseHeaders[0].headerId;
    /****for edit case
  *  first triggering the response to delete the  conditions and
  *  when response comes then triggering response to add the new Response Headers
  *
  */
    this.selectedResponseHeaders = [];
    this.configKeywordsService.deleteResponseHdrConditions(this.responseHdrDelete).subscribe(data => {
      let that = this;
      //Edit call, sending row data to service
      this.configKeywordsService.editBTResponseHeaders(this.btResponseHeadersDetail).subscribe(data => {

        this.btResponseHeadersInfo.map(function (val) {
          if (val.headerId == data.headerId) {
            val.conditions = data.conditions;
            val.hdrBtNames = data.hdrBtNames;
            val.headerName = data.headerName;
            val.headerValType = data.headerValType;
            val.id = data.id;
          }
          // that.modifyData(val);
          if (val.conditions != null && val.conditions.length != 0) {
            let btNames = that.getBtNames2(val.conditions);
            val.hdrBtNames = btNames
          }
          else {
            val.hdrBtNames = "NA"
          }

        });
        this.configUtilityService.successMessage(editMessage);
      });
    })
    this.closeDialog3();
  }

  //Opens edit Response Headers dialog
  openEditResponseHeader() {
    this.selectedResponseHeader = [];
    this.btResponseHeadersDetail = new BTResponseHeaderData();
    if (!this.selectedResponseHeaders || this.selectedResponseHeaders.length < 1) {
      this.configUtilityService.errorMessage("Select a row to edit");
      return;
    }
    else if (this.selectedResponseHeaders.length > 1) {
      this.configUtilityService.errorMessage("Select only one row to edit");
      return;
    }
    else {
      this.isNewResHeader = false;
      this.addResReqHeaderDialog2 = true;
      // this.editResConditions = true;
      this.isNewResCond = true;
      let that = this;
      this.responseHdrDelete = [];
      this.btResponseHeadersDetail = Object.assign({}, this.selectedResponseHeaders[0]);
      this.loadOperationName2();
      this.resHeaderConditionInfo = this.selectedResponseHeaders[0].conditions;
      //providing Id for editing conditions in edit header form
      this.resHeaderConditionInfo.map(function (val) {
        val.id = that.resCondCountEdit;
        that.resCondCountEdit = that.resCondCountEdit + 1;
      })
    }

  }

  //Method to show bt names seperated by commas in BT Response headers table
  modifyData2(data) {
    let that = this;
    data.map(function (val) {
      if (val.conditions != null && val.conditions.length != 0) {
        let btNames = that.getBtNames2(val.conditions);
        val.hdrBtNames = btNames
      }
      else {
        val.hdrBtNames = "NA"
      }
    })
    this.btResponseHeadersInfo = data
  }


  getBtNames2(data) {
    let btNamesHref = '';
    data.map(function (val, index) {
      if (index != (data.length - 1)) {
        if (val.btName == null) {
          btNamesHref = btNamesHref + " - " + ",";
        }
        else
          btNamesHref = btNamesHref + val.btName + ",";
      }
      else {
        if (val.btName == null) {
          btNamesHref = btNamesHref + " - "
        }
        else
          btNamesHref = btNamesHref + val.btName
      }
    })
    return btNamesHref;
  }

  //Method to add BT Response response conditions
  saveConditions2() {
    if (this.resHeaderConditionDetail.operation == "VALUE") {
      this.resHeaderConditionDetail.btName = "-";
      this.resHeaderConditionDetail.hdrValue = "-";
    }
    if (this.resHeaderConditionDetail.operation == "OCCURS") {
      this.resHeaderConditionDetail.hdrValue = "-";
    }
    //EDIT functionality
    if (!this.isNewResHeader) {
      if (this.editResConditions) {
        //In edit form to edit conditions
        this.isNewResCond = false;
        this.editResConditions = false;
        let that = this;
        this.resHeaderConditionInfo.map(function (val) {
          if (val.id == that.resHeaderConditionDetail.id) {
            val.btName = that.resHeaderConditionDetail.btName;
            val.hdrValue = that.resHeaderConditionDetail.hdrValue;
            val.operation = that.resHeaderConditionDetail.operation;
          }
        });
        this.selectedResponseHeader = [];
      }

      else {
        //In edit form to add conditions
        this.isNewResCond = true;
        this.resHeaderConditionDetail["id"] = this.resCondCountEdit;
        this.resHeaderConditionInfo = ImmutableArray.push(this.resHeaderConditionInfo, this.resHeaderConditionDetail);
        this.resCondCountEdit = this.resCondCountEdit + 1;
      }
    }

    //ADD functionality
    else {
      //In add form, to edit conditions
      if (this.editResConditions) {
        this.isNewResCond = false;
        this.editResConditions = false;
        let that = this;
        this.resHeaderConditionInfo.map(function (val) {
          if (val.id == that.resHeaderConditionDetail.id) {
            val.btName = that.resHeaderConditionDetail.btName;
            val.hdrValue = that.resHeaderConditionDetail.hdrValue;
            val.operation = that.resHeaderConditionDetail.operation;
          }
        });
        this.selectedResponseHeader = [];
      }

      else {
        //In add form to add conditions

        this.isNewResCond = true;
        this.resHeaderConditionDetail["id"] = this.resCondCount;
        this.resHeaderConditionInfo = ImmutableArray.push(this.resHeaderConditionInfo, this.resHeaderConditionDetail);
        this.resCondCount = this.resCondCount + 1;
      }
    }
    this.addResDialog = false;
    this.resHeaderConditionDetail = new BTResponseHeaderConditions();
  }

  //Method to delete response headers
  deleteResHdr() {
    if (!this.selectedResponseHeader || this.selectedResponseHeader.length < 1) {
      this.configUtilityService.errorMessage("Select row(s) to delete");
      return;
    }
    let selectResHdrs = this.selectedResponseHeader;
    let arrResIndex = [];
    for (let index in selectResHdrs) {
      arrResIndex.push(selectResHdrs[index]);
      if (selectResHdrs[index].hasOwnProperty('hdrCondId')) {
        this.responseHdrDelete.push(selectResHdrs[index].hdrCondId);
      }
    }
    this.deleteConditionFromTable2(arrResIndex);
    this.selectedResponseHeader = [];
  }

  /**This method is used to delete BT Response Headers*/
  deleteBTResponseHeaders(): void {
    if (!this.selectedResponseHeaders || this.selectedResponseHeaders.length < 1) {
      this.configUtilityService.errorMessage("Select row(s) to delete");
      return;
    }
    this.confirmationService.confirm({
      message: 'Do you want to delete the selected row?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        //Get Selected headers's headerId
        let selectedApp = this.selectedResponseHeaders;
        let arrAppIndex = [];
        for (let index in selectedApp) {
          arrAppIndex.push(selectedApp[index].headerId);
        }
        this.configKeywordsService.deleteBTResponseHeaders(arrAppIndex, this.profileId)
          .subscribe(data => {
            this.deleteBtResponseHeaders(arrAppIndex);
            this.selectedResponseHeaders = [];
            this.configUtilityService.infoMessage("Deleted Successfully");
          })
      },
      reject: () => {
      }
    });
  }

  /**This method is used to delete headers from Data Table */
  deleteBtResponseHeaders(arrIndex) {
    let rowIndex: number[] = [];

    for (let index in arrIndex) {
      rowIndex.push(this.getHeadersIndex2(arrIndex[index]));
    }
    this.btResponseHeadersInfo = deleteMany(this.btResponseHeadersInfo, rowIndex);
  }

  /**This method returns selected headers row on the basis of selected row */
  getHeadersIndex2(appId: any): number {
    for (let i = 0; i < this.btResponseHeadersInfo.length; i++) {
      if (this.btResponseHeadersInfo[i].headerId == appId) {
        return i;
      }
    }
    return -1;
  }

  /**This method is used to delete conditions from Data Table */
  deleteConditionFromTable2(arrResIndex: any[]): void {
    //For stores table row index
    let rowIndex: number[] = [];

    if (arrResIndex.length < 1) {
      this.configUtilityService.errorMessage("Select row(s) to delete");
      return;
    }
    for (let index in arrResIndex) {
      rowIndex.push(this.getCondIndex2(arrResIndex[index]));
    }
    this.resHeaderConditionInfo = deleteMany(this.resHeaderConditionInfo, rowIndex);
  }

  /**This method returns selected condition row on the basis of selected row */
  getCondIndex2(appId: any): number {
    for (let i = 0; i < this.resHeaderConditionInfo.length; i++) {
      if (this.resHeaderConditionInfo[i] == appId) {
        return i;
      }
    }
    return -1;
  }

  //Opens Edit conditions window
  openEditResDialog() {
    if (!this.selectedResponseHeader || this.selectedResponseHeader.length < 1) {
      this.configUtilityService.errorMessage("Select a row to edit");
    }
    else if (this.selectedResponseHeader.length > 1) {
      this.configUtilityService.errorMessage("Select only one row to edit")
    }
    else {
      this.isNewResCond = false;
      this.editResConditions = true;
      // On opening edit conditions dialog, replacing '-' with ''
      if (this.selectedResponseHeader[0].operation == "VALUE") {
        this.selectedResponseHeader[0].btName = "";
        this.selectedResponseHeader[0].hdrValue = "";
      }
      else if (this.selectedResponseHeader[0].operation == "OCCURS") {
        this.selectedResponseHeader[0].hdrValue = "";
      }
      this.resHeaderConditionDetail = Object.assign({}, this.selectedResponseHeader[0]);
    }

  }

  //Closing BT Response Headers dialog
  closeDialog3() {
    this.addResReqHeaderDialog2 = false;
  }
















  //Table data for HTTP body
  httpBodyInfo: BTHTTPBody[];

  //Table row data for HTTP Body
  httpBodyDetail: BTHTTPBody;

  //Selected row(s) data for HTTP Body
  selectedHttpBody: BTHTTPBody[];

  // Table data for HTTP Body cond
  condInfo: BTHTTPBodyConditions[] = [];

  //Table row data for HTTP Body cond
  condDetail: BTHTTPBodyConditions;

  //Selecteed row(s) data for HTTP Body cond
  selectedCond: BTHTTPBodyConditions[];

  //New HTTP Body rule
  isNewBodyRule: boolean = false;
  isNewBodyCond: boolean = false;
  addCondDialog: boolean = false;
  editcond: boolean = false;

  addNewRuleDialog: boolean = false;
  httpBodyDelete = [];

  btNameList: SelectItem[];
  opCodeName: SelectItem[];
  dataType: SelectItem[];

  //Counter for adding/editing cond
  condBodyCount: number = 0;
  condBodyCountEdit: number = 0;

  disableDataType: boolean = false;


  //Open add dialog for BT HTTP body
  openAddNewBodyRule() {
    this.isNewBodyRule = true;
    this.httpBodyDetail = new BTHTTPBody();
    this.condDetail = new BTHTTPBodyConditions();
    this.loadopCodeName()
    this.addNewRuleDialog = true;
    this.condInfo = []
    this.disableDataType = false

  }

  //Method to add and edit BT HTTP body data
  saveAddEditHttpBody() {
    //When add new HTTP body
    if (this.isNewBodyRule) {
      if (this.checkXpathAlreadyExist()) {
        return;
      }
      this.saveHttpBody();
    }

    //When add edit HTTP body
    else {
      if (this.selectedHttpBody[0].xpath != this.httpBodyDetail.xpath) {
        if (this.checkXpathAlreadyExist()) {
          return;
        }
      }
      this.editHttpBody();
    }
  }

  //Open edit dialog for BT HTTP body
  openEditHttpBody() {
    this.httpBodyDetail = new BTHTTPBody();
    this.condDetail = new BTHTTPBodyConditions();
    if (!this.selectedHttpBody || this.selectedHttpBody.length < 1) {
      this.configUtilityService.errorMessage("Select a row to edit");
      return;
    }
    else if (this.selectedHttpBody.length > 1) {
      this.configUtilityService.errorMessage("Select only one row to edit");
      return;
    }
    else {
      this.isNewBodyRule = false;
      this.addNewRuleDialog = true;
      this.isNewBodyCond = true;
      let that = this;
      this.httpBodyDelete = [];
      this.httpBodyDetail = Object.assign({}, this.selectedHttpBody[0]);
      this.loadopCodeName();
      this.condInfo = this.selectedHttpBody[0].cond;
      //providing id for editing cond in edit body form
      this.condInfo.map(function (val) {
        val.id = that.condBodyCountEdit;
        that.condBodyCountEdit = that.condBodyCountEdit + 1;
      })
    }
    this.disableDataType = true;
    // this.selectedHttpBody = [];

  }

  //opens add http body condition dialog
  openCondDialog() {
    if (this.httpBodyDetail.dataType == null) {
      this.configUtilityService.errorMessage("Select Data Type")
      return
    }
    // this.addCondDialog = true;
    // this.isNewBodyCond = true;
    // this.condDetail = new BTHTTPBodyConditions();
    // this.loadopCodeName();
  }

  //Opens Edit condition window
  openEditCondDialog() {
    if (!this.selectedCond || this.selectedCond.length < 1) {
      this.configUtilityService.errorMessage("Select a row to edit");
    }
    else if (this.selectedCond.length > 1) {
      this.configUtilityService.errorMessage("Select only one row to edit")
    }
    else {
      this.isNewBodyCond = false;
      this.editcond = true;
      // this.addCondDialog = true;

      this.condDetail = Object.assign({}, this.selectedCond[0]);
      this.loadopCodeName()
      if (this.selectedCond[0].btName == '-')
        this.condDetail.btName = '';

      if (this.selectedCond[0].value == '-')
        this.condDetail.value = '';

      this.condDetail.opCode = this.selectedCond[0].opCode;
    }

  }


  //MEthod to save/edit BT HTTP body conditions
  saveBodyConditions() {
    if (this.condDetail.btName == '' || this.condDetail.btName == null) {
      this.condDetail.btName = "-"
    }
    if (this.condDetail.opCode == 'VALUE') {
      this.condDetail.value = "-"
    }
    //EDIT functionality
    if (!this.isNewBodyRule) {
      if (this.editcond) {
        //In edit form to edit cond
        // Purpose: The below if block is required for checking redundancy for  BT Name 
        if (this.selectedCond[0].btName != this.condDetail.btName) {
          if (this.checkBodybtNameAlreadyExist()) {
            return;
          }
        }

        this.isNewBodyCond = false;
        this.editcond = false;
        let that = this;
        this.condInfo.map(function (val) {
          if (val.id == that.condDetail.id) {
            val.btName = that.condDetail.btName;
            val.value = that.condDetail.value;
            val.opCode = that.condDetail.opCode;
          }
        });
        this.selectedCond = [];
      }

      else {
        if (this.checkBodybtNameAlreadyExist()) {
          return;
        }
        this.isNewBodyCond = true;
        this.condDetail["id"] = this.condBodyCountEdit;
        this.condInfo = ImmutableArray.push(this.condInfo, this.condDetail);
        this.condBodyCountEdit = this.condBodyCountEdit + 1;
      }
    }

    //ADD functionality
    else {
      //In add form, to edit cond
      if (this.editcond) {
        // Purpose: The below if block is required for checking redundancy for Bt Name
        if (this.selectedCond[0].btName != this.condDetail.btName) {
          if (this.checkBodybtNameAlreadyExist()) {
            return;
          }
        }
        this.isNewBodyCond = false;
        this.editcond = false;
        let that = this;
        this.condInfo.map(function (val) {
          if (val.id == that.condDetail.id) {
            val.btName = that.condDetail.btName;
            val.value = that.condDetail.value;
            val.opCode = that.condDetail.opCode;
          }
        });
        this.selectedCond = [];
      }

      else {
        if (this.checkBodybtNameAlreadyExist()) {
          return;
        }
        else //In add form to add cond
        {
          this.isNewBodyCond = true;
          this.condDetail["id"] = this.condBodyCount;
          this.condInfo = ImmutableArray.push(this.condInfo, this.condDetail);
          this.condBodyCount = this.condBodyCount + 1;
        }
      }
    }
    this.disableDataType = true;
    this.addCondDialog = false;
    this.condDetail = new BTHTTPBodyConditions();
  }


  //To load operation code dropdown
  loadopCodeName() {

    this.dataType = [];
    this.condDetail.opCode = null
    var dataName = ['Numeric', 'String or Object', 'Boolean', 'Value'];
    var dataVal = ['0', '1', '2', '4'];

    this.dataType = ConfigUiUtility.createListWithKeyValue(dataName, dataVal);

    this.opCodeName = [];
    if (this.httpBodyDetail.dataType == '0') {
      var opName = ['Equals', 'Not equals', 'Less than', 'Greater than', 'Less than equal to', 'Greater than equal to', 'EXCEPTION'];
      var opVal = ['EQ', 'NE', 'LT', 'GT', 'LE', 'GE', 'EXCEPTION'];
    }
    else if (this.httpBodyDetail.dataType == '1') {
      var opName = ['EQUALS', 'NOT_EQUALS', 'CONTAINS', 'STARTS_WITH', 'ENDS_WITH', 'EXCEPTION'];
      var opVal = ['EQUALS', 'NOT_EQUALS', 'CONTAINS', 'STARTS_WITH', 'ENDS_WITH', 'EXCEPTION'];
    }
    else if (this.httpBodyDetail.dataType == '2') {
      var opName = ['TRUE', 'FALSE', 'EXCEPTION'];
      var opVal = ['TRUE', 'FALSE', 'EXCEPTION'];
    }
    else if (this.httpBodyDetail.dataType == '4') {
      var opName = ['VALUE'];
      var opVal = ['VALUE'];
    }

    this.opCodeName = ConfigUiUtility.createListWithKeyValue(opName, opVal);
  }

  //Method to check redundancy for BT Name
  checkBodybtNameAlreadyExist(): boolean {
    for (let i = 0; i < this.condInfo.length; i++) {
      if (this.condInfo[i].btName == this.condDetail.btName) {
        this.configUtilityService.errorMessage("BT Name already exist");
        return true;
      }
    }
  }

  //Method to delete http body conditions
  deleteConditions() {
    if (!this.selectedCond || this.selectedCond.length < 1) {
      this.configUtilityService.errorMessage("Select row(s) to delete");
      return;
    }
    let selectCond = this.selectedCond;
    let arrCondIndex = [];
    for (let index in selectCond) {
      arrCondIndex.push(selectCond[index]);
      if (selectCond[index].hasOwnProperty('condId')) {
        this.httpBodyDelete.push(selectCond[index].condId);
      }
    }
    this.deleteBodyConditionFromTable(arrCondIndex);
    this.selectedCond = [];
    if (this.condInfo.length == 0) {
      this.disableDataType = false;
    }
  }

  /**This method is used to delete cond from Data Table */
  deleteBodyConditionFromTable(arrCondIndex: any[]): void {
    //For stores table row index
    let rowIndex: number[] = [];

    if (arrCondIndex.length < 1) {
      this.configUtilityService.errorMessage("Select row(s) to delete");
      return;
    }
    for (let index in arrCondIndex) {
      rowIndex.push(this.getBodyCondIndex(arrCondIndex[index]));
    }
    this.condInfo = deleteMany(this.condInfo, rowIndex);
  }

  /**This method returns selected condition row on the basis of selected row */
  getBodyCondIndex(appId: any): number {
    for (let i = 0; i < this.condInfo.length; i++) {
      if (this.condInfo[i] == appId) {
        return i;
      }
    }
    return -1;
  }

  //Method to save new HTTP Body
  saveHttpBody() {
    this.httpBodyDetail.cond = [];

    this.httpBodyDetail.cond = this.condInfo;
    if (this.condInfo.length == 0) {
      this.configUtilityService.errorMessage("Provide condition(s) for selected Body rule");
      return;
    }
    this.configKeywordsService.addBtHttpBody(this.httpBodyDetail, this.profileId).subscribe(data => {
      this.httpBodyInfo = ImmutableArray.push(this.httpBodyInfo, data);

      this.configUtilityService.successMessage(addMessage);
      this.modifyBodyData(this.httpBodyInfo);

    });
    this.addNewRuleDialog = false;
  }

  //Method to check redundancy for XPath
  checkXpathAlreadyExist(): boolean {
    for (let i = 0; i < this.httpBodyInfo.length; i++) {
      if (this.httpBodyInfo[i].xpath == this.httpBodyDetail.xpath) {
        this.configUtilityService.errorMessage("X Path already exists");
        return true;
      }
    }
  }

  /**This method is used to delete BT HTTP Body*/
  deleteBTHTTPBody(): void {
    if (!this.selectedHttpBody || this.selectedHttpBody.length < 1) {
      this.configUtilityService.errorMessage("Select row(s) to delete");
      return;
    }
    this.confirmationService.confirm({
      message: 'Do you want to delete the selected row?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        //Get Selected body's id
        let selectedApp = this.selectedHttpBody;
        let arrAppIndex = [];
        for (let index in selectedApp) {
          arrAppIndex.push(selectedApp[index].id);
        }
        this.configKeywordsService.deleteBTHTTPBody(arrAppIndex, this.profileId)
          .subscribe(data => {
            this.deleteBtHttpBody(arrAppIndex);
            this.selectedHttpBody = [];
            this.configUtilityService.infoMessage("Deleted Successfully");
          })
      },
      reject: () => {
      }
    });
  }

  /**This method is used to delete body from Data Table */
  deleteBtHttpBody(arrIndex) {
    let rowIndex: number[] = [];

    for (let index in arrIndex) {
      rowIndex.push(this.getBodyIndex(arrIndex[index]));
    }
    this.httpBodyInfo = deleteMany(this.httpBodyInfo, rowIndex);
  }

  /**This method returns selected body row on the basis of selected row */
  getBodyIndex(appId: any): number {
    for (let i = 0; i < this.httpBodyInfo.length; i++) {
      if (this.httpBodyInfo[i].id == appId) {
        return i;
      }
    }
    return -1;
  }

  //Method to show bt names seperated by commas in BT HTTP body table
  modifyBodyData(data) {
    let that = this;
    data.map(function (val) {
      if (val.cond != null && val.cond.length != 0) {
        let btNames = that.getBodybtNames(val.cond);
        val.bodyBtNames = btNames
      }
      else {
        val.bodyBtNames = "NA"
      }
    })
    this.httpBodyInfo = data
  }

  getBodybtNames(data) {
    let btNamesHref = '';
    data.map(function (val, index) {
      if (index != (data.length - 1)) {
        if (val.btName == null) {
          btNamesHref = btNamesHref + " - " + ",";
        }
        else
          btNamesHref = btNamesHref + val.btName + ",";
      }
      else {
        if (val.btName == null) {
          btNamesHref = btNamesHref + " - "
        }
        else
          btNamesHref = btNamesHref + val.btName
      }
    })
    return btNamesHref;
  }

  //Method to edit HTTP Body
  editHttpBody() {
    if (this.condInfo.length == 0) {
      this.configUtilityService.errorMessage("Provide conditions for selected HTTP Body");
      return;
    }
    this.httpBodyDetail.cond = this.condInfo;
    this.httpBodyDetail.id = this.selectedHttpBody[0].id;
    /****for edit case
  *  first triggering the request to delete the  cond and
  *  when response comes then triggering request to add the new HTTP Body
  *
  */
    this.selectedHttpBody = [];
    this.configKeywordsService.deleteHTTPBodyConditions(this.httpBodyDelete).subscribe(data => {
      let that = this;
      //Edit call, sending row data to service
      this.configKeywordsService.editBTHTTPBody(this.httpBodyDetail).subscribe(data => {

        this.httpBodyInfo.map(function (val) {
          if (val.id == data.id) {
            val.cond = data.cond;
            val.bodyType = data.bodyType;
            val.xpath = data.xpath;
            val.bodyBtNames = data.bodyBtNames
            val.id = data.id;
          }
          if (val.cond != null && val.cond.length != 0) {
            let btNames = that.getBodybtNames(val.cond);
            val.bodyBtNames = btNames
          }
          else {
            val.bodyBtNames = "NA"
          }

        });
        this.configUtilityService.successMessage(editMessage);
      });
    })
    this.closeBodyDialog();
  }

  //To check if data type drop down is disabled
  checkIfDisabled() {

    if (this.disableDataType == true) {
      this.configUtilityService.infoMessage("Delete configured rule(s) to change Data Type")
      return;
    }
  }

  //Closing BT HTTP Body dialog
  closeBodyDialog() {
    this.addNewRuleDialog = false;
  }


  //When Add BT Pattern dialog cancel or(X) button is clicked then if any table has entries then delete those entries from backend
  cancelDialog() {
    console.log("called hide method")

    //Ask user if he really wants to close the dialog or not if there is entry in any table
    if (this.businessTransMethodInfo.length > 0 || this.btResponseHeadersInfo.length > 0 || this.btHttpHeadersInfo.length > 0 || this.httpBodyInfo.length > 0) {

      this.confirmationService.confirm({
        message: "Are you surer want to discard changes made?",
        header: "Discard changes",
        icon: "fa fa-trash",
        accept: () => {

          //Check if BT Method has any entries or not, if yes then delete those entries from table
          if (this.businessTransMethodInfo.length > 0) {
            let arrAppIndex = [];
            for (let index in this.businessTransMethodInfo) {
              arrAppIndex.push(this.businessTransMethodInfo[index].btMethodId);
            }
            this.configKeywordsService.deleteBusinessTransMethodData(arrAppIndex, this.profileId)
              .subscribe(data => {
                this.deleteMethodsBusinessTransactions(arrAppIndex);
              })
          }

          //Check if there is any entry in BT HTTP response headers
          if (this.btResponseHeadersInfo.length > 0) {
            let arrAppIndex = [];
            for (let index in this.btResponseHeadersInfo) {
              arrAppIndex.push(this.btResponseHeadersInfo[index].headerId);
            }
            this.configKeywordsService.deleteBTResponseHeaders(arrAppIndex, this.profileId)
              .subscribe(data => {
                this.deleteBtResponseHeaders(arrAppIndex);
              })
          }

          //Check if there is any entry of BT HTTP Request headers
          if (this.btHttpHeadersInfo.length > 0) {
            let arrAppIndex = [];
            for (let index in this.btHttpHeadersInfo) {
              arrAppIndex.push(this.btHttpHeadersInfo[index].headerId);
            }
            this.configKeywordsService.deleteBTHTTPHeaders(arrAppIndex, this.profileId)
              .subscribe(data => {
                this.deleteBtHttpHeaders(arrAppIndex);
              })
          }

          //Check if there  is any entry of BT HTTP Body
          if (this.httpBodyInfo.length > 0) {
            let arrAppIndex = [];
            for (let index in this.httpBodyInfo) {
              arrAppIndex.push(this.httpBodyInfo[index].id);
            }
            this.configKeywordsService.deleteBTHTTPBody(arrAppIndex, this.profileId)
              .subscribe(data => {
                this.deleteBtHttpBody(arrAppIndex);
              })
          }
          this.configUtilityService.infoMessage("Changes discarded")
        },
        reject: () => {
          this.addEditPatternDialog = true
        }

      })
    }
  }
}

//It will convert the values of data type from 0, 1, 2 and 4 to Numeric, String or Object, Boolean and Value respectively
@Pipe({ name: 'dataTypeVal' })
export class PipeForDataType implements PipeTransform {

  transform(value: string): string {
    let label = "";
    if (value == '0')
      label = 'Numeric';
    if (value == '1')
      label = 'String or Object';
    if (value == '2')
      label = 'Boolean';
    if (value == '4')
      label = 'Value'
    return label;
  }
}
