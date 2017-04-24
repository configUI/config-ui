import { Component, OnInit } from '@angular/core';
import { ConfigKeywordsService } from '../../../../../../services/config-keywords.service';
import { SessionAtrributeComponentsData, SessionTypeValueData } from '../../../../../../containers/instrumentation-data';
import { ConfigUiUtility } from '../../../../../../utils/config-utility';
import { SelectItem, ConfirmationService } from 'primeng/primeng';
import { ActivatedRoute, Params } from '@angular/router';
import { ConfigUtilityService } from '../../../../../../services/config-utility.service';
import { deleteMany } from '../../../../../../utils/config-utility';

import { Messages } from '../../../../../../constants/config-constant'

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

  selectedSessionAttributeList: SessionAtrributeComponentsData[];
  selectedSessionValueType: any[];

  customValueType: SelectItem[];
  /* Assign selected dropdown values to selected method type */
  selectedCustomValueType: string;

  selectedSessionAttribute: string;

  sessionAttributeDetail: SessionAtrributeComponentsData;
  customValueTypeDetail: SessionTypeValueData;
  customValueTypeInfo: SessionTypeValueData[];
  selectedSessionAttribute;

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
    this.selectedSessionAttribute = data.sessionType;
    this.sessionAttributeComponentInfo = this.filterTRData(data);
  }
  filterTRData(data): Array<SessionAtrributeComponentsData> {
    var arrTestRunData = [];
    if (data.attrList != null) {
      for (var i = 0; i < data.attrList.length; i++) {
        let valueNames = "";
        if (data.attrList[i].attrValues == "") {
          valueNames = "-";
        }
        for (var j = 0; j < data.attrList[i].attrValues.length; j++) {
          if (data.attrList[i].attrValues.length == 1)
            valueNames = valueNames + data.attrList[i].attrValues[j].valName;
          else
            valueNames = valueNames + "," + data.attrList[i].attrValues[j].valName;
        }

        if (valueNames.indexOf(",") != -1)
          valueNames = valueNames.substr(1);

        arrTestRunData.push({
          attrName: data.attrList[i].attrName, attrType: data.attrList[i].attrType, valName: valueNames, sessAttrId: data.attrList[i].sessAttrId, attrValues: data.attrList[i].attrValues,
        });
      }
      return arrTestRunData;
    }
    else
      return null;
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
    this.configUtilityService.successMessage(Messages);
    this.sessionAttrTypeValueDialog = false;
  }

  saveADDEditSessionAttr() {
    //When add new Session Attribute
    if (this.isNewSessionAttr) {
      //Check for app name already exist or not
      if (!this.checkAppNameAlreadyExist()) {
        this.saveSessionAttr();
        return;
      }
    }
    //When add edit Session Attribute
    else {
      if (this.sessionAttributeComponentInfo[0].sessAttrId != this.sessionAttributeDetail.sessAttrId) {
        if (this.checkAppNameAlreadyExist() || this.sessionAttributeComponentInfo[0] == this.sessionAttributeDetail)
          return;
      }
      this.editSessionAttr();
    }
  }

  /**This method is used to validate the name of Session Attribute is already exists. */
  checkAppNameAlreadyExist(): boolean {
    for (let i = 0; i < this.sessionAttributeComponentInfo.length; i++) {
      if (this.sessionAttributeComponentInfo[i].attrName == this.sessionAttributeDetail.attrName) {
        this.configUtilityService.errorMessage("Session Attribute Name already exist");
        return true;
      }
    }
  }

  editSessionAttr() {
    this.sessionAtrributeDetailSaveAndEdit();
    this.configKeywordsService.editSessionAttributeData(this.sessionAttributeDetail)
      .subscribe(data => {
        let index = this.getSessionAttributeIndex(this.sessionAttributeDetail.sessAttrId);
        this.selectedSessionAttributeList.length = 0;
        this.selectedSessionAttributeList.push(data);
        this.sessionAttributeComponentInfo[index] = data;
      });
    this.closeDialog();
  }

  saveSessionAttr() {
    this.sessionAtrributeDetailSaveAndEdit();
    this.configKeywordsService.addSessionAttributeData(this.sessionAttributeDetail, this.profileId).subscribe(data => {

      let arrSessionAttr = this.setDataSessionAttribute(data);
      this.sessionAttributeComponentInfo.push(arrSessionAttr[0]);
      this.configUtilityService.successMessage(Messages);
    });
    this.addEditSessionAttrDialog = false;
  }

  sessionAtrributeDetailSaveAndEdit() {
    this.sessionAttributeDetail.attrValues = [];
    let type: number;
    if (this.sessionAttributeDetail.complete == true && this.sessionAttributeDetail.specific == true) {
      this.sessionAttributeDetail.attrType = "complete,specific";
      this.sessionAttributeDetail.attrMode = 3;
    }
    else if (this.sessionAttributeDetail.specific == true) {
      this.sessionAttributeDetail.attrType = "specific";
      this.sessionAttributeDetail.attrMode = 1;
    }
    else if (this.sessionAttributeDetail.complete == true) {
      this.sessionAttributeDetail.attrType = "complete";
      this.sessionAttributeDetail.attrMode = 2;
    }
    for (let i = 0; i < this.customValueTypeInfo.length; i++) {

      if (this.customValueTypeInfo[i].customValTypeName == "Integer")
        type = 0;
      else if (this.customValueTypeInfo[i].customValTypeName == "String")
        type = 1;
      else if (this.customValueTypeInfo[i].customValTypeName == "Decimal")
        type = 2;

      this.sessionAttributeDetail.attrValues[i] = { type: type, id: i, lb: this.customValueTypeInfo[i].lb, rb: this.customValueTypeInfo[i].rb, customValTypeName: this.customValueTypeInfo[i].customValTypeName, valName: this.customValueTypeInfo[i].valName };
    }
  }

  setDataSessionAttribute(data): Array<SessionAtrributeComponentsData> {
    var arrTestRunData = [];
    let valueNames = "";
    if (data.attrValues == "")
      valueNames = "-";

    for (var i = 0; i < data.attrValues.length; i++) {
      if (data.attrValues.length == 1)
        valueNames = data.attrValues[i].valName;
      else
        valueNames = valueNames + "," + data.attrValues[i].valName;
    }

    if (valueNames.indexOf(",") != -1)
      valueNames = valueNames.substr(1);

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
   
    if (this.selectedSessionAttributeList[0].attrType == "complete,specific") {
      this.sessionAttributeDetail.complete = true;
      this.sessionAttributeDetail.specific = true;
    }
    else if (this.selectedSessionAttributeList[0].attrType == "specific")
      this.sessionAttributeDetail.specific = true;
    else if (this.selectedSessionAttributeList[0].attrType == "complete")
      this.sessionAttributeDetail.complete = true;

    this.sessionAttributeDetail.attrName = this.selectedSessionAttributeList[0].attrName;
    this.selectedSessionAttributeList[0].attrValues = [];
    if (this.selectedSessionAttributeList[0].attrValues.length != 0) {
      for (let i = 0; i < this.selectedSessionAttributeList[0].attrValues.length; i++) {
        this.customValueTypeInfo[i] = this.selectedSessionAttributeList[0].attrValues[i];
      }
    }
    //this.sessionAttributeDetail = Object.assign({}, this.selectedSessionAttributeList[0]);
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
  closeValueInfoDialog(): void {

    this.sessionAttrTypeValueDialog = false;
  }

  /* set Value of All or Specific which Selected */
  getSelectedAtribute() {
    let sessionType = { sessionType: this.selectedSessionAttribute };
    this.configKeywordsService.getSessionAttributeValue(sessionType, this.profileId).subscribe(data => this.selectedSessionAttribute = data["sessionType"]);
  }



}



