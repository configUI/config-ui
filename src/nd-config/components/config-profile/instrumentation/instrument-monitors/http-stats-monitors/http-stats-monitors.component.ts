import { Component, OnInit, Input } from '@angular/core';
import { ConfirmationService, SelectItem } from 'primeng/primeng'
import { ConfigUiUtility } from '../../../../../utils/config-utility';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpStatsMonitorData } from '../../../../../containers/instrumentation-data';
import { ConfigUtilityService } from '../../../../../services/config-utility.service';
import { ConfigKeywordsService } from '../../../../../services/config-keywords.service';
import { deleteMany } from '../../../../../utils/config-utility';

@Component({
  selector: 'app-http-stats-monitors',
  templateUrl: './http-stats-monitors.component.html',
  styleUrls: ['./http-stats-monitors.component.css']
})
export class HttpStatsMonitorsComponent implements OnInit {

  @Input()
  profileId: number;
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

  constructor(private configKeywordsService: ConfigKeywordsService, private confirmationService: ConfirmationService, private route: ActivatedRoute, private configUtilityService: ConfigUtilityService
  ) { }

  ngOnInit() {
    this.loadHttpStatsMonitorList();
    this.loadFlowDumpData();
    this.loadHeaderType();
    this.loadRequestHeader();
    this.loadResponsetHeader();
    this.loadValueType();
    this.loadStringOP();
    this.loadNumericOP();
    this.loadOthersOP();
  }

   loadHttpStatsMonitorList() {
     this.route.params.subscribe((params: Params) => {
      this.profileId = params['profileId'];
    });
    this.configKeywordsService.getHttpStatsMonitorList(this.profileId).subscribe(data => {
      this.httpStatsMonitorData = data;
    });
  }

  //This method loads Flow dump Mode values
  loadFlowDumpData() {
    this.flowDumpData = [];
    var flowDumpLabel = ['0', '1', '2'];
    var flowDumpVal = ['0', '1', '2'];
    this.flowDumpData = ConfigUiUtility.createListWithKeyValue(flowDumpLabel,flowDumpVal);
  }
  //This method loads Header Type values
  loadHeaderType() {
    this.headerType = [];
    var headerTypeLabel = ['Request', 'Response', 'Cookie'];
    var headerTypeVal = ['1', '2', '3'];
    this.headerType = ConfigUiUtility.createListWithKeyValue(headerTypeLabel,headerTypeVal);
  }
  //This method loads Header request drop-down values
  loadRequestHeader() {
    this.requestHeader = [];
    var reqHdrLabel = ['Accept-Charset', 'Accept-Datetime', 'Accept-Encoding', 'Accept-Language', 'Accept', 'Authorization',
      'Cache-Control', 'Connection', 'Content-Length', 'Content-MD5', 'Content-Type', 'Cookie', 'DNT', 'Date', 'Expect',
      'Front-End-Https', 'Host', 'If-Match', 'If-Modified-Since', 'If-None-Match', 'If-Range', 'If-Unmodified-Since',
      'Max-Forwards', 'Origin', 'Pragma', 'Proxy-Authorization', 'If-Range', 'Proxy-Connection', 'Range', 'Referer',
      'TE', 'Upgrade', 'User-Agent', 'Via', 'Warning', 'X-ATT-DeviceId', 'X-Forwarded-For', 'X-Forwarded-Proto',
      'X-Requested-With', 'X-Wap-Profile'];

    var reqHdrVal = ['41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58',
      '59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83'];

    this.requestHeader = ConfigUiUtility.createListWithKeyValue(reqHdrLabel, reqHdrVal);
  }
  //This method loads Header response drop-down values
  loadResponsetHeader() {
    this.responseHeader = [];
    var resHdrLabel = ['Accept-Ranges', 'Access-Control-Allow-Origin', 'Age', 'Allow', 'Cache-Control', 'Connection', 'Content-Disposition', 'Content-Encoding',
      'Content-Language', 'Content-Length', 'Content-Location', 'Content-MD5', 'Content-Range', 'Content-Security-Policy', 'Content-Type', 'Date', 'ETag', 'Expires', 'Last-Modified',
      'Link', 'Location', 'P3P', 'Pragma', 'Proxy-Authenticate', 'Refresh', 'Retry-After', 'Server', 'Set-Cookie', 'Status', 'Strict-Transport-Security',
      'Trailer', 'Transfer-Encoding', 'Vary', 'Via', 'WWW-Authenticate', 'Warning', 'X-Content-Security-Policy', 'X-Content-Type-Options',
      'X-Frame-Options', 'X-Powered-By', 'X-UA-Compatible', 'X-WebKit-CSP', 'X-XSS-Protection'];

    var resHdrVal = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18',
      '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40'];

    this.responseHeader = ConfigUiUtility.createListWithKeyValue(resHdrLabel, resHdrVal);
  }
  //This method loads Value types in drop-down menu
  loadValueType() {
    this.valueType = [];
    var valueTypeLabel = ['String', 'Numeric', 'Others'];
    var valueTypeVal = ['1', '2', '3'];
    this.valueType = ConfigUiUtility.createListWithKeyValue(valueTypeLabel,valueTypeVal);
  }
//This method loads operators for String values
  loadStringOP(){
    this.stringOP = [];
    var stringOPLabel = ['=', '!=', 'contains','!contains'];
    var stringOPVal = ['1', '2', '3', '4'];
    this.stringOP = ConfigUiUtility.createListWithKeyValue(stringOPLabel,stringOPVal);
  }

  loadNumericOP(){
      this.numericOP = [];
    var numericOPLabel = ['=', '!=', '<', '<=', '>', '>='];
    var numericOPVal = ['1', '2', '3', '4', '5', '6'];
    this.numericOP = ConfigUiUtility.createListWithKeyValue(numericOPLabel,numericOPVal);
  }

  loadOthersOP(){
    this.othersOP = [];
    var othersOPLabel = ['PRESENT','!PRESENT'];
    var othersOPVal = ['1', '2'];
    this.othersOP = ConfigUiUtility.createListWithKeyValue(othersOPLabel,othersOPVal);

  }

  /**For showing add HTTP Stats Condition dialog */
  openAddHTTPStatsDialog(): void {
    this.httpStatsMonitorDetail = new HttpStatsMonitorData();
    this.isNewHttpStatsMonitor = true;
    this.addEditHttpStatsMonitorDialog = true;
  }

  /**For showing HTTP Stats Condition dialog */
  openEditHTTPStatsDialog(): void {
      if (!this.selectedHttpStatsMonitorData || this.selectedHttpStatsMonitorData.length < 1) {
      this.configUtilityService.errorMessage("Select a field to edit");
      return;
    }
    else if (this.selectedHttpStatsMonitorData.length > 1) {
      this.configUtilityService.errorMessage("Select only one field to edit");
      return;
    }
    this.httpStatsMonitorDetail = new HttpStatsMonitorData();
    this.isNewHttpStatsMonitor = false;
    this.httpStatsMonitorDetail = new HttpStatsMonitorData();
    this.addEditHttpStatsMonitorDialog = true;
    this.httpStatsMonitorDetail = Object.assign({}, this.selectedHttpStatsMonitorData[0]);
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
    this.configKeywordsService.editHttpStatsMonitorData(this.httpStatsMonitorDetail)
      .subscribe(data => {
        console.log("edit ", data);
        let index = this.getMethodMonitorIndex();
        this.selectedHttpStatsMonitorData.length = 0;
        this.selectedHttpStatsMonitorData.push(data);
        console.log("index", index);
        this.httpStatsMonitorData[index] = data;
      });
    this.addEditHttpStatsMonitorDialog = false;
  }

  getMethodMonitorIndex(): number {
    if (this.httpStatsMonitorDetail) {
      let statsId = this.httpStatsMonitorDetail.valId;
      for (let i = 0; i < this.httpStatsMonitorData.length; i++) {
        if (this.httpStatsMonitorData[i].valId == statsId) {
          return i;
        }
      }
    }
    return -1;
  }
  /**This method save HTTP Stats Condition data at backend */
  saveHttpStatsMonitorData(): void {
    console.log("datavaaallues",this.httpStatsMonitorDetail);
    this.configKeywordsService.addHttpStatsMonitorData(this.httpStatsMonitorDetail, this.profileId)
      .subscribe(data => {
        //Insert data in main table after inserting HTTP Stats Condition in DB
        this.httpStatsMonitorData.push(data);
      });
    this.addEditHttpStatsMonitorDialog = false;
  }

  /**This method is used to delete HTTP Stats Condition */
  deleteHTTPStats(): void {
    console.log("hello--------->")
    if (!this.selectedHttpStatsMonitorData || this.selectedHttpStatsMonitorData.length < 1) {
      this.configUtilityService.errorMessage("Select fields to delete");
      return;
    }
    console.log("data for deletion is--------->", this.selectedHttpStatsMonitorData);
    this.confirmationService.confirm({
      message: 'Do you want to delete the selected record?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      // accept: () => {
      //   this.configKeywordsService.deleteHttpStatsMonitorData(this.selectedHttpStatsMonitorData)
      //     .subscribe(data => {
      //       console.log("deleteHttpStatsMonitor", "data", data);
      //     })
      //   this.configUtilityService.infoMessage("Deleted Successfully");
      // },
       accept: () => {
        //Get Selected Applications's AppId
        let selectedApp = this.selectedHttpStatsMonitorData;
        let arrAppIndex = [];
        for (let index in selectedApp) {
          arrAppIndex.push(selectedApp[index].hscid);
        }
        console.log("pppapsaps",arrAppIndex);
        this.configKeywordsService.deleteHttpStatsMonitorData(arrAppIndex,this.profileId)
          .subscribe(data => {
            this.deleteApplications(arrAppIndex);
          })
        this.configUtilityService.infoMessage("Delete Successfully");
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
  }

   /**This method returns selected application row on the basis of AppId */
  getAppIndex(appId: number): number {
    for (let i = 0; i < this.httpStatsMonitorData.length; i++) {
      if (this.httpStatsMonitorData[i].hscid == appId) {
        return i;
      }
    }
    return -1;
  }
}