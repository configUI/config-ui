import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import { ConfigBusinessTranService } from '../../../../../services/config-business-trans-global-service';
import { BusinessTransGlobalInfo } from '../../../../../interfaces/business-Trans-global-info';
import { BusinessTransPatternInfo } from '../../../../../interfaces/business-trans-pattern-info';
import { BusinessTransGlobalData } from '../../../../../containers/business-trans-global-data';
import { BusinessTransPatternData } from '../../../../../containers/bussiness-trans-pattern-data';
@Component({
  selector: 'app-http-bt-configuration',
  templateUrl: './http-bt-configuration.component.html',
  styleUrls: ['./http-bt-configuration.component.css']
})
export class HTTPBTConfigurationComponent implements OnInit {

  /* variable Preselection for URI without Query Parameters */
  selectedQueryPattern: string = 'uriWithoutQueryParameters';

  /* variable for Pattern  */
  selectedUri: string = 'segmentOfURI';

  /* variable for Pattern  */
  selectedDynamicRequest: string = "httpMethod";

  /* Assign default value to slowTransaction */
  slowTransaction: string = '3000';

  /* Assign default value to slowTransaction */
  verySlowTransaction: string = '5000';

  /* Assign default value to slowTransaction */
  segmentURITrans: string = '2';

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

  /* Add new Pattern Dialog open */
  isNewApp: boolean = false;

  /* Assign data to Pattern data Table */
  businessTransPatternInfo: BusinessTransPatternInfo;

  constructor(private configBusinessTranService: ConfigBusinessTranService) {
    this.segmentList = [];
    this.segmentList.push({ label: 'First', value: 'first' });
    this.segmentList.push({ label: 'Last', value: 'last' });
    this.segmentList.push({ label: 'Segment Number', value: 'segmentNumber' });

    this.matchModeList = [];
    this.matchModeList.push({ label: 'Exact Match', value: 'exactMatch' });
    this.matchModeList.push({ label: 'Starts Match', value: 'startsMatch' });

    this.methodTypeList = [];
    this.methodTypeList.push({ label: 'GET', value: 'get' });
    this.methodTypeList.push({ label: 'PUT', value: 'put' });
    this.methodTypeList.push({ label: 'POST', value: 'post' });
    this.methodTypeList.push({ label: 'DELETE', value: 'delete' });
    this.methodTypeList.push({ label: 'HEAD', value: 'head' });
    this.methodTypeList.push({ label: 'TRACE', value: 'trace' });
    this.methodTypeList.push({ label: 'CONNECT', value: 'connect' });
    this.methodTypeList.push({ label: 'OPTIONS', value: 'options' });

  }

  ngOnInit() {

    this.configBusinessTranService.getBusinessTransGlobalData().subscribe(data => { this.doAssignBusinessTransData(data) });
    this.loadBTPatternData();
  }


  loadBTPatternData(): void {
    this.configBusinessTranService.getBusinessTransPatternData().subscribe(data => this.businessTransPatternInfo = data);
  }

  doAssignBusinessTransData(data) {
    console.log("businessTransGlobalData == ", data);
  }

  /* Save all values of Business Transaction */
  saveBusinessTransaction() {

  }

  openAppDialog() {
    this.isNewApp = true;
    this.addEditPatternDialog = true;
  }
}
