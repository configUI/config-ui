import { Component, OnInit } from '@angular/core';
import { SelectItem, ConfirmationService } from 'primeng/primeng';
import { ConfigKeywordsService } from '../../../../../services/config-keywords.service';
import { BusinessTransGlobalInfo } from '../../../../../interfaces/business-Trans-global-info';
//import { BusinessTransPatternInfo } from '../../../../../interfaces/business-trans-pattern-info';
//import { BusinessTransGlobalData } from '../../../../../containers/business-trans-global-data';
import { BusinessTransPatternData, BusinessTransGlobalData } from '../../../../../containers/instrumentation-data';
import { ConfigUtilityService } from '../../../../../services/config-utility.service';
import { ConfigUiUtility } from '../../../../../utils/config-utility';
import { deleteMany } from '../../../../../utils/config-utility';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-http-bt-configuration',
  templateUrl: './http-bt-configuration.component.html',
  styleUrls: ['./http-bt-configuration.component.css']
})
export class HTTPBTConfigurationComponent implements OnInit {

  profileId: number;

  /* Assign data to Global Bt */
  globalBtDetail: BusinessTransGlobalData;

  /* variable Preselection for URI without Query Parameters */
  selectedQueryPattern: string = 'uriWithoutQueryParameters';

  /* variable for Global BT  */
  segmentURI: string;
  complete: string;
  httpMethod: string;

  /* variable for Global BT  */
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
  businessTransPatternInfo: BusinessTransPatternData[];
  selectedPatternData: any;
  businessTransPatternDetail: BusinessTransPatternData;

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

    this.globalBtDetail = new BusinessTransGlobalData();

    /* Assign default value to slowTransaction */
    this.globalBtDetail.slowTransaction = '3000';

    /* Assign default value to slowTransaction */
    this.globalBtDetail.verySlowTransaction = '5000';

    /* Assign default value to slowTransaction */
    this.globalBtDetail.segmentValue = '2';

  }

  ngOnInit() {
     this.route.params.subscribe((params: Params) => {
      this.profileId = params['profileId'];
    });
    this.configKeywordsService.getBusinessTransGlobalData().subscribe(data => { this.doAssignBusinessTransData(data) });
    this.loadBTPatternData();
  }


  loadBTPatternData(): void {
    this.configKeywordsService.getBusinessTransPatternData(this.profileId).subscribe(data => this.businessTransPatternInfo = data);
  }

  doAssignBusinessTransData(data) {

    this.globalBtDetail = data._embedded.bussinessTransGlobal[0];
    console.log("this.globalBtDetail.segmentURI--",this.globalBtDetail.segmentURI)
    if (this.globalBtDetail.segmentURI == 'true')
      this.segmentURI = 'segmentOfURI';
    else
      this.segmentURI = 'complete';

  console.log("this.globalBtDetail.segmentURI--",this.segmentURI)
    /* variable for Global BT  */
    if (this.globalBtDetail.httpMethod == true)
      this.httpMethod = 'httpMethod';
  }

  /* Save all values of Business Transaction */
  saveBusinessTransaction() {

    if (this.segmentURI == 'segmentOfURI')
      this.globalBtDetail.segmentURI = "true";
    else
      this.globalBtDetail.segmentURI = "false";

    if (this.segmentURI == 'complete')
      this.globalBtDetail.complete = "true";
    else
      this.globalBtDetail.complete = "false";

    this.configKeywordsService.addGlobalData(this.globalBtDetail, this.profileId).subscribe(data => console.log(data));
  }

  /**This method is used to add Pattern detail */
  savePattern(): void {
    if (this.businessTransPatternDetail.include == "true")
      this.businessTransPatternDetail.include = "include"
    else
      this.businessTransPatternDetail.include = "exclude"

    this.configKeywordsService.addBusinessTransPattern(this.businessTransPatternDetail, this.profileId)
      .subscribe(data => {
        //Insert data in main table after inserting application in DB
         this.businessTransPatternInfo.push(data);
      });
    this.closeDialog();
  }

  /* Open Dialog for Add Pattern */
  openAddPatternDialog() {
    this.businessTransPatternDetail = new BusinessTransPatternData();
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

    this.isNewApp = false;
    this.addEditPatternDialog = true;
    this.businessTransPatternDetail = Object.assign({}, this.selectedPatternData[0]);
  }

  /**This method is used to edit Pattern detail */
  editApp(): void {
    this.configKeywordsService.editBusinessTransPattern(this.businessTransPatternDetail , this.profileId)
      .subscribe(data => {
        let index = this.getPatternIndex(this.businessTransPatternDetail.id);
        this.selectedPatternData.length = 0;
        this.selectedPatternData.push(data);
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
      if (this.businessTransPatternInfo[0].id != this.businessTransPatternDetail.id) {
        if (this.checkAppNameAlreadyExist())
          return;
      }
      this.editApp();
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
      message: 'Do you want to delete the selected record?',
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
            this.configUtilityService.infoMessage("Delete Successfully");
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
}
