import { Component, OnInit } from '@angular/core';
import { ConfigKeywordsService } from '../../../../../../services/config-keywords.service';
import { SessionAtrributeComponentsData, SessionTypeValueData } from '../../../../../../containers/instrumentation-data';
import { ConfigUiUtility } from '../../../../../../utils/config-utility';
import { SelectItem, ConfirmationService } from 'primeng/primeng';
import { ActivatedRoute, Params } from '@angular/router';
import { ConfigUtilityService } from '../../../../../../services/config-utility.service';
import { deleteMany } from '../../../../../../utils/config-utility';

@Component({
  selector: 'app-session-attribute',
  templateUrl: './session-attribute.component.html',
  styleUrls: ['./session-attribute.component.css']
})
export class SessionAttributeComponent implements OnInit {

  profileId: number;

  sessionAttributeComponentInfo: SessionAtrributeComponentsData[];

  /* Add new Session Attribute Dialog open */
  isNewSessionAttr: boolean = false;
  addEditSessionAttrDialog: boolean = false;
  sessionAttrTypeValueDialog: boolean = false;

  selectedSessionAttributeList: any[];
  selectedSessionValueType: any[];

  customValueType: SelectItem[];
  /* Assign selected dropdown values to selected method type */
  selectedCustomValueType: string;

  sessionAttributeDetail: SessionAtrributeComponentsData;
  customValueTypeDetail: SessionTypeValueData;
  customValueTypeInfo: SessionTypeValueData[];

  constructor(private configKeywordsService: ConfigKeywordsService, private route: ActivatedRoute, private confirmationService: ConfirmationService, private configUtilityService: ConfigUtilityService) {

    this.customValueType = [];
    let arrLabel = ['String', 'Integer', 'Decimal'];
    //  let arrValue = ['string', 'integer', 'decimal'];
    this.customValueType = ConfigUiUtility.createDropdown(arrLabel);
    this.customValueTypeInfo = [];

  }

  ngOnInit() {
    this.loadGetSessionAttribute();
  }

  loadGetSessionAttribute(): void {
    this.route.params.subscribe((params: Params) => {
      this.profileId = params['profileId'];
    });
    this.configKeywordsService.getFetchSessionAttributeTable(this.profileId).subscribe(data => this.doAssignSessionAttributeTableData(data));
  }

  doAssignSessionAttributeTableData(data) {
    this.sessionAttributeComponentInfo = this.filterTRData(data)
  }
  filterTRData(data): Array<SessionAtrributeComponentsData> {
    var arrTestRunData = [];
    for (var i = 0; i < data.attrList.length; i++) {
      let valueNames = "";
      if (data.attrList[i].attrValues == "") {
        if (data.attrList[i].attrType == "complete")
          valueNames = "NA";
        else
          valueNames = "Add Values";
      }
      for (var j = 0; j < data.attrList[i].attrValues.length; j++) {
        if (data.attrList[i].attrValues.length == 1)
          valueNames = data.attrList[i].attrValues[j].valName;
        else
          valueNames = valueNames + "," + data.attrList[i].attrValues[j].valName;
      }

      arrTestRunData.push({
        attrName: data.attrList[i].attrName, attrType: data.attrList[i].attrType, valName: valueNames, sessAttrId: data.attrList[i].sessAttrId,
      });
    }
    return arrTestRunData;
  }

  /* Open Dialog for Add Session Attribute */
  opensSessionAttributeDialog() {
    this.sessionAttributeDetail = new SessionAtrributeComponentsData();
    this.isNewSessionAttr = true;
    this.customValueTypeInfo = [];
    this.addEditSessionAttrDialog = true;

  }

  /** This method is used to open a dialog for add Type Values
    */
  openSessionAttrTypeValueDialog() {
    this.customValueTypeDetail = new SessionTypeValueData();
    this.sessionAttrTypeValueDialog = true;
  }

  saveTypesValues() {
    this.customValueTypeInfo.push(this.customValueTypeDetail);
    this.sessionAttrTypeValueDialog = false;
  }

  saveADDEditSessionAttr() {
    let type: number;
    this.sessionAttributeDetail.attrValues = [];
    if (this.sessionAttributeDetail.complete == true && this.sessionAttributeDetail.specific == true)
      this.sessionAttributeDetail.attrType = "complete,specific";
    else if (this.sessionAttributeDetail.specific == true)
      this.sessionAttributeDetail.attrType = "specific";
    else if (this.sessionAttributeDetail.complete == true)
      this.sessionAttributeDetail.attrType = "complete";

    for (let i = 0; i < this.customValueTypeInfo.length; i++) {

      if (this.customValueTypeInfo[i].customValTypeName == "Integer")
        type = 0;
      else if (this.customValueTypeInfo[i].customValTypeName == "String")
        type = 1;
      else if (this.customValueTypeInfo[i].customValTypeName == "Decimal")
        type = 2;

      this.sessionAttributeDetail.attrValues[i] = { type: type, id: i, lb: this.customValueTypeInfo[i].lb, rb: this.customValueTypeInfo[i].rb, customValTypeName: this.customValueTypeInfo[i].customValTypeName, valName: this.customValueTypeInfo[i].valName };
    }

    this.configKeywordsService.addSessionAttributeData(this.sessionAttributeDetail, this.profileId).subscribe(data => {

      let arrSessionAttr = this.setDataSessionAttribute(data);
      this.sessionAttributeComponentInfo.push(arrSessionAttr[0]);
    });
    this.addEditSessionAttrDialog = false;
  }

  setDataSessionAttribute(data): Array<SessionAtrributeComponentsData> {
    var arrTestRunData = [];
    let valueNames = "";
    for (var i = 0; i < data.attrValues.length; i++) {
      console.log(" === ", data.attrType)
      if (data.attrValues == "") {
        if (data.attrType == "complete")
          valueNames = "NA";
        else
          valueNames = "Add Values";
      }
      if (data.attrValues.length == 1)
        valueNames = data.attrValues[i].valName;
      else
        valueNames = valueNames + "," + data.attrValues[i].valName;
    }
    arrTestRunData.push({
      attrName: data.attrName, attrType: data.attrType, valName: valueNames, sessAttrId: data.sessAttrId,
    });
    return arrTestRunData;
  }

  /** Edit Session Attribute */
  editSessionAttribute(): void {
    this.sessionAttributeDetail = new SessionAtrributeComponentsData();
    if (!this.selectedSessionAttributeList || this.selectedSessionAttributeList.length < 1) {
      this.configUtilityService.errorMessage("Select row for edit");
      return;
    }
    else if (this.selectedSessionAttributeList.length > 1) {
      this.configUtilityService.errorMessage("Select only one row for edit");
      return;
    }

    this.addEditSessionAttrDialog = true;
    this.isNewSessionAttr = false;
    this.sessionAttributeDetail = Object.assign({}, this.selectedSessionAttributeList[0]);
  }

  /**This method is used to delete Session Attribute*/
  deleteSessionAttribute(): void {
    if (!this.selectedSessionAttributeList || this.selectedSessionAttributeList.length < 1) {
      this.configUtilityService.errorMessage("Please select for delete");
      return;
    }
    this.confirmationService.confirm({
      message: 'Do you want to delete the selected record?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        //Get Selected Applications's AppId
        let selectedApp = this.selectedSessionAttributeList;
        let arrAppIndex = [];
        for (let index in selectedApp) {
          arrAppIndex.push(selectedApp[index].sessAttrId);
        }
        this.configKeywordsService.deleteSessionAttributeData(arrAppIndex)
          .subscribe(data => {
            this.deleteSessionAttributeIndex(arrAppIndex);
            this.configUtilityService.infoMessage("Delete Successfully");
            this.selectedSessionAttributeList = [];
          })
      },
      reject: () => {
      }
    });
  }

  /**This method is used to delete Session Value Types */
  deleteSessionValueType() {
    let selectedRules = this.selectedSessionValueType;
    let arrRulesIndex = [];
    for (let index in selectedRules) {
      arrRulesIndex.push(selectedRules[index]);
    }
    this.deleteTypeValuesFromTable(arrRulesIndex);
  }

  /**This method returns selected Session Attribute row on the basis of selected row */
  getValuesTypeIndex(appId: any): number {
    for (let i = 0; i < this.customValueTypeInfo.length; i++) {
      if (this.customValueTypeInfo[i] == appId) {
        return i;
      }
    }
    return -1;
  }

  /**This method returns selected application row on the basis of selected row */
  getSessionAttributeIndex(appId: any): number {

    for (let i = 0; i < this.sessionAttributeComponentInfo.length; i++) {
      if (this.sessionAttributeComponentInfo[i].sessAttrId == appId) {
        return i;
      }
    }
    return -1;
  }

  /**This method is used to delete Rules from Data Table */
  deleteTypeValuesFromTable(arrRulesIndex: any[]): void {
    //For stores table row index
    let rowIndex: number[] = [];

    for (let index in arrRulesIndex) {
      rowIndex.push(this.getValuesTypeIndex(arrRulesIndex[index]));
    }
    this.customValueTypeInfo = deleteMany(this.customValueTypeInfo, rowIndex);
  }

  /**This method is used to delete Session Attribute from Data Table */
  deleteSessionAttributeIndex(arrIndex) {
    let rowIndex: number[] = [];

    for (let index in arrIndex) {
      rowIndex.push(this.getSessionAttributeIndex(arrIndex[index]));
    }
    this.sessionAttributeComponentInfo = deleteMany(this.sessionAttributeComponentInfo, rowIndex);
  }

  closeDialog() {
   this.addEditSessionAttrDialog = false;
  }

}



