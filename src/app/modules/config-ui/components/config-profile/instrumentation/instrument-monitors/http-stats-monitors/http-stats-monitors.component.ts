import { Component, OnInit, Input } from '@angular/core';
import { ConfirmationService, SelectItem } from 'primeng/primeng'
// import { ConfigUiUtility } from '../../../../../utils/config-utility';
import { MethodMonitorData } from '../../../../../containers/instrumentation-data';
import { ConfigUtilityService } from '../../../../../services/config-utility.service';
import { ConfigKeywordsService } from '../../../../../services/config-keywords.service';

@Component({
  selector: 'app-http-stats-monitors',
  templateUrl: './http-stats-monitors.component.html',
  styleUrls: ['./http-stats-monitors.component.css']
})
export class HttpStatsMonitorsComponent implements OnInit {

  @Input()
  profileId: number;
  /**It stores HTTP Stats Condition-list data */
  methodMonitorData: MethodMonitorData[];
  /**It stores selected HTTP Stats Condition data for edit or add method-monitor */
  methodMonitorDetail: MethodMonitorData;
  /**It stores selected HTTP Stats Condition data */
  selectedMethodMonitorData: MethodMonitorData[];

  /**For add/edit method-monitor flag */
  isNewMethodMonitor: boolean = false;
  /**For open/close add/edit method-monitor detail */
  addEditMethodMonitorDialog: boolean = false;
  flowDumpData: SelectItem[];
  headerType: SelectItem[];
  requestHeader: SelectItem[];

  constructor(private configKeywordsService: ConfigKeywordsService, private confirmationService: ConfirmationService, private configUtilityService: ConfigUtilityService) { }

  ngOnInit() {
    this.loadFlowDumpData();
    this.loadHeaderType();
    // this.loadRequestHeader();
  }

  //This method loads Flow dump Mode values
  loadFlowDumpData() {
    this.flowDumpData = [];
    this.flowDumpData.push(
      { value: -1, label: '--Select--' },
      { value: 0, label: '0' },
      { value: 1, label: '1' },
      { value: 2, label: '2' });
  }
  //This method loads Header Type values
  loadHeaderType() {
    this.headerType = [];
    this.headerType.push(
      { value: -1, label: '--Select--' },
      { value: 1, label: 'Request' },
      { value: 2, label: 'Response' },
      { value: 3, label: 'Cookie' });
  }

  loadRequestHeader() {
    // this.requestHeader = [];
    // var reqHdrLabel = ['Accept-Charset', 'Accept-Datetime', 'Accept-Encoding', 'Accept-Language', 'Accept', 'Authorization',
    //   'Cache-Control', 'Connection', 'Content-Length', 'Content-MD5', 'Content-Type', 'Cookie', 'DNT', 'Date', 'Expect',
    //   'Front-End-Https', 'Host', 'If-Match', 'If-Modified-Since', 'If-None-Match', 'If-Range', 'If-Unmodified-Since',
    //   'Max-Forwards', 'Origin', 'Pragma', 'Proxy-Authorization', 'If-Range', 'Proxy-Connection', 'Range', 'Referer',
    //   'TE', 'Upgrade', 'User-Agent', 'Via', 'Warning', 'X-ATT-DeviceId', 'X-Forwarded-For', 'X-Forwarded-Proto',
    //   'X-Requested-With', 'X-Wap-Profile'];
    // var reqHdrVal = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40'];

    // this.requestHeader = this.configUiUtility.cre

  }

  /**For showing add HTTP Stats Condition dialog */
  openAddHTTPStatsDialog(): void {
    this.methodMonitorDetail = new MethodMonitorData();
    this.isNewMethodMonitor = true;
    this.addEditMethodMonitorDialog = true;
  }

  /**For showing HTTP Stats Condition dialog */
  openEditHTTPStatsDialog(): void {
    console.log("hello------------", this.selectedMethodMonitorData)
    if (!this.selectedMethodMonitorData || this.selectedMethodMonitorData.length < 1) {
      this.configUtilityService.errorMessage("Select a field to edit");
      return;
    }
    else if (this.selectedMethodMonitorData.length > 1) {
      this.configUtilityService.errorMessage("Select only one field to edit");
      return;
    }
    this.methodMonitorDetail = new MethodMonitorData();
    this.isNewMethodMonitor = false;
    this.methodMonitorDetail = new MethodMonitorData();
    this.addEditMethodMonitorDialog = true;
    this.methodMonitorDetail = Object.assign({}, this.selectedMethodMonitorData[0]);
  }

  saveMethodMonitor(): void {
    //When add new HTTP Stats Condition 
    if (this.isNewMethodMonitor) {
      //Check for MethodMonitor name already exist or not
      if (!this.checkMethodMonitorNameAlreadyExist()) {
        this.saveMethodMonitorData();
        return;
      }
    }
    /**When add edit HTTP Stats Condition */
    else {
      if (this.selectedMethodMonitorData[0].methodName != this.methodMonitorDetail.methodName) {
        if (this.checkMethodMonitorNameAlreadyExist())
          return;
      }
      this.editMethodMonitor();
    }
  }

  /**This method is used to validate the name of HTTP Stats Condition  already exists. */
  checkMethodMonitorNameAlreadyExist(): boolean {
    for (let i = 0; i < this.methodMonitorData.length; i++) {
      if (this.methodMonitorData[i].methodDisplayName == this.methodMonitorDetail.methodDisplayName) {
        this.configUtilityService.errorMessage("HTTP Stats Condition Name already exist");
        return true;
      }
    }
  }
  editMethodMonitor(): void {
    this.configKeywordsService.editMethodMonitorData(this.methodMonitorDetail)
      .subscribe(data => {
        console.log("edit ", data);
        let index = this.getMethodMonitorIndex();
        this.selectedMethodMonitorData.length = 0;
        this.selectedMethodMonitorData.push(data);
        console.log("index", index);
        this.methodMonitorData[index] = data;
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
  /**This method save HTTP Stats Condition data at backend */
  saveMethodMonitorData(): void {
    this.configKeywordsService.addMethodMonitorData(this.methodMonitorDetail, this.profileId)
      .subscribe(data => {
        //Insert data in main table after inserting HTTP Stats Condition in DB
        this.methodMonitorData.push(data);
      });
    this.addEditMethodMonitorDialog = false;
  }

  /**This method is used to delete HTTP Stats Condition */
  deleteHTTPStats(): void {
    console.log("hello--------->")
    if (!this.selectedMethodMonitorData || this.selectedMethodMonitorData.length < 1) {
      this.configUtilityService.errorMessage("Select fields to delete");
      return;
    }
    console.log("data for deletion is--------->", this.selectedMethodMonitorData);
    // this.confirmationService.confirm({
    //   message: 'Do you want to delete the selected record?',
    //   header: 'Delete Confirmation',
    //   icon: 'fa fa-trash',
    //   accept: () => {
    //     this.configKeywordsService.deleteMethodMonitorData(this.methodMonitorDetail)
    //       .subscribe(data => {
    //         console.log("deleteMethodMonitor", "data", data);
    //       })
    //     this.configUtilityService.infoMessage("Delete Successfully");
    //   },
    //   reject: () => {

    //   }
    // });
  }
}