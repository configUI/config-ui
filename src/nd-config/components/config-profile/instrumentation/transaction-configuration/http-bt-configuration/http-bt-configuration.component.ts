import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SelectItem, ConfirmationService } from 'primeng/primeng';
import { ConfigKeywordsService } from '../../../../../services/config-keywords.service';
import { BusinessTransGlobalInfo } from '../../../../../interfaces/business-Trans-global-info';
import { BusinessTransPatternData, BusinessTransGlobalData } from '../../../../../containers/instrumentation-data';
import { ConfigUtilityService } from '../../../../../services/config-utility.service';
import { ConfigUiUtility } from '../../../../../utils/config-utility';
import { deleteMany } from '../../../../../utils/config-utility';
import { ActivatedRoute, Params } from '@angular/router';
import { KeywordData } from '../../../../../containers/keyword-data';

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

  /* Add new Pattern Dialog open */
  isNewApp: boolean = false;

  /* Assign data to Pattern data Table */
  selectedPatternData: any;
  businessTransPatternInfo: BusinessTransPatternData[];
  businessTransPatternDetail: BusinessTransPatternData;

  chkInclude: boolean = false;
  saveDisable: boolean = false;

  keywordList: string[] = ['BTRuleConfig'];
  BusinessTransGlobalPattern: Object;

  constructor(private route: ActivatedRoute, private configKeywordsService: ConfigKeywordsService, private configUtilityService: ConfigUtilityService, private confirmationService: ConfirmationService) {

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

    this.globalBtDetail.requestHeader = 'NA';

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
  }

  getKeywordData() {
    let keywordData = this.configKeywordsService.keywordData;
    this.BusinessTransGlobalPattern = {};
    this.keywordList.forEach((key) => {
      if (keywordData.hasOwnProperty(key)) {
        this.BusinessTransGlobalPattern[key] = keywordData[key];
        this.selectedQueryPattern = this.BusinessTransGlobalPattern[key].value;
      }
    });
  }

  setSelectedValueOfBT(value) {
    for (let key in this.BusinessTransGlobalPattern) {
      if (key == 'BTRuleConfig')
        this.BusinessTransGlobalPattern[key]["value"] = value;
      this.configKeywordsService.keywordData[key] = this.BusinessTransGlobalPattern[key];
    }
    this.configKeywordsService.saveProfileKeywords(this.profileId);
  }

  loadBTPatternData(): void {

    this.configKeywordsService.getBusinessTransPatternData(this.profileId).subscribe(data => this.businessTransPatternInfo = data);
  }

  doAssignBusinessTransData(data) {

    if (data._embedded.bussinessTransGlobal.length == 1) {
      this.globalBtDetail = data._embedded.bussinessTransGlobal[data._embedded.bussinessTransGlobal.length - 1];

      if (this.globalBtDetail.segmentType == "true")
        this.segmentURI = 'segmentOfURI';
      else
        this.segmentURI = 'complete';
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

    this.configUtilityService.successMessage(Messages);
    this.configKeywordsService.addGlobalData(this.globalBtDetail, this.profileId).subscribe(data => console.log(" === == ", data));
  }

  /**This method is used to add Pattern detail */
  savePattern(): void {
    if (this.chkInclude == true)
      this.businessTransPatternDetail.include = "include"
    else
      this.businessTransPatternDetail.include = "exclude"

    this.configKeywordsService.addBusinessTransPattern(this.businessTransPatternDetail, this.profileId)
      .subscribe(data => {
        //Insert data in main table after inserting application in DB
        this.businessTransPatternInfo.push(data);
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
    this.businessTransPatternDetail.headerKeyValue = this.businessTransPatternDetail.reqHeaderKey + "=" + this.businessTransPatternDetail.reqHeaderValue;
    this.businessTransPatternDetail.paramKeyValue = this.businessTransPatternDetail.reqParamKey + "=" + this.businessTransPatternDetail.reqParamValue;

    this.configKeywordsService.editBusinessTransPattern(this.businessTransPatternDetail, this.profileId)
      .subscribe(data => {
        let index = this.getPatternIndex(this.businessTransPatternDetail.id);
        this.selectedPatternData.length = 0;
        this.selectedPatternData.push(data);
        this.configUtilityService.successMessage(Messages);
        this.businessTransPatternInfo[index] = data;
      });
    this.closeDialog();
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
}
