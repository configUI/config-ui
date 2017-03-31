import { Component, OnInit } from '@angular/core';
import { ConfigKeywordsService } from '../../../../../services/config-keywords.service';
import { BusinessTransMethodInfo } from '../../../../../interfaces/business-Trans-Method-info';
import { ConfigUiUtility } from '../../../../../utils/config-utility';
import { OperationType, BusinessTransMehtodData } from '../../../../../containers/instrumentation-data'
import { SelectItem, ConfirmationService } from 'primeng/primeng';
import { ConfigUtilityService } from '../../../../../services/config-utility.service';
import { deleteMany } from '../../../../../utils/config-utility';

@Component({
  selector: 'app-method-bt-configuration',
  templateUrl: './method-bt-configuration.component.html',
  styleUrls: ['./method-bt-configuration.component.css']
})
export class MethodBTConfigurationComponent implements OnInit {

  /* Assign data to Method Business Transaction Data table */
  businessTransMethodInfo: BusinessTransMehtodData[];
  businessTransMethodDetail: BusinessTransMehtodData;
  selectedbusinessTransMethod: any;

  /* Assign data to Rules Business Transaction Data table */
  methodRulesInfo: BusinessTransMehtodData[];
  btMethodRulesDetail: OperationType;
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

  constructor(private configKeywordsService: ConfigKeywordsService, private configUtilityService: ConfigUtilityService, private confirmationService: ConfirmationService) {

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
      let arrLabel = ['EQUAL', 'NOT EQUAL', 'CONTAINS', 'STARTS WITH', 'ENDS WITH', 'EXCEPTION'];
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
    this.configKeywordsService.getBusinessTransMethodData().subscribe(data => this.businessTransMethodInfo = data);
  }

  /** this method used for open dialog for add Method Business Transaction */
  openMethodDialog() {
    this.businessTransMethodDetail = new BusinessTransMehtodData();
    this.addBusinessTransMethodDialog = true;
    this.btMethodRulesDetail = new OperationType();
  }

  /** This method is used to open a dialog for add Rules
   * Call a method for fill Operation drop down according Return Type 
  */
  openAddRulesDialog() {
    this.btMethodRulesDetail = new OperationType();
    this.addRulesDialog = true;
    this.changeOpertionType();
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
        this.configKeywordsService.deleteBusinessTransMethodData(arrAppIndex)
          .subscribe(data => {
            this.deleteMethodsBusinessTransactions(arrAppIndex);
            this.configUtilityService.infoMessage("Delete Successfully");
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

  saveRules()
  {
     this.methodRulesInfo.push(this.businessTransMethodDetail);
      this.addRulesDialog = false;
  }
  
  saveADDEditMethodTrans() {
    // this.methodRulesInfo.push(this.btMethodRulesDetail);
     this.configKeywordsService.addBusinessTransMethod(this.businessTransMethodDetail).subscribe(data => {
      this.businessTransMethodInfo.push(data)
    });
    this.addBusinessTransMethodDialog = false;
  }

}
