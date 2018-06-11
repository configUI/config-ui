import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ConfirmationService, SelectItem } from 'primeng/primeng'

import { ImmutableArray } from '../../../../../utils/immutable-array';
import { ConfigUiUtility } from '../../../../../utils/config-utility';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpStatsMonitorData } from '../../../../../containers/instrumentation-data';
import { ConfigUtilityService } from '../../../../../services/config-utility.service';
import { ConfigKeywordsService } from '../../../../../services/config-keywords.service';
import { deleteMany } from '../../../../../utils/config-utility';
import { Pipe, PipeTransform } from '@angular/core';
import { Messages, descMsg , addMessage , editMessage } from '../../../../../constants/config-constant'
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { KeywordData, KeywordList } from '../../../../../containers/keyword-data';

@Component({
  selector: 'app-http-stats-monitors',
  templateUrl: './http-stats-monitors.component.html',
  styleUrls: ['./http-stats-monitors.component.css']
})
export class HttpStatsMonitorsComponent implements OnInit {

  @Input()
  profileId: number;
  @Output()
  keywordData = new EventEmitter();
  /**It stores HTTP Stats Condition-list data */
  httpStatsMonitorData: HttpStatsMonitorData[];
  /**It stores selected HTTP Stats Condition data for edit or add method-monitor */
  httpStatsMonitorDetail: HttpStatsMonitorData;
  /**It stores selected HTTP Stats Condition data */
  selectedHttpStatsMonitorData: HttpStatsMonitorData[];

  /**For add/edit HTTP-stats-monitor flag */
  isNewHttpStatsMonitor: boolean = false;
  /**For open/close add/edit http-stats-monitor detail */
  addEditHttpStatsMonitorDialog: boolean = false;
  flowDumpData: SelectItem[];
  headerType: SelectItem[];
  requestHeader: SelectItem[];
  responseHeader: SelectItem[];
  valueType: SelectItem[];
  stringOP: SelectItem[];
  numericOP: SelectItem[];
  othersOP: SelectItem[];
  selectedRequestHeader: number;
  selectedResponseHeader: number;
  selectedOthersOp: number;
  selectedNumericOp: number;
  selectedStringOp: number;
  selectedHeaderType: number;
  selectedValueType: number;
  isDisableValueType: boolean = true;
  saveDisable: boolean = false;
  subscription: Subscription;

  keywordList: string[] = ['HTTPStatsCondCfg'];
  HttpStatsMonitor: Object;
  selectedValues: boolean;
  keywordValue: Object;

  subscriptionEG: Subscription;
  enableGroupKeyword: boolean;
  isProfilePerm: boolean;

    /** To open file explorer dialog */
  openFileExplorerDialog: boolean = false; 
  isHttpstatsMonitorBrowse: boolean = false;

  importinfoDialog :boolean;

  constructor(private configKeywordsService: ConfigKeywordsService, private store: Store<KeywordList>, private confirmationService: ConfirmationService, private route: ActivatedRoute, private configUtilityService: ConfigUtilityService
  ) { }

  ngOnInit() {
    this.isProfilePerm=+sessionStorage.getItem("ProfileAccess") == 4 ? true : false;
    this.loadHttpStatsMonitorList();
    this.loadFlowDumpData();
    this.loadHeaderType();
    this.loadRequestHeader();
    this.loadResponseHeader();
    this.loadValueType();
    this.loadStringOP();
    this.loadNumericOP();
    this.loadOthersOP();
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
      });*/
      let keyVal = JSON.parse(sessionStorage.getItem('keywordValue'));
      this.keywordValue = keyVal['configkeyword'];
    }
    this.HttpStatsMonitor = {};
    this.keywordList.forEach((key) => {
      if (this.keywordValue.hasOwnProperty(key)) {
        this.HttpStatsMonitor[key] = this.keywordValue[key];
        if (this.HttpStatsMonitor[key].value == "true")
          this.selectedValues = true;
        else
          this.selectedValues = false;
      }
    });
    //  this.subscriptionEG = this.configKeywordsService.keywordGroupProvider$.subscribe(data => this.enableGroupKeyword = data.instrumentation.monitors.enable);
    this.configKeywordsService.toggleKeywordData();
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
    for (let key in this.HttpStatsMonitor) {
      if (key == 'HTTPStatsCondCfg') {
        if (this.selectedValues == true) {
          this.HttpStatsMonitor[key]["value"] = "true";
        //  this.configUtilityService.successMessage("Http Stats monitors are enabled");
        }
        else {
          this.HttpStatsMonitor[key]["value"] = "false";
         // this.configUtilityService.infoMessage("Http Stats Monitors are disabled");
        }
      }
      this.configKeywordsService.keywordData[key] = this.HttpStatsMonitor[key];
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
        filePath = filePath + "/HttpStatsCondConfig.hmc";
      }
      this.HttpStatsMonitor['HTTPStatsCondCfg'].path = filePath;
      this.keywordData.emit(this.HttpStatsMonitor)
    });
  }

  loadHttpStatsMonitorList() {
    this.route.params.subscribe((params: Params) => {
      this.profileId = params['profileId'];
      if(this.profileId == 1 || this.profileId == 777777 || this.profileId == 888888)
       this.saveDisable =  true;
    });
    this.configKeywordsService.getHttpStatsMonitorList(this.profileId).subscribe(data => {
      this.httpStatsMonitorData = data;
    });
  }

  //This method loads Flow dump Mode values
  loadFlowDumpData() {
    this.flowDumpData = [];
    var flowDumpLabel = ['Disable', 'Enable'];
    var flowDumpVal = ['0', '1'];
    this.flowDumpData = ConfigUiUtility.createListWithKeyValue(flowDumpLabel, flowDumpVal);
  }
  //This method loads Header Type values
  loadHeaderType() {
    this.headerType = [];
    var headerTypeLabel = ['Request', 'Response', 'Cookie'];
    var headerTypeVal = ['1', '2', '3'];
    this.headerType = ConfigUiUtility.createListWithKeyValue(headerTypeLabel, headerTypeVal);
  }
  //This method loads Header request drop-down values
  loadResponseHeader() {
    this.responseHeader = [];
    var resHdrLabel = ['Accept', 'Accept-Charset', 'Accept-Datetime', 'Accept-Encoding', 'Accept-Ranges', 'Access-Control-Allow-Origin',
      'Age', 'Allow', 'Authorization', 'Cache-Control', 'CavNDFPInstance', 'Connection', 'Content-Disposition', 'Content-Encoding', 'Content-Language',
      'Content-Length', 'Content-Location', 'Content-MD5', 'Content-Range', 'Content-Security-Policy', 'Content-Type', 'Cookie', 'Date', 'DNT',
      'ETag', 'Expect', 'Expires', 'Front-End-Https', 'Host', 'If-Match', 'If-Modified-Since', 'If-None-Match', 'If-Range',
      'If-Unmodified-Since', 'Last-Modified', 'Link', 'Location', 'Max-Forwards', 'Origin', 'P3P', 'Pragma', 'Proxy-Authenticate',
      'Proxy-Authorization', 'Proxy-Connection', 'Range', 'Referer', 'Refresh', 'Retry-After', 'Server', 'Set-Cookie', 'Status',
      'Strict-Transport-Security', 'TE', 'Trailer', 'Transfer-Encoding', 'Upgrade', 'User-Agent', 'Vary', 'Via', 'WWW-Authenticate', 'Warning',
      'X-ATT-DeviceId', 'X-Content-Security-Policy', 'X-Content-Type-Options', 'X-Forwarded-For', 'X-Forwarded-Proto', 'X-Frame-Options', 'X-Powered-By', 'X-Requested-With',
      'X-UA-Compatible', 'X-Wap-Profile', 'X-WebKit-CSP', 'X-XSS-Protection'];

    var resHdrVal = ['87', '84', '85', '86', '41', '42', '43', '44', '88', '45', '103', '46', '47', '48', '49', '50', '51', '52',
      '53', '54', '55', '89', '56', '90', '57', '91', '58', '92', '93', '94', '95', '96', '97', '98', '59', '60', '61', '99', '100', '62', '63', '64', '101',
      '114', '113', '65', '66', '67', '68', '69', '70', '104', '71', '72', '105', '106', '73', '74', '75', '76', '107', '77', '78', '108', '109', '79', '80', '110',
      '81', '111', '82', '83'];

    this.responseHeader = ConfigUiUtility.createListWithKeyValue(resHdrLabel, resHdrVal);
  }
  //This method loads Header request drop-down values
  loadRequestHeader() {
    this.requestHeader = [];
    var reqHdrLabel = ['Accept', 'Accept-Charset', 'Accept-Datetime', 'Accept-Encoding', 'Accept-Language', 'Authorization', 'Cache-Control', 'CavNDFPInstance', 'Connection',
      'Content-Length', 'Content-MD5', 'Content-Type', 'Cookie', 'Date', 'DNT', 'Expect', 'Front-End-Https', 'Host', 'If-Match', 'If-Modified-Since',
      'If-None-Match', 'If-Range', 'If-Unmodified-Since', 'Max-Forwards', 'Origin', 'Pragma', 'Proxy-Authorization', 'Proxy-Connection', 'Range', 'Referer',
      'TE', 'Upgrade', 'User-Agent', 'Via', 'Warning', 'X-ATT-DeviceId', 'X-Forwarded-For', 'X-Forwarded-Proto',
      'X-Requested-With', 'X-Wap-Profile'];

    var reqHdrVal = ['5', '1', '2', '3', '4', '6', '7', '112', '8', '9', '10', '11', '12', '14', '13', '15', '16', '17', '18',
      '19', '20', '21', '22', '23', '24', '25', '26', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40'];

    this.requestHeader = ConfigUiUtility.createListWithKeyValue(reqHdrLabel, reqHdrVal);
  }
  //This method loads Value types in drop-down menu
  loadValueType() {
    this.valueType = [];
    var valueTypeLabel = ['String', 'Numeric', 'Others'];
    var valueTypeVal = ['1', '2', '3'];
    this.valueType = ConfigUiUtility.createListWithKeyValue(valueTypeLabel, valueTypeVal);
  }
  //This method loads operators for String values
  loadStringOP() {
    this.stringOP = [];
    var stringOPLabel = ['=', '!=', 'contains', '!contains', 'present', '!present'];
    var stringOPVal = ['1', '2', '3', '4', '13', '14'];
    this.stringOP = ConfigUiUtility.createListWithKeyValue(stringOPLabel, stringOPVal);
  }

  loadNumericOP() {
    this.numericOP = [];
    var numericOPLabel = ['=', '!=', '<', '<=', '>', '>=', 'present', '!present'];
    var numericOPVal = ['5', '6', '7', '8', '9', '10', '15', '16'];
    this.numericOP = ConfigUiUtility.createListWithKeyValue(numericOPLabel, numericOPVal);
  }

  loadOthersOP() {
    this.othersOP = [];
    var othersOPLabel = ['PRESENT', '!PRESENT'];
    var othersOPVal = ['11', '12'];
    this.othersOP = ConfigUiUtility.createListWithKeyValue(othersOPLabel, othersOPVal);
  }

  /**For showing add HTTP Stats Condition dialog */
  openAddHTTPStatsDialog(): void {
    this.httpStatsMonitorDetail = new HttpStatsMonitorData();
    this.selectedHeaderType = 0;
    this.selectedValueType = 0;
    this.isDisableValueType = true;
    this.selectedRequestHeader = 0;
    this.selectedResponseHeader = 0;
    this.selectedHeaderType = 0;
    this.selectedStringOp = 0;
    this.selectedNumericOp = 0;
    this.selectedOthersOp = 0;
    this.isNewHttpStatsMonitor = true;
    this.addEditHttpStatsMonitorDialog = true;
  }

  /**For showing HTTP Stats Condition dialog */
  openEditHTTPStatsDialog(): void {
    if (!this.selectedHttpStatsMonitorData || this.selectedHttpStatsMonitorData.length < 1) {
      this.configUtilityService.errorMessage("Select a row to edit");
      return;
    }
    else if (this.selectedHttpStatsMonitorData.length > 1) {
      this.configUtilityService.errorMessage("Select only one row to edit");
      return;
    }
    // this.httpStatsMonitorDetail = new HttpStatsMonitorData();
    this.isNewHttpStatsMonitor = false;
    // this.httpStatsMonitorDetail = new HttpStatsMonitorData();
    this.addEditHttpStatsMonitorDialog = true;
    this.httpStatsMonitorDetail = Object.assign({}, this.selectedHttpStatsMonitorData[0]);
    if (this.httpStatsMonitorDetail.htId == 1)
      this.selectedRequestHeader = this.httpStatsMonitorDetail.hmdId;
    else
      this.selectedResponseHeader = this.httpStatsMonitorDetail.hmdId;
    this.selectedValueType = this.httpStatsMonitorDetail.valId;
    if (this.selectedValueType == 1)
      this.selectedStringOp = this.httpStatsMonitorDetail.optId;
    else if (this.selectedValueType == 2)
      this.selectedNumericOp = this.httpStatsMonitorDetail.optId;
    else
      this.selectedOthersOp = this.httpStatsMonitorDetail.optId;

  }

  saveHttpStatsMonitor(): void {
    //When add new HTTP Stats Condition
    if (this.isNewHttpStatsMonitor) {
      //Check for HttpStatsMonitor name already exist or not
      if (!this.checkHttpStatsMonitorNameAlreadyExist()) {
        this.saveHttpStatsMonitorData();
        return;
      }
    }
    /**When add edit HTTP Stats Condition */
    else {
      if (this.selectedHttpStatsMonitorData[0].conditionName != this.httpStatsMonitorDetail.conditionName) {
        if (this.checkHttpStatsMonitorNameAlreadyExist())
          return;
      }
      this.editHttpStatsMonitor();
    }
  }

  /**This method is used to validate the name of HTTP Stats Condition  already exists. */
  checkHttpStatsMonitorNameAlreadyExist(): boolean {
    for (let i = 0; i < this.httpStatsMonitorData.length; i++) {
      if (this.httpStatsMonitorData[i].conditionName == this.httpStatsMonitorDetail.conditionName) {
        this.configUtilityService.errorMessage("HTTP Stats Condition Name already exist");
        return true;
      }
    }
  }

  editHttpStatsMonitor(): void {
    if (this.httpStatsMonitorDetail.fpDumpMode == "-1") {
      this.configUtilityService.errorMessage("Please select flowpath dump mode");
      return;
    }
    if (this.httpStatsMonitorDetail.description != null) {
      if (this.httpStatsMonitorDetail.description.length > 500) {
        this.configUtilityService.errorMessage(descMsg);
        return;
      }
    }
    this.saveDataInObject();
    if(this.httpStatsMonitorDetail.compValue == null)
      this.httpStatsMonitorDetail.compValue = "";
    if(this.httpStatsMonitorDetail.description==null || this.httpStatsMonitorDetail.description=="")
      this.httpStatsMonitorDetail.description='-';
    this.configKeywordsService.editHttpStatsMonitorData(this.httpStatsMonitorDetail, this.profileId)
      .subscribe(data => {
        let index = this.getAppIndex(this.httpStatsMonitorDetail.hscid);
        this.selectedHttpStatsMonitorData.length = 0;
        // this.selectedHttpStatsMonitorData.push(data);
        this.httpStatsMonitorData = ImmutableArray.replace(this.httpStatsMonitorData, data, index);
        this.configUtilityService.successMessage(editMessage);
        // this.httpStatsMonitorData[index] = data;
      });
    this.addEditHttpStatsMonitorDialog = false;
  }

  /**This method save HTTP Stats Condition data at backend */
  saveHttpStatsMonitorData(): void {
    //Calling method which will store values in httpStatsMonitorDetail object
    this.saveDataInObject();
    if (this.httpStatsMonitorDetail.description != null) {
      if (this.httpStatsMonitorDetail.description.length > 500) {
        this.configUtilityService.errorMessage(descMsg);
        return;
      }
    }
    if(this.httpStatsMonitorDetail.compValue == null)
      this.httpStatsMonitorDetail.compValue = "";
    if(this.httpStatsMonitorDetail.description==null || this.httpStatsMonitorDetail.description=="")
      this.httpStatsMonitorDetail.description='-';
    this.configKeywordsService.addHttpStatsMonitorData(this.httpStatsMonitorDetail, this.profileId)
      .subscribe(data => {
        //Insert data in main table after inserting HTTP Stats Condition in DB
        // this.httpStatsMonitorData.push(data);
        this.httpStatsMonitorData = ImmutableArray.push(this.httpStatsMonitorData, data);
        this.httpStatsMonitorDetail.fpDumpMode = data.fpDumpMode;
        this.configUtilityService.successMessage(addMessage);
      });
    this.addEditHttpStatsMonitorDialog = false;
    // }
  }

  //Method will store the values from inputs into table
  saveDataInObject() {
    this.httpStatsMonitorDetail.valId = this.selectedValueType;
    if (this.httpStatsMonitorDetail.htId == 1)
      this.httpStatsMonitorDetail.hmdId = this.selectedRequestHeader;
    else if (this.httpStatsMonitorDetail.htId == 2)
      this.httpStatsMonitorDetail.hmdId = this.selectedResponseHeader;
    if (this.selectedValueType == 1)
      this.httpStatsMonitorDetail.optId = this.selectedStringOp;
    if (this.selectedValueType == 2)
      this.httpStatsMonitorDetail.optId = this.selectedNumericOp;
    if (this.selectedValueType == 3)
      this.httpStatsMonitorDetail.optId = this.selectedOthersOp;
  }

  /**This method is used to delete HTTP Stats Condition */
  deleteHTTPStats(): void {
    if (!this.selectedHttpStatsMonitorData || this.selectedHttpStatsMonitorData.length < 1) {
      this.configUtilityService.errorMessage("Select row(s) to delete");
      return;
    }
    this.confirmationService.confirm({
      message: 'Do you want to delete the selected row?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        //Get Selected Httpstats Hscid
        let selectedApp = this.selectedHttpStatsMonitorData;
        let arrAppIndex = [];
        for (let index in selectedApp) {
          arrAppIndex.push(selectedApp[index].hscid);
        }
        this.configKeywordsService.deleteHttpStatsMonitorData(arrAppIndex, this.profileId)
          .subscribe(data => {
            this.deleteApplications(arrAppIndex);
            this.configUtilityService.infoMessage("Deleted Successfully");
          })
        //     this.configUtilityService.infoMessage("Deleted Successfully");
      },
      reject: () => {

      }
    });
  }
  /**This method is used to delete application */
  deleteApplications(arrAppId: number[]): void {
    //For stores table row index
    let rowIndex: number[] = [];

    for (let index in arrAppId) {
      rowIndex.push(this.getAppIndex(arrAppId[index]));
    }

    this.httpStatsMonitorData = deleteMany(this.httpStatsMonitorData, rowIndex);
    this.selectedHttpStatsMonitorData = [];
  }

  /**This method returns selected application row on the basis of HsciD */
  getAppIndex(appId: any): number {
    for (let i = 0; i < this.httpStatsMonitorData.length; i++) {
      if (this.httpStatsMonitorData[i].hscid == appId) {
        return i;
      }
    } return -1;
  }
  saveHttpStatsMonitorOnFile() {
    this.saveKeywordData();
    this.configKeywordsService.saveHttpStatsMonitorData(this.profileId)
      .subscribe(data => {
	console.log("return type",data);
      })
  }

  openFileManager() {
    this.openFileExplorerDialog = true;
    this.isHttpstatsMonitorBrowse = true;
  }

  /** This method is called form ProductUI config-nd-file-explorer component with the path
 ..\ProductUI\gui\src\app\modules\file-explorer\components\config-nd-file-explorer\ */

  /* dialog window & set relative path */
  uploadFile(filepath) {
    if (this.isHttpstatsMonitorBrowse == true) {
      this.isHttpstatsMonitorBrowse = false;
      this.openFileExplorerDialog = false;
      let  str : string;
      let str1:string;
      str=filepath.substring(filepath.lastIndexOf("/"),filepath.length)
      str1=str.substring(str.lastIndexOf("."),str.length);
      let type:boolean=true;
      if(str1==".hmc"){
        type=false;
      }
      if(type){
        this.configUtilityService.errorMessage("Extension(s) other than .hmc is not supported");
        return
      }
      
      if (filepath.includes(";")) {
        this.configUtilityService.errorMessage("Multiple files cannot be imported at the same time");
        return;
      }
      this.configKeywordsService.uploadHttpStatsMonitorFile(filepath, this.profileId).subscribe(data => {
        if (data.length == this.httpStatsMonitorData.length) {
         this.configUtilityService.errorMessage("Could not upload. This file may already be imported or contains invalid data ");
         return;
        }
        this.httpStatsMonitorData=data;
        // this.exceptionMonitorData = ImmutableArray.push(this.exceptionMonitorData, data);
        this.configUtilityService.successMessage("File uploaded successfully");
       });
    }
  }

      openImportInfo(){
        this.importinfoDialog = true;
      }

  // for download Excel, word, Pdf File 
  downloadReports(reports: string) {
    let arrHeader = { "0": "HTTP Stat Name", "1": "Rule", "2": "Forcefully Dump Flowpath" , "3" : "Description"};
    let arrcolSize = { "0": 3, "1": 3, "2": 2 , "3" : 3 };
    let arrAlignmentOfColumn = { "0": "left", "1": "left", "2": "left" , "3" : "left"};
    let arrFieldName = { "0": "conditionName", "1": "condition", "2": "fpDumpMode" , "3" : "description"};
    for(let i=0;i<this.httpStatsMonitorData.length;i++){
        if(this.httpStatsMonitorData[i].fpDumpMode == "1"){
          this.httpStatsMonitorData[i].fpDumpMode = "Enable";
        }
        else{
          this.httpStatsMonitorData[i].fpDumpMode = "Disable"
        }
    }
    let object =
      {
        data: this.httpStatsMonitorData,
        headerList: arrHeader,
        colSize: arrcolSize,
        alignArr: arrAlignmentOfColumn,
        fieldName: arrFieldName,
        downloadType: reports,
        title: "HTTP Stats Monitor",
        fileName: "httpstatsmonitor",
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
   this.isHttpstatsMonitorBrowse = false;
 }
}

//It will convert the values of flowpath dump from 0, 1 and 2 to Disable, Enable and Enable Forcefully respectively
@Pipe({ name: 'fpDumpVal' })
export class PipeForFpDump implements PipeTransform {

  transform(value: string): string {
    let label = "";
    if (value == 'Enable' || value == '1')
      label = 'Enable';
    if (value == 'Disable' || value == '0')
      label = 'Disable';
    if (value == 'Enable Forcefully' || value == '2')
      label = 'Enable Forcefully';
    return label;
  }
}
