import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ConfirmationService, SelectItem } from 'primeng/primeng'
import { ConfigUiUtility } from '../../../../../utils/config-utility';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpStatsMonitorData } from '../../../../../containers/instrumentation-data';
import { ConfigUtilityService } from '../../../../../services/config-utility.service';
import { ConfigKeywordsService } from '../../../../../services/config-keywords.service';
import { deleteMany } from '../../../../../utils/config-utility';
import { Pipe, PipeTransform } from '@angular/core';
import { Messages, DescMsg } from '../../../../../constants/config-constant'

@Component({
  selector: 'app-http-stats-monitors',
  templateUrl: './http-stats-monitors.component.html',
  styleUrls: ['./http-stats-monitors.component.css']
})
export class HttpStatsMonitorsComponent implements OnInit {

  @Input()
  profileId: number;
  // @Output()
  // keywordData = new EventEmitter();
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

  // keywordList: string[] = ['HTTPStatsCondCfg'];
  // HttpStatsCond: Object;
  // selectedValues: boolean;
  // keywordValue:Object;

  constructor(private configKeywordsService: ConfigKeywordsService, private confirmationService: ConfirmationService, private route: ActivatedRoute, private configUtilityService: ConfigUtilityService
  ) { }

  ngOnInit() {
    this.loadHttpStatsMonitorList();
    this.loadFlowDumpData();
    this.loadHeaderType();
    this.loadRequestHeader();
    this.loadResponseHeader();
    this.loadValueType();
    this.loadStringOP();
    this.loadNumericOP();
    this.loadOthersOP();
  }

  loadHttpStatsMonitorList() {
    this.route.params.subscribe((params: Params) => {
      this.profileId = params['profileId'];
      this.saveDisable = this.profileId == 1 ? true : false;
    });
    this.configKeywordsService.getHttpStatsMonitorList(this.profileId).subscribe(data => {
      this.httpStatsMonitorData = data;
    });
  }

  //This method loads Flow dump Mode values
  loadFlowDumpData() {
    this.flowDumpData = [];
    var flowDumpLabel = ['--Select--', 'Disable', 'Enable', 'Enable Forcefully'];
    var flowDumpVal = ['-1', '0', '1', '2'];
    this.flowDumpData = ConfigUiUtility.createListWithKeyValue(flowDumpLabel, flowDumpVal);
  }
  //This method loads Header Type values
  loadHeaderType() {
    this.headerType = [];
    var headerTypeLabel = ['--Select--', 'Request', 'Response', 'Cookie'];
    var headerTypeVal = ['0', '1', '2', '3'];
    this.headerType = ConfigUiUtility.createListWithKeyValue(headerTypeLabel, headerTypeVal);
  }
  //This method loads Header request drop-down values
  loadResponseHeader() {
    this.responseHeader = [];
    var resHdrLabel = ['--Select--', 'Accept-Charset', 'Accept-Datetime', 'Accept-Encoding', 'Accept-Language', 'Accept', 'Authorization',
      'Cache-Control', 'Connection', 'Content-Length', 'Content-MD5', 'Content-Type', 'Cookie', 'DNT', 'Date', 'Expect',
      'Front-End-Https', 'Host', 'If-Match', 'If-Modified-Since', 'If-None-Match', 'If-Range', 'If-Unmodified-Since',
      'Max-Forwards', 'Origin', 'Pragma', 'Proxy-Authorization', 'If-Range', 'Proxy-Connection', 'Range', 'Referer',
      'TE', 'Upgrade', 'User-Agent', 'Via', 'Warning', 'X-ATT-DeviceId', 'X-Forwarded-For', 'X-Forwarded-Proto',
      'X-Requested-With', 'X-Wap-Profile'];

    var resHdrVal = ['0', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58',
      '59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83'];

    this.responseHeader = ConfigUiUtility.createListWithKeyValue(resHdrLabel, resHdrVal);
  }
  //This method loads Header request drop-down values
  loadRequestHeader() {
    this.requestHeader = [];
    var reqHdrLabel = ['--Select--', 'Accept-Ranges', 'Access-Control-Allow-Origin', 'Age', 'Allow', 'Cache-Control', 'Connection', 'Content-Disposition', 'Content-Encoding',
      'Content-Language', 'Content-Length', 'Content-Location', 'Content-MD5', 'Content-Range', 'Content-Security-Policy', 'Content-Type', 'Date', 'ETag', 'Expires', 'Last-Modified',
      'Link', 'Location', 'P3P', 'Pragma', 'Proxy-Authenticate', 'Refresh', 'Retry-After', 'Server', 'Set-Cookie', 'Status', 'Strict-Transport-Security',
      'Trailer', 'Transfer-Encoding', 'Vary', 'Via', 'WWW-Authenticate', 'Warning', 'X-Content-Security-Policy', 'X-Content-Type-Options',
      'X-Frame-Options', 'X-Powered-By', 'X-UA-Compatible', 'X-WebKit-CSP', 'X-XSS-Protection'];

    var reqHdrVal = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18',
      '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40'];

    this.requestHeader = ConfigUiUtility.createListWithKeyValue(reqHdrLabel, reqHdrVal);
  }
  //This method loads Value types in drop-down menu
  loadValueType() {
    this.valueType = [];
    var valueTypeLabel = ['--Select--', 'String', 'Numeric', 'Others'];
    var valueTypeVal = ['0', '1', '2', '3'];
    this.valueType = ConfigUiUtility.createListWithKeyValue(valueTypeLabel, valueTypeVal);
  }
  //This method loads operators for String values
  loadStringOP() {
    this.stringOP = [];
    var stringOPLabel = ['--Select--', '=', '!=', 'contains', '!contains'];
    var stringOPVal = ['0', '1', '2', '3', '4'];
    this.stringOP = ConfigUiUtility.createListWithKeyValue(stringOPLabel, stringOPVal);
  }

  loadNumericOP() {
    this.numericOP = [];
    var numericOPLabel = ['--Select--', '=', '!=', '<', '<=', '>', '>='];
    var numericOPVal = ['0', '1', '2', '3', '4', '5', '6'];
    this.numericOP = ConfigUiUtility.createListWithKeyValue(numericOPLabel, numericOPVal);
  }

  loadOthersOP() {
    this.othersOP = [];
    var othersOPLabel = ['--Select--', 'PRESENT', '!PRESENT'];
    var othersOPVal = ['0', '1', '2'];
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
    if (this.httpStatsMonitorDetail.description.length > 300) {
      this.configUtilityService.errorMessage(DescMsg);
      return;
    }
    this.configKeywordsService.editHttpStatsMonitorData(this.httpStatsMonitorDetail, this.profileId)
      .subscribe(data => {
        let index = this.getAppIndex(this.httpStatsMonitorDetail.hscid);
        this.selectedHttpStatsMonitorData.length = 0;
        this.selectedHttpStatsMonitorData.push(data);
        this.configUtilityService.successMessage(Messages);
        this.httpStatsMonitorData[index] = data;
      });
    this.addEditHttpStatsMonitorDialog = false;
  }

  /**This method save HTTP Stats Condition data at backend */
  saveHttpStatsMonitorData(): void {
    //Calling method which will store values in httpStatsMonitorDetail object
    this.saveDataInObject();
    if (this.httpStatsMonitorDetail.description.length > 300) {
      this.configUtilityService.errorMessage(DescMsg);
      return;
    }
    this.configKeywordsService.addHttpStatsMonitorData(this.httpStatsMonitorDetail, this.profileId)
      .subscribe(data => {
        //Insert data in main table after inserting HTTP Stats Condition in DB
        this.httpStatsMonitorData.push(data);
        this.httpStatsMonitorDetail.fpDumpMode = data.fpDumpMode;
        this.configUtilityService.successMessage(Messages);
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
          })
        this.configUtilityService.infoMessage("Deleted Successfully !!!");
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
