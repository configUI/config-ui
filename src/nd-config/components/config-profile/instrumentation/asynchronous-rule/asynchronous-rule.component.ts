import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { AsynchronousRule } from '../../../../containers/instrumentation-data';
import { ConfigKeywordsService } from '../../../../services/config-keywords.service';
import { ConfirmationService, SelectItem } from 'primeng/primeng'
import { ConfigUtilityService } from '../../../../services/config-utility.service';

import { ImmutableArray } from '../../../../utils/immutable-array';
import { deleteMany } from '../../../../utils/config-utility';

import { KeywordData, KeywordList } from '../../../../containers/keyword-data';
import { Keywords } from '../../../../interfaces/keywords';
import { Messages, descMsg } from '../../../../constants/config-constant'

@Component({
    selector: 'app-asynchronous-rule',
    templateUrl: './asynchronous-rule.component.html',
    styleUrls: ['./asynchronous-rule.component.css']
})
export class AsynchronousRuleComponent implements OnInit {
    @Input()
    profileId: number;
    @Input()
    saveDisable: boolean;
    @Output()
    keywordData = new EventEmitter();
    /**It stores asynchronous rule data */
    asynchronousRuleData: AsynchronousRule[];
    /**It stores selected asynchronous rule data */
    selectedAsynchronousRule: AsynchronousRule[];
    /**It stores data for add/edit asynchronous rule */
    asynchronousRuleDetail: AsynchronousRule;

    subscription: Subscription;
    /**For add/edit error-detection flag */
    isNewAsynchronousRule: boolean;
    /**For open/close add/edit asynchronous rule detail */
    addEditAsynchronousRuleDialog: boolean = false;

    keywordList: string[] = ['NDAsyncRuleConfig'];
    asynchronousRule: Object;
    selectedValues: boolean;
    keywordValue: Object;
    subscriptionEG: Subscription;
    enableGroupKeyword: boolean = false;
    isProfilePerm: boolean;

    containerTypeLabel = ["Apache Tomcat", "GlassFish", "IBM WebSphere", "JBoss", "Jetty", "Oracle Weblogic"];
    containerTypeValue = ["tomcat", "glassFish", "ibm", "jBoss", "jetty", "weblogic"];

    ruleTypeLabel = ["Start", "Dispatch", "Complete"];
    ruleTypeValue = ["start", "dispatch", "complete"];

    dumpModeList = [0, 1, 2];

    containersTypeList = [];
    ruleTypesList = [];
    dumpModesList = [];

    constructor(private configKeywordsService: ConfigKeywordsService, private confirmationService: ConfirmationService, private configUtilityService: ConfigUtilityService, private store: Store<KeywordList>) {
        this.configKeywordsService.toggleKeywordData();
    }

    ngOnInit() {
        this.isProfilePerm = +sessionStorage.getItem("ProfileAccess") == 4 ? true : false;
        this.loadAsynchronousRuleList();
        if (this.profileId == 1 || this.profileId == 777777 || this.profileId == 888888)
            this.saveDisable = true;
        if (this.configKeywordsService.keywordData != undefined) {
            this.keywordValue = this.configKeywordsService.keywordData;
        }
        else {
            this.subscription = this.store.select("keywordData").subscribe(data => {
                var keywordDataVal = {}
                this.keywordList.map(function (key) {
                    keywordDataVal[key] = data[key];
                })
                this.keywordValue = keywordDataVal;
            });
        }
        this.asynchronousRule = {};
        this.keywordList.forEach((key) => {
            if (this.keywordValue.hasOwnProperty(key)) {
                this.asynchronousRule[key] = this.keywordValue[key];
                if (this.asynchronousRule[key].value == "true")
                    this.selectedValues = true;
                else
                    this.selectedValues = false;
            }
        });
    }

    //constructing tableData for table [all custom keywords list]
    createDataForDropDown() {
        this.containersTypeList = [];
        this.ruleTypesList = [];
        this.dumpModesList = [];
        // this.containersTypeList.push({ value: -1, label: '--Select --' });
        for (let i = 0; i < this.containerTypeLabel.length; i++) {
            this.containersTypeList.push({ 'value': this.containerTypeValue[i], 'label': this.containerTypeLabel[i] });
        }

        for (let i = 0; i < this.ruleTypeLabel.length; i++) {
            this.ruleTypesList.push({ 'value': this.ruleTypeValue[i], 'label': this.ruleTypeLabel[i] });
        }

        for (let i = 0; i < this.dumpModeList.length; i++) {
            this.dumpModesList.push({ 'value': this.dumpModeList[i], 'label': this.dumpModeList[i] });
        }
    }

    saveKeywordData() {
        if (this.saveDisable == true) {
            return;
        }
        let filePath = '';
        for (let key in this.asynchronousRule) {
            if (key == 'NDAsyncRuleConfig') {
                if (this.selectedValues == true) {
                    this.asynchronousRule[key]["value"] = "true";
                    // this.configUtilityService.successMessage("Asynchronous Rule settings are enabled");
                }
                else {
                    this.asynchronousRule[key]["value"] = "false";
                    // this.configUtilityService.infoMessage("Asynchronous Rule settings disabled");
                }
            }
            this.configKeywordsService.keywordData[key] = this.asynchronousRule[key];
        }
        // this.configKeywordsService.saveProfileKeywords(this.profileId);
        this.configKeywordsService.getFilePath(this.profileId).subscribe(data => {
            if (this.selectedValues == false) {
                filePath = "NA";
            }
            else {
                filePath = data["_body"];
                filePath = filePath + "/asynchronousRuleFile.txt";
            }
            this.asynchronousRule['NDAsyncRuleConfig'].path = filePath;
            this.keywordData.emit(this.asynchronousRule);
        });
    }

    /**This method is called to load data */
    loadAsynchronousRuleList() {
        this.configKeywordsService.getAsynchronousRuleList(this.profileId).subscribe(data => {
            this.asynchronousRuleData = data;
        });
    }

    /**For showing add asynchronous rule dialog */
    openAddAsynchronousRuleDialog(): void {
        this.asynchronousRuleDetail = new AsynchronousRule();
        this.isNewAsynchronousRule = true;
        this.addEditAsynchronousRuleDialog = true;
        this.createDataForDropDown();
    }

    /**For showing edit asynchronous rule dialog */
    openEditAsynchronousRuleDialog(): void {
        if (!this.selectedAsynchronousRule || this.selectedAsynchronousRule.length < 1) {
            this.configUtilityService.errorMessage("Select a row to edit");
            return;
        }
        else if (this.selectedAsynchronousRule.length > 1) {
            this.configUtilityService.errorMessage("Select only one row to edit");
            return;
        }
        this.asynchronousRuleDetail = new AsynchronousRule();
        this.isNewAsynchronousRule = false;
        this.addEditAsynchronousRuleDialog = true;
        this.createDataForDropDown();
        this.asynchronousRuleDetail = Object.assign({}, this.selectedAsynchronousRule[0]);
    }

    saveAsynchronousRule(): void {
        //When add new asynchronous rule
        if (this.isNewAsynchronousRule) {
            //Check for asynchronousRule name already exist or not
            if (!this.checkAsyncRuleFqmAlreadyExist()) {
                this.saveAsyncRule();
                return;
            }
        }
        //When add edit asynchronous rule
        else {
            if (this.selectedAsynchronousRule[0].fqm != this.asynchronousRuleDetail.fqm) {
                if (this.checkAsyncRuleFqmAlreadyExist())
                    return;
            }
            this.editAsyncRule();
        }
    }

    /**This method is used to validate the name of asynchronous rule is already exists. */
    checkAsyncRuleFqmAlreadyExist(): boolean {
        for (let i = 0; i < this.asynchronousRuleData.length; i++) {
            if (this.asynchronousRuleData[i].fqm == this.asynchronousRuleDetail.fqm) {
                this.configUtilityService.errorMessage("Asynchronous Rule fqm already exist");
                return true;
            }
        }
    }
    editAsyncRule(): void {
        this.configKeywordsService.editAsynchronousRule(this.asynchronousRuleDetail, this.profileId)
            .subscribe(data => {
                let index = this.getAsyncRuleIndex();
                this.selectedAsynchronousRule.length = 0;

                //to insert new row in table ImmutableArray.replace() is created as primeng 4.0.0 does not support above line 
                this.asynchronousRuleData = ImmutableArray.replace(this.asynchronousRuleData, data, index);
                this.configUtilityService.successMessage(Messages);
            });
        this.addEditAsynchronousRuleDialog = false;
    }

    getAsyncRuleIndex(): number {
        if (this.asynchronousRuleDetail) {
            let asyncRuleId = this.asynchronousRuleDetail.asyncRuleId;
            for (let i = 0; i < this.asynchronousRuleData.length; i++) {
                if (this.asynchronousRuleData[i].asyncRuleId == asyncRuleId) {
                    return i;
                }
            }
        }
        return -1;
    }
    saveAsyncRule(): void {
        this.configKeywordsService.addAsynchronousRule(this.asynchronousRuleDetail, this.profileId)
            .subscribe(data => {
                //Insert data in main table after inserting asynchronous rule in DB
                // this.errorDetectionData.push(data);

                //to insert new row in table ImmutableArray.push() is created as primeng 4.0.0 does not support above line 
                this.asynchronousRuleData = ImmutableArray.push(this.asynchronousRuleData, data);
                this.configUtilityService.successMessage(Messages);
            });
        this.addEditAsynchronousRuleDialog = false;
    }

    /**This method is used to delete asynchronous rule */
    deleteAsynchronousRule(): void {
        if (!this.selectedAsynchronousRule || this.selectedAsynchronousRule.length < 1) {
            this.configUtilityService.errorMessage("Select row(s) to delete");
            return;
        }
        this.confirmationService.confirm({
            message: 'Do you want to delete the selected row?',
            header: 'Delete Confirmation',
            icon: 'fa fa-trash',
            accept: () => {
                //Get Selected Applications's AppId
                let selectedApp = this.selectedAsynchronousRule;
                let arrAppIndex = [];
                for (let index in selectedApp) {
                    arrAppIndex.push(selectedApp[index].asyncRuleId);
                }
                this.configKeywordsService.deleteAsynchronousRule(arrAppIndex, this.profileId)
                    .subscribe(data => {
                        this.deleteAsyncRuleFromTable(arrAppIndex);
                        this.selectedAsynchronousRule = [];
                        this.configUtilityService.infoMessage("Deleted Successfully");
                    })
            },
            reject: () => {
            }
        });
    }
    /**This method is used to delete  from Data Table */
    deleteAsyncRuleFromTable(arrIndex) {
        let rowIndex: number[] = [];

        for (let index in arrIndex) {
            rowIndex.push(this.getAsyncRulesIndex(arrIndex[index]));
        }
        this.asynchronousRuleData = deleteMany(this.asynchronousRuleData, rowIndex);
    }

    /**This method returns selected asynchronous rule row on the basis of selected row */
    getAsyncRulesIndex(appId: any): number {
        for (let i = 0; i < this.asynchronousRuleData.length; i++) {
            if (this.asynchronousRuleData[i].asyncRuleId == appId) {
                return i;
            }
        }
        return -1;
    }

    saveAsynchronousRuleToFile() {
        this.saveKeywordData();
        this.configKeywordsService.saveAsynchronousRule(this.profileId)
            .subscribe(data => {
                console.log("return type", data)
            })
    }
}
