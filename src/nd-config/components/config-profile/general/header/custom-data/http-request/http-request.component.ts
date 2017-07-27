import { Component, Input, OnInit } from '@angular/core';
import { ConfigUiUtility } from '../../../../../../utils/config-utility';
import { ConfigKeywordsService } from '../../../../../../services/config-keywords.service';
import { HTTPRequestHdrComponentData, RulesHTTPRequestHdrComponentData } from '../../../../../../containers/instrumentation-data';
import { httpReqHeaderInfo } from '../../../../../../interfaces/httpReqHeaderInfo';
import { ConfigUtilityService } from '../../../../../../services/config-utility.service';
import { SelectItem, ConfirmationService } from 'primeng/primeng';
import { ActivatedRoute, Params } from '@angular/router';
import { deleteMany } from '../../../../../../utils/config-utility';
import { ImmutableArray } from '../../../../../../utils/immutable-array';
import { Messages } from '../../../../../../constants/config-constant'

@Component({
  selector: 'app-http-request',
  templateUrl: './http-request.component.html',
  styleUrls: ['./http-request.component.css']
})
export class HttpRequestComponent implements OnInit {
  @Input()
  saveDisable: boolean;

  profileId: number;

  httpRequestHdrComponentInfo: HTTPRequestHdrComponentData[];

  /* Add and Edit HTTP Request Dialog open */
  httpRequestCustomDialog: boolean = false;

  /* Add and edit http request custom settings dialog */
  rulesDialog: boolean = false;
  isNew: boolean = false;
  editSpecific: RulesHTTPRequestHdrComponentData;

  httpRequestHdrDetail: HTTPRequestHdrComponentData;
  httpRequestHdrInfo: HTTPRequestHdrComponentData[];
  selectedHTTPReqHeader: any[];

  rulesDataDetail: RulesHTTPRequestHdrComponentData;
  rulesDataInfo: RulesHTTPRequestHdrComponentData[];
  selectedRulesData: any[];

  customValueType: SelectItem[];

  //holding table data
  arrTestRunData = [];

  editCustomSettings: boolean = false;

  counterEdit: number = 0;
  counterAdd: number = 0;

  isNewRule: boolean;

  httpAtrributeDelete = [];

   selectedHTTPReqHdrType: string;

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
    this.configKeywordsService.getFetchHTTPReqHeaderTable(this.profileId).subscribe(data => {this.doAssignHttpAttributeTableData(data);
      if (data["httpReqHdrType"] == "Specific") {
        this.selectedHTTPReqHdrType = "Specific";
      }
      else if (data["httpReqHdrType"] == "All")
        this.selectedHTTPReqHdrType = "All";
    });
  }

  doAssignHttpAttributeTableData(data) {
    this.httpRequestHdrComponentInfo = [];
    this.selectedHTTPReqHdrType = data.httpReqHdrType;
    //this.httpRequestHdrComponentInfo = this.filterTRData(data);
    this.filterTRData(data);
  }

  filterTRData(data) {
    this.arrTestRunData = [];
    if (data.attrList != null) {
      for (var i = 0; i < data.attrList.length; i++) {
        let valueNames = "";
        this.modifyData(data.attrList[i]);
      }
    }
  }

  /***common function that is used to create the row with required keys
   *  that is to be dispalyed in the table
   * 
   * 
   */
  modifyData(row) {
    let valueNames = "";
    if (row.rules == "") {
      valueNames = "-";
    }
    for (var j = 0; j < row.rules.length; j++) {
      if (row.rules.length == 1)
        valueNames = valueNames + row.rules[j].valName;
      else
        valueNames = valueNames + "," + row.rules[j].valName;
    }

    if (valueNames.indexOf(",") != -1)
      valueNames = valueNames.substr(1);

    if (row.attrType == "complete") {
      valueNames = "-";
    }
    let dumpModeTmp = '';
    if (row.dumpMode == 1)
      dumpModeTmp = "Specific";
    else if (row.dumpMode == 3)
      dumpModeTmp = "Complete,Specific";
    else if (row.dumpMode == 2) {
      dumpModeTmp = "Complete";
      row.rules = [];
      valueNames = "-";
    }
    else if (row.dumpMode == "Specific")
      dumpModeTmp = "Specific";
    else if (row.dumpMode == "Complete,Specific")
      dumpModeTmp = "Complete,Specific";
    else if (row.dumpMode == "Complete") {
      dumpModeTmp = "Complete";
      row.rules = [];
    }

    // return valueNames;
    this.arrTestRunData.push({
      headerName: row.headerName,
      dumpMode: dumpModeTmp,
      valueNames: valueNames,
      httpReqHdrBasedId: row.httpReqHdrBasedId,
      rules: row.rules,
    });
    this.httpRequestHdrComponentInfo = this.arrTestRunData;
  }

  /* Open Dialog for Add HTTP Req */
  openAddHTTPReqDialog() {
    this.httpRequestHdrDetail = new HTTPRequestHdrComponentData();
    // this.rulesDataDetail = new RulesHTTPRequestHdrComponentData();
    this.rulesDataInfo = [];
    this.isNew = true;
    this.httpRequestCustomDialog = true;
  }

  /** This method is used to open a dialog for add Type Values
  */
  openHTTPReqTypeValueDialog() {
    this.rulesDataDetail = new RulesHTTPRequestHdrComponentData();
    this.rulesDialog = true;
    this.isNewRule = false;
  }

  openEditHTTPReqTypeDialog() {
    if (!this.selectedRulesData || this.selectedRulesData.length < 1) {
      this.configUtilityService.errorMessage("Select a row to edit");
      return;
    }
    else if (this.selectedRulesData.length > 1) {
      this.configUtilityService.errorMessage("Select only one row to edit");
      return;
    }
    this.editCustomSettings = true;
    this.rulesDialog = true;
    this.isNewRule = true;
    this.rulesDataDetail = Object.assign({}, this.selectedRulesData[0]);
  }

  // Method for saving rules information
  saveRules() {

    //Edit fucntionality.
    //To edit rules in edit form
    if (this.isNewRule) {
      if (this.editCustomSettings) {
        this.editCustomSettings = false;
        let that = this;
        this.rulesDataInfo.map(function (val) {
          if (val.id == that.rulesDataDetail.id) {
            val.customValTypeName = that.rulesDataDetail.customValTypeName;
            val.lb = that.rulesDataDetail.lb;
            val.rb = that.rulesDataDetail.rb;
            val.ruleId = that.rulesDataDetail.ruleId;
            val.type = that.rulesDataDetail.type;
            val.valName = that.rulesDataDetail.valName;
          }
        });
        this.selectedRulesData = [];

      }
      else {
        //to add rules in edit form
        this.counterEdit = this.counterEdit + 1;
        this.rulesDataDetail.id = this.counterEdit;
        this.rulesDataDetail.type = this.getTypeNumber(this.rulesDataDetail.customValTypeName);
        if (this.httpRequestHdrDetail.rules == undefined)
          this.httpRequestHdrDetail.rules = [];
        this.httpRequestHdrDetail.rules = ImmutableArray.push(this.httpRequestHdrDetail.rules, this.rulesDataDetail);
        this.rulesDataInfo = this.httpRequestHdrDetail.rules;
      }
    }
    else {
      //ADD fucntionality.
      //To edit rules in add form
      if (this.editCustomSettings) {
        this.editCustomSettings = false;
        let that = this;
        this.rulesDataInfo.map(function (val) {
          if (val.id == that.rulesDataDetail.id) {
            val.customValTypeName = that.rulesDataDetail.customValTypeName;
            val.lb = that.rulesDataDetail.lb;
            val.rb = that.rulesDataDetail.rb;
            val.ruleId = that.rulesDataDetail.ruleId;
            val.type = that.rulesDataDetail.type;
            val.valName = that.rulesDataDetail.valName;
          }
        });
        this.selectedRulesData = [];

      }
      else {
        //to add rules in add form
        this.counterAdd = this.counterAdd + 1;
        this.rulesDataDetail.id = this.counterAdd;
        this.rulesDataDetail.type = this.getTypeNumber(this.rulesDataDetail.customValTypeName);
        if (this.httpRequestHdrDetail.rules == undefined)
          this.httpRequestHdrDetail.rules = [];
        this.httpRequestHdrDetail.rules = ImmutableArray.push(this.httpRequestHdrDetail.rules, this.rulesDataDetail);
        this.rulesDataInfo = this.httpRequestHdrDetail.rules;
      }
    }

    this.closeRulesDialog();
  }

  getTypeNumber(type): number {
    let typeName = 0;
    if (type == 'String')
      typeName = 0;
    else if (type == 'Integer')
      typeName = 1;
    else if (type == 'Decimal')
      typeName = 2;

    return typeName;
  }

  //function used so that type = '0' can be dispalayed as type = 'String' in table
  getTypeName(type) {
    let typeName = '';
    if (type == 0)
      typeName = 'String'
    else if (type == 1)
      typeName = 'Integer'
    else if (type == 2)
      typeName = 'Decimal'

    return typeName;
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
      if (this.selectedHTTPReqHeader[0].headerName != this.httpRequestHdrDetail.headerName) {
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

  /* Open Dialog for Edit HTTP Req */
  editHTTPRequest() {
    if (this.httpRequestHdrDetail.specific == true && this.rulesDataInfo.length == 0) {
      this.configUtilityService.errorMessage("Provide HTTP request header detail(s)");
      return;
    }
    this.HttpReqDetailSaveAndEdit();
    this.httpRequestHdrDetail.httpAttrId = this.selectedHTTPReqHeader[0].httpReqHdrBasedId;
    if (this.rulesDataInfo != []) {
      if (this.httpRequestHdrDetail.dumpMode == 2) {
        for (let index in this.rulesDataInfo) {
          this.httpAtrributeDelete.push(this.rulesDataInfo[index].ruleId)
        }
        this.rulesDataInfo = [];
      }
    }
    /* first triggering the request to delete the rules of the Http Req
    *  and then sending the request to add the Rules
    *  due to some backend problem in triggering same request for two task
    *  handling this case by triggering two different request until it is handled 
    *  from backend side
    */
    this.arrTestRunData = [];
    this.configKeywordsService.deleteHttpRules(this.httpAtrributeDelete).subscribe(data => {
      let that = this;
      this.httpAtrributeDelete = [];
      //Edit call, sending row data to service
      this.configKeywordsService.editHTTPReqHeaderData(this.httpRequestHdrDetail).subscribe(data => {
        // this.modifyData(data);
        this.httpRequestHdrComponentInfo.map(function (val) {
          if (val.httpReqHdrBasedId == data.httpReqHdrBasedId) {
            // val = data
            val = data;
          }
          that.modifyData(val);
        })
        this.configUtilityService.successMessage(Messages);
      });
    })
    this.closeDialog();
  }

  HttpReqDetailSaveAndEdit() {
    // this.sessionAttributeDetail.attrValues = [];
    let type: number;
    if (this.httpRequestHdrDetail.complete == true && this.httpRequestHdrDetail.specific == true) {
      this.httpRequestHdrDetail.attrType = "complete,specific";
      this.httpRequestHdrDetail.dumpMode = 3;
    }
    else if (this.httpRequestHdrDetail.specific == true) {
      this.httpRequestHdrDetail.attrType = "specific";
      this.httpRequestHdrDetail.dumpMode = 1;
    }
    else if (this.httpRequestHdrDetail.complete == true) {
      this.httpRequestHdrDetail.attrType = "complete";
      this.httpRequestHdrDetail.dumpMode = 2;
      this.httpRequestHdrDetail.rules = [];
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

  /**opening Edit Session Attribute Dialog */
  editHTTPReqDialog(): void {
    this.httpRequestHdrDetail = new HTTPRequestHdrComponentData();
    if (!this.selectedHTTPReqHeader || this.selectedHTTPReqHeader.length < 1) {
      this.configUtilityService.errorMessage("Select a row to edit");
      return;
    }
    else if (this.selectedHTTPReqHeader.length > 1) {
      this.configUtilityService.errorMessage("Select only one row to edit");
      return;
    }

    this.httpRequestCustomDialog = true;
    this.isNew = false;

    if (this.selectedHTTPReqHeader[0].dumpMode == "Complete,Specific") {
      this.httpRequestHdrDetail.complete = true;
      this.httpRequestHdrDetail.specific = true;
    }
    else if (this.selectedHTTPReqHeader[0].dumpMode == "Specific")
      this.httpRequestHdrDetail.specific = true;
    else if (this.selectedHTTPReqHeader[0].dumpMode == "Complete") {
      this.httpRequestHdrDetail.complete = true;
    }

    this.httpRequestHdrDetail.headerName = this.selectedHTTPReqHeader[0].headerName;

    this.httpRequestHdrDetail.rules = this.selectedHTTPReqHeader[0].rules;
    this.rulesDataInfo = this.httpRequestHdrDetail.rules;
    let that = this;
    if (this.httpRequestHdrDetail.rules != undefined) {
      this.httpRequestHdrDetail.rules.map(function (val) {
        val.id = that.counterAdd;
        that.counterAdd = that.counterAdd + 1;
        val.customValTypeName = that.getTypeName(val.type)
      })
    }
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

  saveHttpRequest() {
    if (this.httpRequestHdrDetail.specific == true && this.rulesDataInfo.length == 0) {
      this.configUtilityService.errorMessage("Provide HTTP request header detail(s)");
      return;
    }
    this.HttpReqDetailSaveAndEdit();
    this.configKeywordsService.addHTTPReqHeaderData(this.httpRequestHdrDetail, this.profileId).subscribe(data => {
      let arrhttpAttr = this.setDataHttpAttribute(data);
      this.httpRequestHdrComponentInfo = ImmutableArray.push(this.httpRequestHdrComponentInfo, arrhttpAttr[0]);
      // this.sessionAttributeComponentInfo.push(arrSessionAttr[0]);
      this.configUtilityService.successMessage(Messages);
    });
    this.closeDialog();
  }

  setDataHttpAttribute(data): Array<HTTPRequestHdrComponentData> {
    var arrTestRunData = [];
    let valueNames = "";
    if (data.rules == "")
      valueNames = "-";
    if (data.rules != null) {
      for (var i = 0; i < data.rules.length; i++) {
        if (data.rules.length == 1)
          valueNames = data.rules[i].valName;
        else
          valueNames = valueNames + "," + data.rules[i].valName;
      }
    }

    if (valueNames.indexOf(",") != -1)
      valueNames = valueNames.substr(1);

    if (valueNames == "")
      valueNames = "-";

    let dumpModeTmp = '';
    if (data.dumpMode == 1)
      dumpModeTmp = "Specific";
    else if (data.dumpMode == 3)
      dumpModeTmp = "Complete,Specific";
    else
      dumpModeTmp = "Complete";

    arrTestRunData.push({
      headerName: data.headerName,
      dumpMode: dumpModeTmp,
      valueNames: valueNames,
      httpReqHdrBasedId: data.httpReqHdrBasedId,
      rules: data.rules,
    });
    return arrTestRunData;
  }

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

  deleteRules() {
    if (!this.selectedRulesData || this.selectedRulesData.length < 1) {
      this.configUtilityService.errorMessage("Select row(s) to delete");
      return;
    }
    else {
      //Get Selected Applications's AppId
      let selectedRules = this.selectedRulesData;
      let arrRulesIndex = [];
      for (let index in selectedRules) {
        arrRulesIndex.push(selectedRules[index]);
        if (selectedRules[index].hasOwnProperty('ruleId')) {
          this.httpAtrributeDelete.push(selectedRules[index].ruleId);
        }
      }
      this.deleteRulesFromTable(arrRulesIndex);
      this.selectedRulesData = [];

    }
  }

  /**This method returns selected Rules row on the basis of selected row */
  getRulesIndex(appId: any): number {
    for (let i = 0; i < this.rulesDataInfo.length; i++) {
      if (this.rulesDataInfo[i].id == appId.id) {
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
    this.httpRequestHdrDetail.rules = deleteMany(this.httpRequestHdrDetail.rules, rowIndex);
    this.rulesDataInfo = this.httpRequestHdrDetail.rules;
    // this.rulesDataInfo = deleteMany(this.rulesDataInfo, rowIndex);
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

  /* set Value of All or Specific which Selected */
  getSelectedHTTPReqHdr() {
    let httpReqHdrType = { httpReqHdrType: this.selectedHTTPReqHdrType };
    this.configKeywordsService.getHTTPRequestValue(httpReqHdrType, this.profileId).subscribe(data => this.selectedHTTPReqHdrType = data["httpReqHdrType"]);

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
