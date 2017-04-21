import { Component, OnInit } from '@angular/core';
import { ConfigKeywordsService } from '../../../../../services/config-keywords.service';
import { BusinessTransMethodInfo } from '../../../../../interfaces/business-trans-method-info';
import { ConfigUiUtility } from '../../../../../utils/config-utility';
import { BusinessTransMethodData, RulesData } from '../../../../../containers/instrumentation-data'
import { SelectItem, ConfirmationService } from 'primeng/primeng';
import { ConfigUtilityService } from '../../../../../services/config-utility.service';
import { deleteMany } from '../../../../../utils/config-utility';
import { ActivatedRoute, Params } from '@angular/router';

import { Messages } from '../../../../../constants/config-constant'

@Component({
  selector: 'app-method-bt-configuration',
  templateUrl: './method-bt-configuration.component.html',
  styleUrls: ['./method-bt-configuration.component.css']
})
export class MethodBTConfigurationComponent implements OnInit {

  profileId: number;

  /* Assign data to Method Business Transaction Data table */
  businessTransMethodInfo: BusinessTransMethodData[];
  businessTransMethodDetail: BusinessTransMethodData;
  selectedbusinessTransMethod: any;

  /* Assign data to Rules Business Transaction Data table */
  methodRulesInfo: RulesData[];
  btMethodRulesDetail: RulesData;
  selectedMethodRules: any;


  /* open dialog box */
  addBusinessTransMethodDialog: boolean = false;
  addRulesDialog: boolean = false;

  /* Assign value to return type drop down */
  returnTypeList: SelectItem[];

  /*selected item from Return type list*/
  selectedReturnType: string;

  /* Assign value to Return type drop down */
  operationList: SelectItem[];

  /*selected item from return type list*/
  selectedOperation: string;

  isNewMethod: boolean = false;


  constructor(private route: ActivatedRoute, private configKeywordsService: ConfigKeywordsService, private configUtilityService: ConfigUtilityService, private confirmationService: ConfirmationService) {

    let arrLabel = ['NUMERIC', 'STRING', 'BOOLEAN', 'CHAR OR BYTE'];
    let arrValue = ['Numeric', 'String', 'Boolean', 'Char or Byte'];

    this.returnTypeList = [];
    this.returnTypeList = ConfigUiUtility.createListWithKeyValue(arrLabel, arrValue);

    this.methodRulesInfo = [];
  }

  changeOpertionType() {
    if (this.businessTransMethodDetail.returnType == "Numeric") {
      this.operationList = [];
      let arrLabel = ['EQUAL', 'NOT EQUAL', 'LESS THEN', 'GREATER THEN', 'LESS THEN EQUAL TO', 'GREATER THEN EQUAL TO', 'EQ', 'NE', 'EXCEPTION'];
      this.operationList = ConfigUiUtility.createDropdown(arrLabel);
    }
    else if (this.businessTransMethodDetail.returnType == "String") {
      this.operationList = [];
      let arrLabel = ['EQUALS', 'NOT EQUALS', 'CONTAINS', 'STARTS WITH', 'ENDS WITH', 'EXCEPTION'];
      this.operationList = ConfigUiUtility.createDropdown(arrLabel);
    }
    else if (this.businessTransMethodDetail.returnType == "Boolean") {
      this.operationList = [];
      let arrLabel = ['TRUE', 'FALSE', 'EXCEPTION'];
      this.operationList = ConfigUiUtility.createDropdown(arrLabel);
    }
    else if (this.businessTransMethodDetail.returnType == "Char or Byte") {
      this.operationList = [];
      let arrLabel = ['EXCEPTION', 'EQ', 'NE'];
      this.operationList = ConfigUiUtility.createDropdown(arrLabel);
    }


  }

  ngOnInit() {
    this.loadBTMethodData();
  }

  /** Fetch BT Mehtod Data and Assign on Loading */
  loadBTMethodData(): void {
    this.route.params.subscribe((params: Params) => {
      this.profileId = params['profileId'];
    });
    this.configKeywordsService.getBusinessTransMethodData(this.profileId).subscribe(data => this.businessTransMethodInfo = data);
  }

  /** this method used for open dialog for add Method Business Transaction */
  openMethodDialog() {
    this.businessTransMethodDetail = new BusinessTransMethodData();
    this.btMethodRulesDetail = new RulesData();
    this.addBusinessTransMethodDialog = true;
    this.isNewMethod = true;

  }

  /** This method is used to open a dialog for add Rules
   * Call a method for fill Operation drop down according Return Type
  */
  openAddRulesDialog() {

    this.addRulesDialog = true;
    this.changeOpertionType();
  }

  /** Edit BT Method */
  editMethodTrans(): void {
    this.businessTransMethodDetail = new BusinessTransMethodData();
    if (!this.selectedbusinessTransMethod || this.selectedbusinessTransMethod.length < 1) {
      this.configUtilityService.errorMessage("Select row for edit");
      return;
    }
    else if (this.selectedbusinessTransMethod.length > 1) {
      this.configUtilityService.errorMessage("Select only one row for edit");
      return;
    }

    this.addBusinessTransMethodDialog = true;
    this.isNewMethod = false;
    this.businessTransMethodDetail = Object.assign({}, this.selectedbusinessTransMethod[0]);
  }

  /**This method is used to edit Method detail */
  editMethod(): void {
    this.configKeywordsService.editBusinessTransMethod(this.businessTransMethodDetail, this.profileId)
      .subscribe(data => {
        let index = this.getMethodBusinessIndex(this.businessTransMethodDetail.btMethodId);
        this.selectedbusinessTransMethod.length = 0;
        this.selectedbusinessTransMethod.push(data);
        this.businessTransMethodInfo[index] = data;
      });
    this.closeDialog();
  }

  /**This method is used to delete Mehtod BT*/
  deleteMethodTrans(): void {

    if (!this.selectedbusinessTransMethod || this.selectedbusinessTransMethod.length < 1) {
      this.configUtilityService.errorMessage("Please select for delete");
      return;
    }
    this.confirmationService.confirm({
      message: 'Do you want to delete the selected record?',
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
            this.configUtilityService.infoMessage("Deleted Successfully !!!");
          })
      },
      reject: () => {
      }
    });
  }

  /**This method is used to delete Method Rules */
  deleteRules() {
    let selectedRules = this.selectedMethodRules;
    let arrRulesIndex = [];
    for (let index in selectedRules) {
      arrRulesIndex.push(selectedRules[index]);
    }
    this.deleteRulesFromTable(arrRulesIndex);
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

  /**This method is used to delete Rules from Data Table */
  deleteMethodsBusinessTransactions(arrIndex) {
    let rowIndex: number[] = [];

    for (let index in arrIndex) {
      rowIndex.push(this.getMethodBusinessIndex(arrIndex[index]));
    }
    this.businessTransMethodInfo = deleteMany(this.businessTransMethodInfo, rowIndex);
  }

  saveRules() {
    this.methodRulesInfo.push(this.btMethodRulesDetail);
    this.configUtilityService.successMessage(Messages);
    this.addRulesDialog = false;
  }

  /**This method is common method for save or edit BT Method */
  saveADDEditMethodTrans(): void {
    //When add new application
    if (this.isNewMethod) {
      //Check for app name already exist or not
      if (!this.checkMethodNameAlreadyExist()) {
        this.saveMethod();
        return;
      }
    }
    //When add edit Method
    else {
      if (this.businessTransMethodInfo[0].fqm != this.businessTransMethodDetail.fqm) {
        if (this.checkMethodNameAlreadyExist())
          return;
      }
      this.editMethod();
    }
  }

  /**This method is used to validate the name of Method is already exists. */
  checkMethodNameAlreadyExist(): boolean {
    for (let i = 0; i < this.businessTransMethodInfo.length; i++) {
      if (this.businessTransMethodInfo[i].fqm == this.businessTransMethodDetail.fqm) {
        this.configUtilityService.errorMessage("Application Name already exist");
        return true;
      }
    }
  }

  saveMethod() {

    this.businessTransMethodDetail.rules = [];
    var code: number;
    if ((this.businessTransMethodDetail.returnType == "String") && (this.btMethodRulesDetail.operationName == "EQUALS"))
      code = 1;
    if ((this.businessTransMethodDetail.returnType == "String") && (this.btMethodRulesDetail.operationName == "NOT EQUALS"))
      code = 2;
    if ((this.businessTransMethodDetail.returnType == "String") && (this.btMethodRulesDetail.operationName == "CONTAINS"))
      code = 3;
    if ((this.businessTransMethodDetail.returnType == "String") && (this.btMethodRulesDetail.operationName == "STARTS WITH"))
      code = 4;
    if ((this.businessTransMethodDetail.returnType == "String") && (this.btMethodRulesDetail.operationName == "ENDS WITH"))
      code = 5;
    if ((this.businessTransMethodDetail.returnType == "String") && (this.btMethodRulesDetail.operationName == "EXCEPTION"))
      code = 6;

    if ((this.businessTransMethodDetail.returnType == "Numeric") && (this.btMethodRulesDetail.operationName == "EQUAL"))
      code = 7;
    if ((this.businessTransMethodDetail.returnType == "Numeric") && (this.btMethodRulesDetail.operationName == "NOT EQUAL"))
      code = 8;
    if ((this.businessTransMethodDetail.returnType == "Numeric") && (this.btMethodRulesDetail.operationName == "LESS THEN"))
      code = 9;
    if ((this.businessTransMethodDetail.returnType == "Numeric") && (this.btMethodRulesDetail.operationName == "GREATER THEN"))
      code = 10;
    if ((this.businessTransMethodDetail.returnType == "Numeric") && (this.btMethodRulesDetail.operationName == "LESS THEN EQUAL TO"))
      code = 11;
    if ((this.businessTransMethodDetail.returnType == "Numeric") && (this.btMethodRulesDetail.operationName == "GREATER THEN EQUAL TO"))
      code = 12;
    if ((this.businessTransMethodDetail.returnType == "Numeric") && (this.btMethodRulesDetail.operationName == "EQ"))
      code = 13;
    if ((this.businessTransMethodDetail.returnType == "Numeric") && (this.btMethodRulesDetail.operationName == "NE"))
      code = 14;
    if ((this.businessTransMethodDetail.returnType == "Numeric") && (this.btMethodRulesDetail.operationName == "EXCEPTION"))
      code = 15;

    if ((this.businessTransMethodDetail.returnType == "Boolean") && (this.btMethodRulesDetail.operationName == "TRUE"))
      code = 16;
    if ((this.businessTransMethodDetail.returnType == "Boolean") && (this.btMethodRulesDetail.operationName == "FALSE"))
      code = 17;
    if ((this.businessTransMethodDetail.returnType == "Boolean") && (this.btMethodRulesDetail.operationName == "EXCEPTION"))
      code = 18;

    if ((this.businessTransMethodDetail.returnType == "Char or Byte") && (this.btMethodRulesDetail.operationName == "EXCEPTION"))
      code = 19;
    if ((this.businessTransMethodDetail.returnType == "Char or Byte") && (this.btMethodRulesDetail.operationName == "EQ"))
      code = 20;
    if ((this.businessTransMethodDetail.returnType == "Char or Byte") && (this.btMethodRulesDetail.operationName == "NE"))
      code = 21;

    for (let i = 0; i < this.methodRulesInfo.length; i++) {
      this.businessTransMethodDetail.rules[i] = { btMethodRuleId: i, opCode: code, opCodeDropDown: { dropDownVal: code }, btName: this.methodRulesInfo[i].btName, value: this.methodRulesInfo[i].value, operationName: this.methodRulesInfo[i].operationName };
    }
    this.configKeywordsService.addBusinessTransMethod(this.businessTransMethodDetail, this.profileId).subscribe(data => {
      this.businessTransMethodInfo.push(data)
    this.configUtilityService.successMessage(Messages);
    });
    this.addBusinessTransMethodDialog = false;
  }

  /**For close add/edit Method dialog box */
  closeDialog(): void {
    this.addBusinessTransMethodDialog = false;
  }

  closeReturnDialog(): void {
     this.addRulesDialog=false;
     this.addBusinessTransMethodDialog = true;
  }
}
