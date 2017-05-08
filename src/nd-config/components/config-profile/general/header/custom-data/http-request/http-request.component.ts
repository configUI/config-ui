import { Component, Input, OnInit } from '@angular/core';
import { ConfigUiUtility } from '../../../../../../utils/config-utility';
import { ConfigKeywordsService } from '../../../../../../services/config-keywords.service';
import { HTTPRequestHdrComponentData, RulesHTTPRequestHdrComponentData } from '../../../../../../containers/instrumentation-data';
import { httpReqHeaderInfo } from '../../../../../../interfaces/httpReqHeaderInfo';
import { ConfigUtilityService } from '../../../../../../services/config-utility.service';
import { SelectItem, ConfirmationService } from 'primeng/primeng';
import { ActivatedRoute, Params } from '@angular/router';
import { deleteMany } from '../../../../../../utils/config-utility';

import { Messages } from '../../../../../../constants/config-constant'

@Component({
  selector: 'app-http-request',
  templateUrl: './http-request.component.html',
  styleUrls: ['./http-request.component.css']
})
export class HttpRequestComponent implements OnInit {
  @Input()
  saveDisable: boolean;

  httpRequestHdrComponentInfo: HTTPRequestHdrComponentData[];

  /* Add and Edit HTTP Request Dialog open */
  httpRequestCustomDialog: boolean = false;

  /* Add and edit http request custom settings dialog */
  rulesDialog: boolean = false;

  isNew: boolean = false;

  editSpecific: RulesHTTPRequestHdrComponentData;

  profileId: number;

  httpRequestHdrDetail: HTTPRequestHdrComponentData;
  httpRequestHdrInfo: HTTPRequestHdrComponentData[];
  selectedHTTPReqHeader: any[];

  rulesDataDetail: RulesHTTPRequestHdrComponentData;
  rulesDataInfo: RulesHTTPRequestHdrComponentData[];
  selectedRulesData: any[];

  customValueType: SelectItem[];

  constructor(private route: ActivatedRoute, private configKeywordsService: ConfigKeywordsService, private configUtilityService: ConfigUtilityService, private confirmationService: ConfirmationService) {
    this.customValueType = [];
    this.rulesDataInfo = [];
    let arrLabel = ['String', 'Integer', 'Decimal'];
    let arrValue = ['String', 'Integer', 'Decimal'];
    this.customValueType = ConfigUiUtility.createListWithKeyValue(arrLabel, arrValue);
  }

  ngOnInit() {
    this.loadHTTPReqHeaderDetails();
  }

  loadHTTPReqHeaderDetails(): void {
    this.route.params.subscribe((params: Params) => {
      this.profileId = params['profileId'];
      this.saveDisable = this.profileId == 1 ? true : false;
    });
    this.configKeywordsService.getFetchHTTPReqHeaderTable(this.profileId).subscribe(data => this.doAssignSessionAttributeTableData(data));
  }

  doAssignSessionAttributeTableData(data) {
    this.httpRequestHdrComponentInfo = this.filterTRData(data);
  }
  filterTRData(data): Array<HTTPRequestHdrComponentData> {
    var arrTableData = [];
    let dumpModeTmp = "";
    for (var i = 0; i < data.length; i++) {
      let valueNames = "";
      if (data[i].rules.length == 0)
        valueNames = "-";

      for (var j = 0; j < data[i].rules.length; j++) {
        if (data[i].rules.length == 1)
          valueNames = valueNames + data[i].rules[j].valName;
        else {
          valueNames = valueNames + "," + data[i].rules[j].valName;
        }
      }
      if (valueNames.indexOf(",") != -1)
        valueNames = valueNames.substr(1);

      if (data[i].dumpMode == 1)
        dumpModeTmp = "Specific";
      else if (data[i].dumpMode == 3)
        dumpModeTmp = "Complete,Specific";
      else
        dumpModeTmp = "Complete"

      arrTableData.push({
        headerName: data[i].headerName, dumpMode: dumpModeTmp, valueNames: valueNames, httpReqHdrBasedId: data[i].httpReqHdrBasedId, rules: data[i].rules,
      });
    }
    return arrTableData;
  }

  /* Open Dialog for Add HTTP Req */
  openAddHTTPReqDialog() {
    this.httpRequestHdrDetail = new HTTPRequestHdrComponentData();
    this.rulesDataDetail = new RulesHTTPRequestHdrComponentData();

    this.isNew = true;
    this.httpRequestCustomDialog = true;
  }

  saveADDEditHTTPReqHeader(): void {
    if ((this.httpRequestHdrDetail.complete == false && this.httpRequestHdrDetail.specific == false) || (!this.httpRequestHdrDetail.complete && !this.httpRequestHdrDetail.specific)) {
      this.configUtilityService.errorMessage("Select HTTP request header type(s)");
    }
    //When add new Http Request header
    else if (this.isNew) {
      //Check for app name already exist or not
      if (!this.checkHttpReqNameAlreadyExist()) {
        this.saveHttpRequest();
        return;
      }
    }
    //When add edit Method
    else {
      if (this.httpRequestHdrComponentInfo[0].headerName != this.httpRequestHdrDetail.headerName) {
        if (this.checkHttpReqNameAlreadyExist())
          return;
      }
      this.editHTTPRequest();
    }
  }

  /**This method is used to validate the name of Method is already exists. */
  checkHttpReqNameAlreadyExist(): boolean {
    for (let i = 0; i < this.httpRequestHdrComponentInfo.length; i++) {
      if (this.httpRequestHdrComponentInfo[i].headerName == this.httpRequestHdrDetail.headerName) {
        this.configUtilityService.errorMessage("HTTP Request Name already exist");
        return true;
      }
    }
  }

  /**This method is used to validate the name of Method is already exists. */
  checkRuleAlreadyExist(): boolean {
    for (let i = 0; i < this.rulesDataInfo.length; i++) {
      if (this.rulesDataInfo[i].valName == this.rulesDataDetail.valName) {
        this.configUtilityService.errorMessage("Rule Name already exist");
        return true;
      }
    }
  }

  /* Open Dialog for Edit HTTP Req */
  editHTTPReqDialog() {
    let selectedHTTPReq = [];
    let isSpecific = false;
    let isComplete = false;
    this.httpRequestHdrDetail = new HTTPRequestHdrComponentData();
    if (!this.selectedHTTPReqHeader || this.selectedHTTPReqHeader.length < 1) {
      this.configUtilityService.errorMessage("Select a row to edit");
      return;
    }
    else if (this.selectedHTTPReqHeader.length > 1) {
      this.configUtilityService.errorMessage("Select only one row to edit");
      return;
    }

    if (this.selectedHTTPReqHeader[0].dumpMode == "Specific")
      isSpecific = true;
    else if (this.selectedHTTPReqHeader[0].dumpMode == "Complete")
      isComplete = true;
    else if (this.selectedHTTPReqHeader[0].dumpMode == "Complete,Specific") {
      isComplete = true;
      isSpecific = true;
    }
    selectedHTTPReq[0] = { headerName: this.selectedHTTPReqHeader[0].headerName, complete: isComplete, specific: isSpecific, rules: this.selectedHTTPReqHeader[0].rules };

    this.httpRequestHdrDetail = Object.assign({}, selectedHTTPReq[0]);
    if (this.selectedHTTPReqHeader[0].rules.length != 0) {
      for (let i = 0; i < this.selectedHTTPReqHeader[0].rules.length; i++) {
        if (this.selectedHTTPReqHeader[0].rules[i].type == 0)
          this.selectedHTTPReqHeader[0].rules[i].customValTypeName = "Integer";
        if (this.selectedHTTPReqHeader[0].rules[i].type == 1)
          this.selectedHTTPReqHeader[0].rules[i].customValTypeName = "String";
        if (this.selectedHTTPReqHeader[0].rules[i].type == 2)
          this.selectedHTTPReqHeader[0].rules[i].customValTypeName = "Decimal";
        this.rulesDataInfo[i] = this.selectedHTTPReqHeader[0].rules[i];
      }
    }

    this.httpRequestCustomDialog = true;
    this.isNew = false;
  }

  /* Method for Edit HTTP Req */
  editHTTPRequest() {
    this.setEditedNewValues("Edit");
    this.configKeywordsService.editHTTPReqHeaderData(this.httpRequestHdrDetail, this.selectedHTTPReqHeader[0].httpReqHdrBasedId)
      .subscribe(data => {
        let index = this.getMethodBusinessIndex(data.httpReqHdrBasedId);
        this.selectedHTTPReqHeader.length = 0;
        this.selectedHTTPReqHeader.push(data);
        this.httpRequestHdrComponentInfo[index] = this.addReqHeaderTableData(this.httpRequestHdrDetail)[0];
        this.closeDialog();
      });

    // if (this.httpRequestHdrDetail.dumpMode == 1) {
    //   if (this.rulesDataInfo.length != 0) {
    //     this.setEditedNewValues("EditSpecific");
    //     this.configKeywordsService.editHTTPReqHeaderRulesData(this.editSpecific, this.selectedHTTPReqHeader[0].httpReqHdrBasedId)
    //       .subscribe(data => {
    //         // let index = this.getRulesIndex(this.editSpecific.valName);
    //         // this.selectedHTTPReqHeader.length = 0;
    //         // this.httpRequestHdrComponentInfo[index].valueNames = this.addReqHeaderTableData(this.editSpecific)[0].valueNames;
    //         // this.selectedHTTPReqHeader.push(data);
    //         //this.rulesDataDetail[index] = data;
    //       });
    //   }
    // }
    this.closeDialog();
  }


  /**This method returns selected application row on the basis of selected row */
  getMethodBusinessIndex(appId: any): number {
    for (let i = 0; i < this.httpRequestHdrComponentInfo.length; i++) {
      if (this.httpRequestHdrComponentInfo[i].httpReqHdrBasedId == appId) {
        return i;
      }
    }
    return -1;
  }

  /** This method is used to open a dialog for add Type Values
   */
  openHTTPReqTypeValueDialog() {
    this.rulesDataDetail = new RulesHTTPRequestHdrComponentData();
    this.rulesDialog = true;
  }

  /*set format of Edit and add new Http Request */
  setEditedNewValues(opertionType: string) {
    let type: number;
    this.httpRequestHdrDetail.rules = [];
    for (let i = 0; i < this.rulesDataInfo.length; i++) {
      if (this.rulesDataInfo[i].customValTypeName == "Integer")
        type = 0;
      else if (this.rulesDataInfo[i].customValTypeName == "String")
        type = 1;
      else if (this.rulesDataInfo[i].customValTypeName == "Decimal")
        type = 2;

      if (opertionType == "Edit") {
        this.httpRequestHdrDetail.rules = [];
        this.httpRequestHdrDetail.attrValues = [];
        this.httpRequestHdrDetail.rules[i] = { type: type, id: i, lb: this.rulesDataInfo[i].lb, rb: this.rulesDataInfo[i].rb, customValTypeName: this.rulesDataInfo[i].customValTypeName, valName: this.rulesDataInfo[i].valName };
        this.httpRequestHdrDetail.attrValues[i] = { type: type, id: i, lb: this.rulesDataInfo[i].lb, rb: this.rulesDataInfo[i].rb, customValTypeName: this.rulesDataInfo[i].customValTypeName, valName: this.rulesDataInfo[i].valName };
      }

      if (opertionType == "NewAdd") {
        this.httpRequestHdrDetail.rules = [];
        this.httpRequestHdrDetail.attrValues = [];
        this.httpRequestHdrDetail.rules[i] = { type: type, id: i, lb: this.rulesDataInfo[i].lb, rb: this.rulesDataInfo[i].rb, customValTypeName: this.rulesDataInfo[i].customValTypeName, valName: this.rulesDataInfo[i].valName };
        this.httpRequestHdrDetail.attrValues[i] = { type: type, id: i, lb: this.rulesDataInfo[i].lb, rb: this.rulesDataInfo[i].rb, customValTypeName: this.rulesDataInfo[i].customValTypeName, valName: this.rulesDataInfo[i].valName };
      }
      // if (opertionType == "EditSpecific") {
      //   this.httpRequestHdrDetail.rules = [];
      //   this.httpRequestHdrDetail.attrValues = [];
      //   this.editSpecific = { type: type, id: i, lb: this.rulesDataInfo[i].lb, rb: this.rulesDataInfo[i].rb, customValTypeName: this.rulesDataInfo[i].customValTypeName, valName: this.rulesDataInfo[i].valName };
      //   this.httpRequestHdrDetail.attrValues[i] = { type: type, id: i, lb: this.rulesDataInfo[i].lb, rb: this.rulesDataInfo[i].rb, customValTypeName: this.rulesDataInfo[i].customValTypeName, valName: this.rulesDataInfo[i].valName };
      // }
    }

    //  this.httpRequestHdrDetail.rules[i] = { type: type, id: i, lb: this.customValueTypeInfo[i].lb, rb: this.customValueTypeInfo[i].rb, customValTypeName: this.customValueTypeInfo[i].customValTypeName, valName: this.customValueTypeInfo[i].valName };
    if (this.httpRequestHdrDetail.complete == true && this.httpRequestHdrDetail.specific == true)
      this.httpRequestHdrDetail.dumpMode = 3;
    else if (this.httpRequestHdrDetail.complete == true)
      this.httpRequestHdrDetail.dumpMode = 2;
    else
      this.httpRequestHdrDetail.dumpMode = 1;
  }

  /* Method for Add new HTTP Req */
  saveHttpRequest() {
    this.setEditedNewValues("NewAdd");

    this.configKeywordsService.addHTTPReqHeaderData(this.httpRequestHdrDetail, this.profileId).subscribe(data => {
      let arrSessionAttr = this.addReqHeaderTableData(data);

      this.httpRequestHdrComponentInfo.push(arrSessionAttr[0]);
      this.configUtilityService.successMessage(Messages);
    });
    this.rulesDataInfo = [];
    this.closeDialog();
  }

  /* these functions are used in order to form the data as per requiremet of data to be
  *  is table screen i,e.
  * adding an extra key -value pair in each object.
  *  returnTypeValue = "aa,bb",
  *  argumentTypeValue = "bb,cc"
  *
  *
  */

  addReqHeaderTableData(data): Array<HTTPRequestHdrComponentData> {
    var arrTableData = [];
    let dumpModeTmp = "";
    let valueNames = "";
    if (data.rules != null) {
      for (var j = 0; j < data.rules.length; j++) {
        if (data.rules.length == 1)
          valueNames = valueNames + data.rules[j].valName;
        else {
          valueNames = valueNames + "," + data.rules[j].valName;
        }
      }
    }
    if (valueNames == "")
      valueNames = "-";

    if (valueNames.indexOf(",") != -1)
      valueNames = valueNames.substr(1);

    if (data.dumpMode == 1)
      dumpModeTmp = "Specific";
    else if (data.dumpMode == 3)
      dumpModeTmp = "Complete,Specific";
    else
      dumpModeTmp = "Complete"

    arrTableData.push({
      headerName: data.headerName, dumpMode: dumpModeTmp, valueNames: valueNames, rules: data.rules, httpReqHdrBasedId: data.httpReqHdrBasedId,
    });

    return arrTableData;
  }

  // Method for saving rules information
  saveRules() {

    this.rulesDataInfo.push(this.rulesDataDetail);
    this.closeRulesDialog();
  }

  // Method for delete rules information
  deleteRules() {
    if (!this.selectedRulesData || this.selectedRulesData.length < 1) {
      this.configUtilityService.errorMessage("Select row(s) to delete");
      return;
    }
    this.confirmationService.confirm({
      message: 'Do you want to delete the selected row?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        let selectedRules = this.selectedRulesData;
        let arrRulesIndex = [];
        for (let index in selectedRules) {
          arrRulesIndex.push(selectedRules[index].valName);
        }
        this.deleteRulesFromTable(arrRulesIndex);
        this.configUtilityService.infoMessage("Delete Successfully");
        this.selectedHTTPReqHeader = [];
      }
    });

  }

  /**This method returns selected Rules row on the basis of selected row */
  getRulesIndex(appId: any): number {
    for (let i = 0; i < this.rulesDataInfo.length; i++) {
      if (this.rulesDataInfo[i].valName == appId) {
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
    this.rulesDataInfo = deleteMany(this.rulesDataInfo, rowIndex);
  }

  deleteHTTPReqHeader(): void {
    if (!this.selectedHTTPReqHeader || this.selectedHTTPReqHeader.length < 1) {
      this.configUtilityService.errorMessage("Select row(s) to delete");
      return;
    }
    this.confirmationService.confirm({
      message: 'Do you want to delete the selected row?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        //Get Selected Applications's AppId
        let selectedApp = this.selectedHTTPReqHeader;
        let arrAppIndex = [];
        for (let index in selectedApp) {
          arrAppIndex.push(selectedApp[index].httpReqHdrBasedId);
        }
        this.configKeywordsService.deleteHTTPReqHeaderData(arrAppIndex, this.profileId)
          .subscribe(data => {
            this.deleteHTTPReqHeaderIndex(data);
            this.configUtilityService.infoMessage("Delete Successfully");
            this.selectedHTTPReqHeader = [];
          })
      },
      reject: () => {
      }
    });
  }

  /**This method is used to delete HTTP request from Data Table */
  deleteHTTPReqHeaderIndex(arrIndex) {
    let rowIndex: number[] = [];

    for (let index in arrIndex) {
      rowIndex.push(this.getHTTPReqHeaderIndex(arrIndex[index]));
    }
    this.httpRequestHdrComponentInfo = deleteMany(this.httpRequestHdrComponentInfo, rowIndex);
  }

  /**This method returns selected table data row on the basis of selected row */
  getHTTPReqHeaderIndex(id: number): number {

    for (let i = 0; i < this.httpRequestHdrComponentInfo.length; i++) {
      if (this.httpRequestHdrComponentInfo[i].httpReqHdrBasedId == id) {
        return i;
      }
    }
    return -1;
  }

  /* Close Dialog */
  closeDialog() {
    this.selectedHTTPReqHeader = [];
    this.httpRequestCustomDialog = false;
  }

  closeRulesDialog() {

    this.rulesDialog = false;
  }
}
