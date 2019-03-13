import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SelectItem, ConfirmationService } from 'primeng/primeng';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Params } from '@angular/router';

import { ConfigKeywordsService } from '../../../../../services/config-keywords.service';
import { BTHTTPBodyConditions, BTHTTPBody } from '../../../../../containers/instrumentation-data'
import { ConfigUtilityService } from '../../../../../services/config-utility.service';
import { ConfigUiUtility } from '../../../../../utils/config-utility';
import { ImmutableArray } from '../../../../../utils/immutable-array';
import { deleteMany } from '../../../../../utils/config-utility';
import { Pipe, PipeTransform } from '@angular/core';

import { KeywordData, KeywordList } from '../../../../../containers/keyword-data';
import { Messages , addMessage , editMessage  } from '../../../../../constants/config-constant';

@Component({
    selector: 'bt-http-body',
    templateUrl: './bt-http-body.component.html',
    styleUrls: ['./bt-http-body.component.css']
})
export class BTHTTPBodyComponent implements OnInit {

    //Table data for HTTP body
    httpBodyInfo: BTHTTPBody[];

    //Table row data for HTTP Body
    httpBodyDetail: BTHTTPBody;

    //Selected row(s) data for HTTP Body
    selectedHttpBody: BTHTTPBody[];

    // Table data for HTTP Body cond
    condInfo: BTHTTPBodyConditions[] = [];

    //Table row data for HTTP Body cond
    condDetail: BTHTTPBodyConditions;

    //Selecteed row(s) data for HTTP Body cond
    selectedCond: BTHTTPBodyConditions[];

    isProfilePerm: boolean;

    //New HTTP Body rule
    isNewBodyRule: boolean = false;
    isNewBodyCond: boolean = false;
    addCondDialog: boolean = false;
    editcond: boolean = false;

    addNewRuleDialog: boolean = false;
    httpBodyDelete = [];
    profileId: number;

    btNameList: SelectItem[];
    opCodeName: SelectItem[];
    dataType: SelectItem[];
    saveDisable: boolean = false;

    //Counter for adding/editing cond
    condBodyCount: number = 0;
    condBodyCountEdit: number = 0;

    disableDataType: boolean = false;

    constructor(private route: ActivatedRoute, private configKeywordsService: ConfigKeywordsService, private store: Store<KeywordList>, private configUtilityService: ConfigUtilityService, private confirmationService: ConfirmationService) {
    }

    ngOnInit() {
        this.isProfilePerm = +sessionStorage.getItem("ProfileAccess") == 4 ? true : false;
        this.route.params.subscribe((params: Params) => {
            this.profileId = params['profileId'];
            if (this.profileId == 1 || this.profileId == 777777 || this.profileId == 888888)
                this.saveDisable = true;
        });
        this.btNameList = [];
        var name = ['XML'];
        var val = ['XML'];

        this.btNameList = ConfigUiUtility.createListWithKeyValue(name, val);

        //Request to get all BT HTTP body data
        this.configKeywordsService.getBtHttpBodyData(this.profileId).subscribe(data => {
            this.httpBodyInfo = data;
            this.modifyBodyData(data);
        });
    }


    //Open add dialog for BT HTTP body
    openAddNewBodyRule() {
        this.isNewBodyRule = true;
        this.httpBodyDetail = new BTHTTPBody();
        this.condDetail = new BTHTTPBodyConditions();
        this.loadopCodeName()
        this.addNewRuleDialog = true;
        this.condInfo = []
        this.disableDataType = false
    }

    //Method to add and edit BT HTTP body data
    saveAddEditHttpBody() {
        //When add new HTTP body
        if (this.isNewBodyRule) {
            if(this.checkXpathAlreadyExist()){
                return;
            }
            this.saveHttpBody();
        }

        //When add edit HTTP body
        else {
            if(this.selectedHttpBody[0].xpath != this.httpBodyDetail.xpath){
                if(this.checkXpathAlreadyExist()){
                    return;
                }
            }
            this.editHttpBody();
        }
    }

    //Open edit dialog for BT HTTP body
    openEditHttpBody() {
        this.httpBodyDetail = new BTHTTPBody();
        this.condDetail = new BTHTTPBodyConditions();
        if (!this.selectedHttpBody || this.selectedHttpBody.length < 1) {
            this.configUtilityService.errorMessage("Select a row to edit");
            return;
        }
        else if (this.selectedHttpBody.length > 1) {
            this.configUtilityService.errorMessage("Select only one row to edit");
            return;
        }
        else {
            this.isNewBodyRule = false;
            this.addNewRuleDialog = true;
            this.isNewBodyCond = true;
            let that = this;
            this.httpBodyDelete = [];
            this.httpBodyDetail = Object.assign({}, this.selectedHttpBody[0]);
            this.loadopCodeName();
            this.condInfo = this.selectedHttpBody[0].cond;
            //providing id for editing cond in edit body form
            this.condInfo.map(function (val) {
                val.id = that.condBodyCountEdit;
                that.condBodyCountEdit = that.condBodyCountEdit + 1;
            })
        }
        this.disableDataType = true;
        // this.selectedHttpBody = [];

    }

    //opens add http body condition dialog
    openCondDialog() {
        if(this.httpBodyDetail.dataType == null){
            this.configUtilityService.errorMessage("Select Data Type")
            return
        }
        this.addCondDialog = true;
        this.isNewBodyCond = true;
        this.condDetail = new BTHTTPBodyConditions();
        this.loadopCodeName();
    }

    //Opens Edit condition window
    openEditCondDialog() {
        if (!this.selectedCond || this.selectedCond.length < 1) {
            this.configUtilityService.errorMessage("Select a row to edit");
        }
        else if (this.selectedCond.length > 1) {
            this.configUtilityService.errorMessage("Select only one row to edit")
        }
        else {
            this.isNewBodyCond = false;
            this.editcond = true;
            this.addCondDialog = true;

            this.condDetail = Object.assign({}, this.selectedCond[0]);
            this.loadopCodeName()
            if (this.selectedCond[0].btName == '-')
                this.condDetail.btName = '';

            if (this.selectedCond[0].value == '-')
                this.condDetail.value = '';
            
            this.condDetail.opCode = this.selectedCond[0].opCode;
        }

    }


//MEthod to save/edit BT HTTP body conditions
    saveBodyConditions() {
        if (this.condDetail.btName == '' || this.condDetail.btName == null) {
            this.condDetail.btName = "-"
        }
        if (this.condDetail.opCode == 'VALUE') {
            this.condDetail.value = "-"
        }
        //EDIT functionality
        if (!this.isNewBodyRule) {
            if (this.editcond) {
                //In edit form to edit cond
                // Purpose: The below if block is required for checking redundancy for  BT Name 
                if (this.selectedCond[0].btName != this.condDetail.btName) {
                    if (this.checkBodybtNameAlreadyExist()) {
                        return;
                    }
                }

                this.isNewBodyCond = false;
                this.editcond = false;
                let that = this;
                this.condInfo.map(function (val) {
                    if (val.id == that.condDetail.id) {
                        val.btName = that.condDetail.btName;
                        val.value = that.condDetail.value;
                        val.opCode = that.condDetail.opCode;
                    }
                });
                this.selectedCond = [];
            }

            else {
                if (this.checkBodybtNameAlreadyExist()) {
                    return;
                }
                this.isNewBodyCond = true;
                this.condDetail["id"] = this.condBodyCountEdit;
                this.condInfo = ImmutableArray.push(this.condInfo, this.condDetail);
                this.condBodyCountEdit = this.condBodyCountEdit + 1;
            }
        }

        //ADD functionality
        else {
            //In add form, to edit cond
            if (this.editcond) {
                // Purpose: The below if block is required for checking redundancy for Bt Name
                if (this.selectedCond[0].btName != this.condDetail.btName) {
                    if (this.checkBodybtNameAlreadyExist()) {
                        return;
                    }
                }
                this.isNewBodyCond = false;
                this.editcond = false;
                let that = this;
                this.condInfo.map(function (val) {
                    if (val.id == that.condDetail.id) {
                        val.btName = that.condDetail.btName;
                        val.value = that.condDetail.value;
                        val.opCode = that.condDetail.opCode;
                    }
                });
                this.selectedCond = [];
            }

            else {
                if (this.checkBodybtNameAlreadyExist()) {
                    return;
                }
                else //In add form to add cond
                {
                    this.isNewBodyCond = true;
                    this.condDetail["id"] = this.condBodyCount;
                    this.condInfo = ImmutableArray.push(this.condInfo, this.condDetail);
                    this.condBodyCount = this.condBodyCount + 1;
                }
            }
        }
        this.disableDataType = true;
        this.addCondDialog = false;
    }


    //To load operation code dropdown
    loadopCodeName() {

        this.dataType = [];
        this.condDetail.opCode = null
        var dataName = ['Numeric', 'String or Object', 'Boolean', 'Value'];
        var dataVal = ['0', '1', '2', '4'];

        this.dataType = ConfigUiUtility.createListWithKeyValue(dataName, dataVal);

        this.opCodeName = [];
        if (this.httpBodyDetail.dataType == '0') {
            var opName = ['Equals', 'Not equals', 'Less than', 'Greater than', 'Less than equal to', 'Greater than equal to', 'EXCEPTION'];
            var opVal = ['EQ', 'NE', 'LT', 'GT', 'LE', 'GE', 'EXCEPTION'];
        }
        else if (this.httpBodyDetail.dataType == '1') {
            var opName = ['EQUALS', 'NOT_EQUALS', 'CONTAINS', 'STARTS_WITH', 'ENDS_WITH', 'EXCEPTION'];
            var opVal = ['EQUALS', 'NOT_EQUALS', 'CONTAINS', 'STARTS_WITH', 'ENDS_WITH', 'EXCEPTION'];
        }
        else if (this.httpBodyDetail.dataType == '2') {
            var opName = ['TRUE', 'FALSE', 'EXCEPTION'];
            var opVal = ['TRUE', 'FALSE', 'EXCEPTION'];
        }
        else if (this.httpBodyDetail.dataType == '4') {
            var opName = ['VALUE'];
            var opVal = ['VALUE'];
        }

        this.opCodeName = ConfigUiUtility.createListWithKeyValue(opName, opVal);
    }

    //Method to check redundancy for BT Name
    checkBodybtNameAlreadyExist(): boolean {
        for (let i = 0; i < this.condInfo.length; i++) {
            if (this.condInfo[i].btName == this.condDetail.btName) {
                this.configUtilityService.errorMessage("BT Name already exist");
                return true;
            }
        }
    }

    //Method to delete http body conditions
    deleteConditions() {
        if (!this.selectedCond || this.selectedCond.length < 1) {
            this.configUtilityService.errorMessage("Select row(s) to delete");
            return;
        }
        let selectCond = this.selectedCond;
        let arrCondIndex = [];
        for (let index in selectCond) {
            arrCondIndex.push(selectCond[index]);
            if (selectCond[index].hasOwnProperty('condId')) {
                this.httpBodyDelete.push(selectCond[index].condId);
            }
        }
        this.deleteBodyConditionFromTable(arrCondIndex);
        this.selectedCond = [];
        if(this.condInfo.length == 0){
            this.disableDataType = false;
        }
    }

    /**This method is used to delete cond from Data Table */
    deleteBodyConditionFromTable(arrCondIndex: any[]): void {
        //For stores table row index
        let rowIndex: number[] = [];

        if (arrCondIndex.length < 1) {
            this.configUtilityService.errorMessage("Select row(s) to delete");
            return;
        }
        for (let index in arrCondIndex) {
            rowIndex.push(this.getBodyCondIndex(arrCondIndex[index]));
        }
        this.condInfo = deleteMany(this.condInfo, rowIndex);
    }

    /**This method returns selected condition row on the basis of selected row */
    getBodyCondIndex(appId: any): number {
        for (let i = 0; i < this.condInfo.length; i++) {
            if (this.condInfo[i] == appId) {
                return i;
            }
        }
        return -1;
    }

    //Method to save new HTTP Body
    saveHttpBody() {
        this.httpBodyDetail.cond = [];

        this.httpBodyDetail.cond = this.condInfo;
        if (this.condInfo.length == 0) {
            this.configUtilityService.errorMessage("Provide condition(s) for selected Body rule");
            return;
        }
        this.configKeywordsService.addBtHttpBody(this.httpBodyDetail, this.profileId).subscribe(data => {
            this.httpBodyInfo = ImmutableArray.push(this.httpBodyInfo, data);
            
            this.configUtilityService.successMessage(addMessage);
            this.modifyBodyData(this.httpBodyInfo);

        });
        this.addNewRuleDialog = false;
    }

            //Method to check redundancy for XPath
            checkXpathAlreadyExist(): boolean {
                for (let i = 0; i < this.httpBodyInfo.length; i++) {
                    if (this.httpBodyInfo[i].xpath == this.httpBodyDetail.xpath) {
                        this.configUtilityService.errorMessage("X Path already exists");
                        return true;
                    }
                }
            }

    /**This method is used to delete BT HTTP Body*/
    deleteBTHTTPBody(): void {
        if (!this.selectedHttpBody || this.selectedHttpBody.length < 1) {
            this.configUtilityService.errorMessage("Select row(s) to delete");
            return;
        }
        this.confirmationService.confirm({
            message: 'Do you want to delete the selected row?',
            header: 'Delete Confirmation',
            icon: 'fa fa-trash',
            accept: () => {
                //Get Selected body's id
                let selectedApp = this.selectedHttpBody;
                let arrAppIndex = [];
                for (let index in selectedApp) {
                    arrAppIndex.push(selectedApp[index].id);
                }
                this.configKeywordsService.deleteBTHTTPBody(arrAppIndex, this.profileId)
                    .subscribe(data => {
                        this.deleteBtHttpBody(arrAppIndex);
                        this.selectedHttpBody = [];
                        this.configUtilityService.infoMessage("Deleted Successfully");
                    })
            },
            reject: () => {
            }
        });
    }

    /**This method is used to delete body from Data Table */
    deleteBtHttpBody(arrIndex) {
        let rowIndex: number[] = [];

        for (let index in arrIndex) {
            rowIndex.push(this.getBodyIndex(arrIndex[index]));
        }
        this.httpBodyInfo = deleteMany(this.httpBodyInfo, rowIndex);
    }

    /**This method returns selected body row on the basis of selected row */
    getBodyIndex(appId: any): number {
        for (let i = 0; i < this.httpBodyInfo.length; i++) {
            if (this.httpBodyInfo[i].id == appId) {
                return i;
            }
        }
        return -1;
    }

    //Method to show bt names seperated by commas in BT HTTP body table
    modifyBodyData(data) {
        let that = this;
        data.map(function (val) {
            if (val.cond != null && val.cond.length != 0) {
                let btNames = that.getBodybtNames(val.cond);
                val.bodyBtNames = btNames
            }
            else {
                val.bodyBtNames = "NA"
            }
        })
        this.httpBodyInfo = data
    }

    getBodybtNames(data) {
        let btNamesHref = '';
        data.map(function (val, index) {
            if (index != (data.length - 1)) {
                if (val.btName == null) {
                    btNamesHref = btNamesHref + " - " + ",";
                }
                else
                    btNamesHref = btNamesHref + val.btName + ",";
            }
            else {
                if (val.btName == null) {
                    btNamesHref = btNamesHref + " - "
                }
                else
                    btNamesHref = btNamesHref + val.btName
            }
        })
        return btNamesHref;
    }

    //Method to edit HTTP Body
    editHttpBody() {
        if (this.condInfo.length == 0) {
            this.configUtilityService.errorMessage("Provide conditions for selected HTTP Body");
            return;
        }
        this.httpBodyDetail.cond = this.condInfo;
        this.httpBodyDetail.id = this.selectedHttpBody[0].id;
        /****for edit case
      *  first triggering the request to delete the  cond and
      *  when response comes then triggering request to add the new HTTP Body
      *
      */
        this.selectedHttpBody = [];
        this.configKeywordsService.deleteHTTPBodyConditions(this.httpBodyDelete).subscribe(data => {
            let that = this;
            //Edit call, sending row data to service
            this.configKeywordsService.editBTHTTPBody(this.httpBodyDetail).subscribe(data => {

                this.httpBodyInfo.map(function (val) {
                    if (val.id == data.id) {
                        val.cond = data.cond;
                        val.bodyType = data.bodyType;
                        val.xpath = data.xpath;
                        val.bodyBtNames = data.bodyBtNames
                        val.id = data.id;
                    }
                    if (val.cond != null && val.cond.length != 0) {
                        let btNames = that.getBodybtNames(val.cond);
                        val.bodyBtNames = btNames
                    }
                    else {
                        val.bodyBtNames = "NA"
                    }

                });
                this.configUtilityService.successMessage(editMessage);
            });
        })
        this.closeBodyDialog();
    }

    //To check if data type drop down is disabled
    checkIfDisabled(){

        if(this.disableDataType == true){
            this.configUtilityService.infoMessage("Delete configured rule(s) to change Data Type")
            return;
        }
    }

    //Closing BT HTTP Body dialog
    closeBodyDialog() {
        this.addNewRuleDialog = false;
    }
}

//It will convert the values of data type from 0, 1, 2 and 4 to Numeric, String or Object, Boolean and Value respectively
@Pipe({ name: 'dataTypeVal' })
export class PipeForDataType implements PipeTransform {

  transform(value: string): string {
    let label = "";
    if (value == '0')
      label = 'Numeric';
    if (value == '1')
      label = 'String or Object';
    if (value == '2')
      label = 'Boolean';
    if(value == '4')
      label = 'Value'
    return label;
  }
}
