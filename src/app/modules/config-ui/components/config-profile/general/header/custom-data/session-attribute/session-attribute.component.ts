import { Component, OnInit } from '@angular/core';
import { ConfigKeywordsService } from '../../../../../../services/config-keywords.service';
import { SessionAtrributeComponetsData } from '../../../../../../containers/instrumentation-data';
import { sessionAttributeInfo } from '../../../../../../interfaces/sessionAttributeInfo';
import { ConfigUiUtility } from '../../../../../../utils/config-utility';
import { SelectItem } from 'primeng/primeng';
@Component({
  selector: 'app-session-attribute',
  templateUrl: './session-attribute.component.html',
  styleUrls: ['./session-attribute.component.css']
})
export class SessionAttributeComponent implements OnInit {

  sessionAttributeComponentInfo: sessionAttributeInfo[];

  /* Add new Session Attribute Dialog open */
  isNewSessionAttr: boolean = false;
  addEditSessionAttrDialog: boolean = false;
  sessionAttrTypeValueDialog: boolean = false;

  customValueType: SelectItem[];
  /* Assign selected dropdown values to selected method type */
  selectedCustomValueType: string;

  customValueTypeDetail: SessionAtrributeComponetsData;
  customTypeValueInfo: SessionAtrributeComponetsData[];

  constructor(private configKeywordsService: ConfigKeywordsService) {

    this.customValueType = [];
    let arrLabel = ['String', 'Integer', 'Decimal'];
    let arrValue = ['string', 'integer', 'decimal'];
    this.customValueType = ConfigUiUtility.createListWithKeyValue(arrLabel, arrValue);
  }

  ngOnInit() {
    this.loadGetSessionAttribute();
  }

  loadGetSessionAttribute(): void {

    this.configKeywordsService.getFetchSessionAttributeTable('7356').subscribe(data => this.constructTableData(data));
  }

  constructTableData(data) {
    for (let i = 0; i < data.attrList.length; i++) {
      console.log(data.attrList.length)
      //this.sessionAttributeComponentInfo = data.attrList[i];
    }
    this.sessionAttributeComponentInfo = this.filterTRData(data)
    console.log("  this.sessionAttributeComponentInfo == ", this.sessionAttributeComponentInfo)
  }
  filterTRData(data): Array<sessionAttributeInfo> {
    var arrTestRunData = [];
    for (var i = 0; i < data.attrList.length; i++) {
      let valueNames = "";
      for (var j = 0; j < data.attrList[i].attrValues.length; j++) {


        if (data.attrList[i].attrValues.length == 1)
          valueNames = data.attrList[i].attrValues[j].valName;
        else
          valueNames = data.attrList[i].attrValues[j].valName + "," + valueNames;
      }
      arrTestRunData.push({
        attrName: data.attrList[i].attrName, attrType: data.attrList[i].attrType, valName: valueNames
      });
    }
    return arrTestRunData;

  }

  /* Open Dialog for Add Session Attribute */
  opensSessionAttributeDialog() {
    // this.businessTransPatternDetail = new BusinessTransPatternData();
    this.isNewSessionAttr = true;
    this.addEditSessionAttrDialog = true;
  }

  /** This method is used to open a dialog for add Type Values
    */
  openSessionAttrTypeValueDialog() {
    this.customValueTypeDetail = new SessionAtrributeComponetsData();
    this.sessionAttrTypeValueDialog = true;
  }

  // /**This method is used to delete Mehtod BT*/
  // deleteMethodTrans(): void {
  //   if (!this.selectedbusinessTransMethod || this.selectedbusinessTransMethod.length < 1) {
  //     this.configUtilityService.errorMessage("Please select for delete");
  //     return;
  //   }
  //   this.confirmationService.confirm({
  //     message: 'Do you want to delete the selected record?',
  //     header: 'Delete Confirmation',
  //     icon: 'fa fa-trash',
  //     accept: () => {
  //       //Get Selected Applications's AppId
  //       let selectedApp = this.selectedbusinessTransMethod;
  //       let arrAppIndex = [];
  //       for (let index in selectedApp) {
  //         arrAppIndex.push(selectedApp[index].btMethodId);
  //       }
  //       this.configKeywordsService.deleteBusinessTransMethodData(arrAppIndex)
  //         .subscribe(data => {
  //           this.deleteMethodsBusinessTransactions(arrAppIndex);
  //           this.configUtilityService.infoMessage("Delete Successfully");
  //         })
  //     },
  //     reject: () => {
  //     }
  //   });
  // }

  // /**This method is used to delete Method Rules */
  // deleteRules() {
  //   let selectedRules = this.selectedMethodRules;
  //   let arrRulesIndex = [];
  //   for (let index in selectedRules) {
  //     arrRulesIndex.push(selectedRules[index]);
  //   }
  //   this.deleteRulesFromTable(arrRulesIndex);
  // }

  // /**This method returns selected application row on the basis of selected row */
  // getRulesIndex(appId: any): number {
  //   for (let i = 0; i < this.methodRulesInfo.length; i++) {
  //     if (this.methodRulesInfo[i] == appId) {
  //       return i;
  //     }
  //   }
  //   return -1;
  // }

  // /**This method returns selected application row on the basis of selected row */
  // getMethodBusinessIndex(appId: any): number {
  //   for (let i = 0; i < this.businessTransMethodInfo.length; i++) {
  //     if (this.businessTransMethodInfo[i].btMethodId == appId) {
  //       return i;
  //     }
  //   }
  //   return -1;
  // }

  // /**This method is used to delete Rules from Data Table */
  // deleteRulesFromTable(arrRulesIndex: any[]): void {
  //   //For stores table row index
  //   let rowIndex: number[] = [];

  //   for (let index in arrRulesIndex) {
  //     rowIndex.push(this.getRulesIndex(arrRulesIndex[index]));
  //   }
  //   this.methodRulesInfo = deleteMany(this.methodRulesInfo, rowIndex);
  // }

  // /**This method is used to delete Rules from Data Table */
  // deleteMethodsBusinessTransactions(arrIndex) {
  //   let rowIndex: number[] = [];

  //   for (let index in arrIndex) {
  //     rowIndex.push(this.getMethodBusinessIndex(arrIndex[index]));
  //   }
  //    this.businessTransMethodInfo = deleteMany(this.businessTransMethodInfo, rowIndex);
  // }

  saveTypesValues() {
    console.log("custom  value == ", this.customValueTypeDetail)
    var inputObj = { '1': '2', '3': '4' };
    var output = [];
    for (var key in this.customValueTypeDetail) {
      // must create a temp object to set the key using a variable
      var tempObj;
      tempObj[key] = this.customValueTypeDetail[key];
       console.log(" == == == == " ,  tempObj)
      this.customTypeValueInfo.push(tempObj);
     
    }
    // this.customTypeValueInfo.push(this.customValueTypeDetail);
    this.sessionAttrTypeValueDialog = false;
  }

  // saveADDEditMethodTrans() {
  //   // this.methodRulesInfo.push(this.btMethodRulesDetail);
  //    this.configKeywordsService.addBusinessTransMethod(this.businessTransMethodDetail).subscribe(data => {
  //     this.businessTransMethodInfo.push(data)
  //   });
  //   this.addBusinessTransMethodDialog = false;
  // }

}



