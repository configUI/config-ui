import { Component, Input, OnInit } from '@angular/core';
import { ConfigUiUtility } from '../../../../../utils/config-utility';
import { ConfigKeywordsService } from '../../../../../services/config-keywords.service';
import { HTTPResponseHdrComponentData, RulesHTTPResponseHdrComponentData } from '../../../../../containers/instrumentation-data';
import { httpReqHeaderInfo } from '../../../../../interfaces/httpReqHeaderInfo';
import { ConfigUtilityService } from '../../../../../services/config-utility.service';
import { SelectItem, ConfirmationService } from 'primeng/primeng';
import { ActivatedRoute, Params } from '@angular/router';
import { deleteMany } from '../../../../../utils/config-utility';
import { ImmutableArray } from '../../../../../utils/immutable-array';
import { Messages } from '../../../../../constants/config-constant'

@Component({
    selector: 'app-http-response',
    templateUrl: './http-response.component.html',
    styleUrls: ['./http-response.component.css']
})
export class HttpResponseComponent implements OnInit {
    @Input()
    saveDisable: boolean;

    profileId: number;

    httpResponseHdrComponentInfo: HTTPResponseHdrComponentData[];

    /* Add and Edit HTTP Request Dialog open */
    httpResponseCustomDialog: boolean = false;

    /* Add and edit http request custom settings dialog */
    rulesDialog: boolean = false;
    isNew: boolean = false;
    editSpecific: RulesHTTPResponseHdrComponentData;

    httpResponseHdrDetail: HTTPResponseHdrComponentData;
    httpResponseHdrInfo: HTTPResponseHdrComponentData[];
    selectedHTTPRepHeader: any[];

    rulesDataDetail: RulesHTTPResponseHdrComponentData;
    rulesDataInfo: RulesHTTPResponseHdrComponentData[];
    selectedRulesData: any[];

    customValueType: SelectItem[];

    //holding table data
    arrTestRunData = [];

    editCustomSettings: boolean = false;

    counterEdit: number = 0;
    counterAdd: number = 0;

    isNewRule: boolean;

    httpAtrributeDelete = [];

    selectedHTTPRepHdrType: string;

    isProfilePerm: boolean;

    constructor(private route: ActivatedRoute, private configKeywordsService: ConfigKeywordsService, private configUtilityService: ConfigUtilityService, private confirmationService: ConfirmationService) {
        this.customValueType = [];
        this.rulesDataInfo = [];
        let arrLabel = ['String', 'Integer', 'Decimal'];
        let arrValue = ['String', 'Integer', 'Decimal'];
        this.customValueType = ConfigUiUtility.createListWithKeyValue(arrLabel, arrValue);
    }

    ngOnInit() {
        this.isProfilePerm = +sessionStorage.getItem("ProfileAccess") == 4 ? true : false;
        this.loadHTTPRepHeaderDetails();
    }

    loadHTTPRepHeaderDetails(): void {
        this.route.params.subscribe((params: Params) => {
            this.profileId = params['profileId'];
            if (this.profileId == 1 || this.profileId == 777777 || this.profileId == 888888)
                this.saveDisable = true;
        });
        this.configKeywordsService.getFetchHTTPRepHeaderTable(this.profileId).subscribe(data => {
            this.doAssignHttpAttributeTableData(data);
            if (data["httpRepHdrType"] == "Specific") {
                this.selectedHTTPRepHdrType = "Specific";
            }
            else if (data["httpRepHdrType"] == "All")
                this.selectedHTTPRepHdrType = "All";
            else {
                this.selectedHTTPRepHdrType = "None";
            }
        });
    }

    doAssignHttpAttributeTableData(data) {
        this.httpResponseHdrComponentInfo = [];
        this.selectedHTTPRepHdrType = data.httpRepHdrType;
        //this.httpResponseHdrComponentInfo = this.filterTRData(data);
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
            httpRepHdrBasedId: row.httpRepHdrBasedId,
            rules: row.rules,
        });
        this.httpResponseHdrComponentInfo = this.arrTestRunData;
    }

    /* Open Dialog for Add HTTP Req */
    openAddHTTPRepDialog() {
        this.httpResponseHdrDetail = new HTTPResponseHdrComponentData();
        // this.rulesDataDetail = new RulesHTTPResponseHdrComponentData();
        this.rulesDataInfo = [];
        this.isNew = true;
        this.httpResponseCustomDialog = true;
    }

    /** This method is used to open a dialog for add Type Values
    */
    openHTTPRepTypeValueDialog() {
        this.rulesDataDetail = new RulesHTTPResponseHdrComponentData();
        this.rulesDialog = true;
        this.isNewRule = false;
    }

    openEditHTTPRepTypeDialog() {
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
                if (this.httpResponseHdrDetail.rules == undefined)
                    this.httpResponseHdrDetail.rules = [];
                this.httpResponseHdrDetail.rules = ImmutableArray.push(this.httpResponseHdrDetail.rules, this.rulesDataDetail);
                this.rulesDataInfo = this.httpResponseHdrDetail.rules;
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
                if (this.httpResponseHdrDetail.rules == undefined)
                    this.httpResponseHdrDetail.rules = [];
                this.httpResponseHdrDetail.rules = ImmutableArray.push(this.httpResponseHdrDetail.rules, this.rulesDataDetail);
                this.rulesDataInfo = this.httpResponseHdrDetail.rules;
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

    saveADDEditHTTPRepHeader(): void {
        if ((this.httpResponseHdrDetail.complete == false && this.httpResponseHdrDetail.specific == false) || (!this.httpResponseHdrDetail.complete && !this.httpResponseHdrDetail.specific)) {
            this.configUtilityService.errorMessage("Select HTTP response header type(s)");
        }
        //When add new Http Response header
        else if (this.isNew) {
            //Check for app name already exist or not
            if (!this.checkHttpRepNameAlreadyExist()) {
                this.saveHttpResponse();
                return;
            }
        }
        //When add edit Method
        else {
            if (this.selectedHTTPRepHeader[0].headerName != this.httpResponseHdrDetail.headerName) {
                if (this.checkHttpRepNameAlreadyExist())
                    return;
            }
            this.editHTTPResponse();
        }
    }

    /**This method is used to validate the name of Method is already exists. */
    checkHttpRepNameAlreadyExist(): boolean {
        for (let i = 0; i < this.httpResponseHdrComponentInfo.length; i++) {
            if (this.httpResponseHdrComponentInfo[i].headerName == this.httpResponseHdrDetail.headerName) {
                this.configUtilityService.errorMessage("HTTP Response Name already exist");
                return true;
            }
        }
    }

    /* Open Dialog for Edit HTTP Req */
    editHTTPResponse() {
        if (this.httpResponseHdrDetail.specific == true && this.rulesDataInfo.length == 0) {
            this.configUtilityService.errorMessage("Provide HTTP response header detail(s)");
            return;
        }
        this.HttpRepDetailSaveAndEdit();
        this.httpResponseHdrDetail.httpAttrId = this.selectedHTTPRepHeader[0].httpRepHdrBasedId;
        if (this.rulesDataInfo != []) {
            if (this.httpResponseHdrDetail.dumpMode == 2) {
                for (let index in this.rulesDataInfo) {
                    this.httpAtrributeDelete.push(this.rulesDataInfo[index].ruleId)
                }
                this.rulesDataInfo = [];
            }
        }
        /* first triggering the request to delete the rules of the Http Rep
        *  and then sending the request to add the Rules
        *  due to some backend problem in triggering same request for two task
        *  handling this case by triggering two different request until it is handled 
        *  from backend side
        */
        this.arrTestRunData = [];
        this.configKeywordsService.deleteHttpRespRules(this.httpAtrributeDelete).subscribe(data => {
            let that = this;
            this.httpAtrributeDelete = [];
            //Edit call, sending row data to service
            this.configKeywordsService.editHTTPRepHeaderData(this.httpResponseHdrDetail).subscribe(data => {
                // this.modifyData(data);
                this.httpResponseHdrComponentInfo.map(function (val) {
                    if (val.httpRepHdrBasedId == data.httpRepHdrBasedId) {   
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

    HttpRepDetailSaveAndEdit() {
        // this.sessionAttributeDetail.attrValues = [];
        let type: number;
        if (this.httpResponseHdrDetail.complete == true && this.httpResponseHdrDetail.specific == true) {
            this.httpResponseHdrDetail.attrType = "complete,specific";
            this.httpResponseHdrDetail.dumpMode = 3;
        }
        else if (this.httpResponseHdrDetail.specific == true) {
            this.httpResponseHdrDetail.attrType = "specific";
            this.httpResponseHdrDetail.dumpMode = 1;
        }
        else if (this.httpResponseHdrDetail.complete == true) {
            this.httpResponseHdrDetail.attrType = "complete";
            this.httpResponseHdrDetail.dumpMode = 2;
            this.httpResponseHdrDetail.rules = [];
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
    editHTTPRepDialog(): void {
        this.httpResponseHdrDetail = new HTTPResponseHdrComponentData();
        if (!this.selectedHTTPRepHeader || this.selectedHTTPRepHeader.length < 1) {
            this.configUtilityService.errorMessage("Select a row to edit");
            return;
        }
        else if (this.selectedHTTPRepHeader.length > 1) {
            this.configUtilityService.errorMessage("Select only one row to edit");
            return;
        }

        this.httpResponseCustomDialog = true;
        this.isNew = false;

        if (this.selectedHTTPRepHeader[0].dumpMode == "Complete,Specific") {
            this.httpResponseHdrDetail.complete = true;
            this.httpResponseHdrDetail.specific = true;
        }
        else if (this.selectedHTTPRepHeader[0].dumpMode == "Specific")
            this.httpResponseHdrDetail.specific = true;
        else if (this.selectedHTTPRepHeader[0].dumpMode == "Complete") {
            this.httpResponseHdrDetail.complete = true;
        }

        this.httpResponseHdrDetail.headerName = this.selectedHTTPRepHeader[0].headerName;

        this.httpResponseHdrDetail.rules = this.selectedHTTPRepHeader[0].rules;
        this.rulesDataInfo = this.httpResponseHdrDetail.rules;
        let that = this;
        if (this.httpResponseHdrDetail.rules != undefined) {
            this.httpResponseHdrDetail.rules.map(function (val) {
                val.id = that.counterAdd;
                that.counterAdd = that.counterAdd + 1;
                val.customValTypeName = that.getTypeName(val.type)
            })
        }
    }

    /**This method returns selected application row on the basis of selected row */
    getMethodBusinessIndex(appId: any): number {
        for (let i = 0; i < this.httpResponseHdrComponentInfo.length; i++) {
            if (this.httpResponseHdrComponentInfo[i].httpRepHdrBasedId == appId) {
                return i;
            }
        }
        return -1;
    }

    saveHttpResponse() {
        if (this.httpResponseHdrDetail.specific == true && this.rulesDataInfo.length == 0) {
            this.configUtilityService.errorMessage("Provide HTTP response header detail(s)");
            return;
        }
        this.HttpRepDetailSaveAndEdit();
        this.configKeywordsService.addHTTPRepHeaderData(this.httpResponseHdrDetail, this.profileId).subscribe(data => {
            let arrhttpAttr = this.setDataHttpAttribute(data);
            this.httpResponseHdrComponentInfo = ImmutableArray.push(this.httpResponseHdrComponentInfo, arrhttpAttr[0]);
            // this.sessionAttributeComponentInfo.push(arrSessionAttr[0]);
            this.configUtilityService.successMessage(Messages);
        });
        this.closeDialog();
    }

    setDataHttpAttribute(data): Array<HTTPResponseHdrComponentData> {
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
            httpRepHdrBasedId: data.httpRepHdrBasedId,
            rules: data.rules,
        });
        return arrTestRunData;
    }

    addReqHeaderTableData(data): Array<HTTPResponseHdrComponentData> {
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
            headerName: data.headerName, dumpMode: dumpModeTmp, valueNames: valueNames, rules: data.rules, httpRepHdrBasedId: data.httpRepHdrBasedId,
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
        this.httpResponseHdrDetail.rules = deleteMany(this.httpResponseHdrDetail.rules, rowIndex);
        this.rulesDataInfo = this.httpResponseHdrDetail.rules;
        // this.rulesDataInfo = deleteMany(this.rulesDataInfo, rowIndex);
    }

    deleteHTTPRepHeader(): void {
        if (!this.selectedHTTPRepHeader || this.selectedHTTPRepHeader.length < 1) {
            this.configUtilityService.errorMessage("Select row(s) to delete");
            return;
        }
        this.confirmationService.confirm({
            message: 'Do you want to delete the selected row?',
            header: 'Delete Confirmation',
            icon: 'fa fa-trash',
            accept: () => {
                //Get Selected Applications's AppId
                let selectedApp = this.selectedHTTPRepHeader;
                let arrAppIndex = [];
                for (let index in selectedApp) {
                    arrAppIndex.push(selectedApp[index].httpRepHdrBasedId);
                }
                this.configKeywordsService.deleteHTTPRepHeaderData(arrAppIndex, this.profileId)
                    .subscribe(data => {
                        this.deleteHTTPRepHeaderIndex(data);
                        this.configUtilityService.infoMessage("Delete Successfully");
                        this.selectedHTTPRepHeader = [];
                    })
            },
            reject: () => {
            }
        });
    }

    /**This method is used to delete HTTP response from Data Table */
    deleteHTTPRepHeaderIndex(arrIndex) {
        let rowIndex: number[] = [];

        for (let index in arrIndex) {
            rowIndex.push(this.getHTTPRepHeaderIndex(arrIndex[index]));
        }
        this.httpResponseHdrComponentInfo = deleteMany(this.httpResponseHdrComponentInfo, rowIndex);
    }

    /**This method returns selected table data row on the basis of selected row */
    getHTTPRepHeaderIndex(id: number): number {

        for (let i = 0; i < this.httpResponseHdrComponentInfo.length; i++) {
            if (this.httpResponseHdrComponentInfo[i].httpRepHdrBasedId == id) {
                return i;
            }
        }
        return -1;
    }

    /* set Value of All or Specific which Selected */
    getSelectedHTTPRepHdr() {
        if (this.saveDisable == true) { 
            return;
        }
        let httpRepHdrType = { httpRepHdrType: this.selectedHTTPRepHdrType };
        this.configKeywordsService.getHTTPResponseValue(httpRepHdrType, this.profileId).subscribe(data => this.selectedHTTPRepHdrType = data["httpRepHdrType"]);

    }


    /* Close Dialog */
    closeDialog() {
        this.selectedHTTPRepHeader = [];
        this.httpResponseCustomDialog = false;
    }

    closeRulesDialog() {
        this.rulesDialog = false;
    }
}
