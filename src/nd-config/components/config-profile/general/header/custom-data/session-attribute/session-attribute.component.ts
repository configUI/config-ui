import { Component, Input, OnInit } from '@angular/core';
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

  @Input()
  saveDisable: boolean;

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

  //holds the counter of attr Values i.e rules  for edit dialog [used in delrting rules in edit dialog]
  counterEdit: number = 0;

  constructor(private configKeywordsService: ConfigKeywordsService, private route: ActivatedRoute, private confirmationService: ConfirmationService, private configUtilityService: ConfigUtilityService) {

    this.customValueType = [];

    let arrLabel = ['String', 'Integer', 'Decimal'];
    let arrValue = ['0', '1', '2'];
    this.customValueType = ConfigUiUtility.createListWithKeyValue(arrLabel, arrValue);

    this.customValueTypeInfo = [];
  }

  ngOnInit() {
    this.loadGetSessionAttribute();
  }

  loadGetSessionAttribute(): void {
    this.route.params.subscribe((params: Params) => {
      this.profileId = params['profileId'];
      this.saveDisable = this.profileId == 1 ? true : false;
    });
    // this.configKeywordsService.getFetchSessionAttributeTable(this.profileId).subscribe(data => this.doAssignSessionAttributeTableData(data));
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
          attrName: data.attrList[i].attrName,
          attrType: data.attrList[i].attrType, 
          valName: valueNames, 
          sessAttrId: data.attrList[i].sessAttrId, 
          attrValues: data.attrList[i].attrValues,
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
    this.customValueTypeDetail["id"] = this.counterEdit + 1;
    this.customValueTypeDetail["customValTypeName"] = this.getTypeName(this.customValueTypeDetail.type);
  
    if(this.sessionAttributeDetail.attrValues == undefined)
    this.sessionAttributeDetail.attrValues = [];

    this.sessionAttributeDetail.attrValues.push(this.customValueTypeDetail);
    // this.configUtilityService.successMessage(Messages);
    this.closeValueInfoDialog();
  }

  saveADDEditSessionAttr() {

    if ((this.sessionAttributeDetail.complete == false && this.sessionAttributeDetail.specific == false) || (!this.sessionAttributeDetail.complete && !this.sessionAttributeDetail.specific)) {
      this.configUtilityService.errorMessage("Select Attribute type(s)");
    }
    //When add new Session Attribute
    else if (this.isNewSessionAttr) {
      //Check for app name already exist or not
      if (!this.checkAppNameAlreadyExist()) {
        this.saveSessionAttr();
        return;
      }
    }

    //When add edit Session Attribute
    else {
      if (this.selectedSessionAttributeList[0].attrName != this.sessionAttributeDetail.attrName) {
        if (this.checkAppNameAlreadyExist())
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
   
    this.sessionAttributeDetail.sessAttrId = this.selectedSessionAttributeList[0].sessAttrId;

    /* first triggering the request to delete the rules of the session attribute
    *  and then sending the request to add the Rules
    *  due to some backend problem in triggering same request for two task
    *  handling this case by triggering two different request until it is handled 
    *  from backend side
    */
    
    this.configKeywordsService.deleteSpecificAttrValues(this.sessionAttributeDetail.sessAttrId).
                                subscribe(data =>console.log("data"))
    
    //now triggering the request to edit the session attr 

    this.configKeywordsService.editSessionAttributeData(this.sessionAttributeDetail)
      .subscribe(data => {
        let index = this.getSessionAttributeIndex(this.sessionAttributeDetail.sessAttrId);
        this.selectedSessionAttributeList.length = 0;
        this.selectedSessionAttributeList.push(data);
        this.configUtilityService.successMessage(Messages);
        this.selectedSessionAttributeList = [];
        this.sessionAttributeComponentInfo[index] = this.setDataSessionAttribute(data)[0];
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
    this.closeDialog();
  }



  sessionAtrributeDetailSaveAndEdit() {
    // this.sessionAttributeDetail.attrValues = [];
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
  }

  setDataSessionAttribute(data): Array<SessionAtrributeComponentsData> {
    var arrTestRunData = [];
    let valueNames = "";
    if (data.attrValues == "")
      valueNames = "-";

    if (data.attrValues != null) {
      for (var i = 0; i < data.attrValues.length; i++) {
        if (data.attrValues.length == 1)
          valueNames = data.attrValues[i].valName;
        else
          valueNames = valueNames + "," + data.attrValues[i].valName;
      }
    }

    if (valueNames.indexOf(",") != -1)
      valueNames = valueNames.substr(1);

    if (valueNames == "")
      valueNames = "-";

    arrTestRunData.push({
      attrName: data.attrName,
      attrType: data.attrType,
      valName: valueNames, 
      sessAttrId: data.sessAttrId,
      attrValues:data.attrValues
    });
    return arrTestRunData;
  }

  /**opening Edit Session Attribute Dialog */
  editSessionAttribute(): void {
    this.sessionAttributeDetail = new SessionAtrributeComponentsData();
    if (!this.selectedSessionAttributeList || this.selectedSessionAttributeList.length < 1) {
      this.configUtilityService.errorMessage("Select a row to edit");
      return;
    }
    else if (this.selectedSessionAttributeList.length > 1) {
      this.configUtilityService.errorMessage("Select only one row to edit");
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

    this.sessionAttributeDetail.attrValues = this.selectedSessionAttributeList[0].attrValues;
    let that = this;
    if (this.sessionAttributeDetail.attrValues != undefined) {
      this.sessionAttributeDetail.attrValues.map(function (val) {
        val.id = that.counterEdit;
        that.counterEdit = that.counterEdit + 1;
        val.customValTypeName = that.getTypeName(val.type)
      })
    }
  }

  //function used so that type = '0' can be dispalayed as type = 'String' in table
  getTypeName(type) {
    let typeName = '';
    if (type == 0)
      typeName = 'STRING'
    else if (type == 1)
      typeName = 'INTEGER'
    else if (type == 2)
      typeName = 'DECIMAL'

    return typeName;
  }

  /**This method is used to delete Session Attribute*/
  deleteSessionAttribute(): void {
    if (!this.selectedSessionAttributeList || this.selectedSessionAttributeList.length < 1) {
      this.configUtilityService.errorMessage("Select row(s) to delete");
      return;
    }
    this.confirmationService.confirm({
      message: 'Do you want to delete the selected row?',
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
            this.configUtilityService.infoMessage("Deleted Successfully");
            this.selectedSessionAttributeList = [];
          })
      },
      reject: () => {
      }
    });
  }

  /**This method is used to delete Session Value Types */
  deleteSessionValueType() {
    if (!this.selectedSessionValueType || this.selectedSessionValueType.length < 1) {
      this.configUtilityService.errorMessage("Select row(s) to delete");
      return;
    }
    this.confirmationService.confirm({
      message: 'Do you want to delete the selected row?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        //Get Selected Applications's AppId
        let selectedRules = this.selectedSessionValueType;
        let arrRulesIndex = [];
        for (let index in selectedRules) {
          arrRulesIndex.push(selectedRules[index]);
        }
        this.deleteTypeValuesFromTable(arrRulesIndex);
        this.configUtilityService.infoMessage("Deleted Successfully");
        this.selectedSessionValueType = [];
      }
      // let selectedRules = this.selectedSessionValueType;
      // let arrRulesIndex = [];
      // for (let index in selectedRules) {
      //   arrRulesIndex.push(selectedRules[index]);
      // }
      // this.deleteTypeValuesFromTable(arrRulesIndex);
    });
  }

  /**This method returns selected Session Attribute row on the basis of selected row */
  getValuesTypeIndex(appId: any): number {
    for (let i = 0; i < this.sessionAttributeDetail.attrValues.length; i++) {
      if (this.sessionAttributeDetail.attrValues[i] == appId) {
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
    this.sessionAttributeDetail.attrValues = deleteMany(this.sessionAttributeDetail.attrValues, rowIndex);
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
    this.selectedSessionAttributeList = [];
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



