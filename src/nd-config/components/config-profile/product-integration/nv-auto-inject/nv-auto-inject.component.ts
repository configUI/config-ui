import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';

import { ImmutableArray } from '../../../../utils/immutable-array';
import { SelectItem, ConfirmationService } from 'primeng/primeng';

import { NVAutoInjectionPolicyRule, NVAutoInjectionTagRule } from '../../../../containers/product-integration-data';
import { ConfigKeywordsService } from '../../../../services/config-keywords.service';
import { ConfigUtilityService } from '../../../../services/config-utility.service';
import { ConfigUiUtility } from '../../../../utils/config-utility';
import { Messages, descMsg, addMessage, editMessage } from '../../../../constants/config-constant'
import { KeywordData, KeywordList } from '../../../../containers/keyword-data';

import { deleteMany } from '../../../../utils/config-utility';
import { Pipe, PipeTransform } from '@angular/core';

@Component({
    selector: 'app-nv-auto-inject',
    templateUrl: './nv-auto-inject.component.html',
    styleUrls: ['./nv-auto-inject.component.css']
})

export class NVAutoInjectConfiguration implements OnInit, OnDestroy {

    @Input()
    profileId: number;
    @Input()
    saveDisable: boolean;
    @Output()
    keywordData = new EventEmitter();
    subscription: Subscription;

    /* List to Hold Keywords */
    keywordList: string[] = ['AutoInjectionRuleConfig'];

    /* Flag for AutoInjectionRuleConfig Keyword action */
    selectedValues: boolean;

    keywordValue: Object;
    subscriptionEG: Subscription;

    /* Flag for Profile Permission */
    isProfilePerm: boolean;

    /* Object to Hold Auto Injection Policy Table Data */
    nvautoinjectionPolicyData: NVAutoInjectionPolicyRule[];

    /* Object for Auto Injection Policy Rule */
    nvAutoInjectionPolicyRule: Object;

    /* Object to Hold Auto Inject Policy Rule Selection */
    selectedAutoInjectionPolicyRule: NVAutoInjectionPolicyRule[];

    /* Add Auto Injection Policy Rule Dialog Flag */
    addEditAutoInjectionPolicyRuleDialog: boolean = false;

    /* Object to Hold Auto Injection Policy Rule Dialog Data */
    autoInjectionPolicyRuleDialogData: NVAutoInjectionPolicyRule;

    /* List to hold drop down values for HTTP Method */
    methodTypeList: SelectItem[];

    /* Object to hold drop down values for HTTP Header Operation and Query Parameter Operation */
    operationList: SelectItem[];

    /* Flag to hold Auto Injection Policy Rule Status(new/existing) */
    isNewAutoInjectionPolicyRule: boolean = false;

    /* Flag to hold Auto Injection Tag Rule Status(new/existing) */
    isNewAutoInjectionTagRule: boolean = false;

    /* Auto Injection Tag Rule Dialog Flag */
    addEditAutoInjectionTagRule: boolean = false;

    /* Object to hold Auto Injection Tag Rule Dialog Data */
    autoInjectionTagRuleDialogData: NVAutoInjectionTagRule;

    /* Object to hold Auto Injection Tag Rule Table Data */
    nvautoinjectionTagRuleData: NVAutoInjectionTagRule[];

    /* Object to Hold Auto Inject Tag Rule Selection */
    selectedAutoInjectionTagRule: NVAutoInjectionTagRule[];

    abc: string;

    constructor(private configKeywordsService: ConfigKeywordsService, private confirmationService: ConfirmationService,
        private configUtilityService: ConfigUtilityService, private store: Store<KeywordList>) {
        /* Assign  dropdown values to methodTypeList */
        this.methodTypeList = [];
        let arrLabel = ['GET', 'PUT', 'POST', 'DELETE', 'HEAD', 'TRACE', 'CONNECT', 'OPTIONS'];
        this.methodTypeList = ConfigUiUtility.createDropdown(arrLabel);
        /* Assign  dropdown values to operationList */
        this.operationList = [];
        arrLabel = ['EQUALS', 'NOT_EQUALS', 'CONTAINS', 'STARTS_WITH', 'ENDS_WITH'];
        this.operationList = ConfigUiUtility.createDropdown(arrLabel);
    }

    ngOnInit() {
        this.isProfilePerm = +sessionStorage.getItem("ProfileAccess") == 4 ? true : false;
        this.loadPolicyRuleData();
        this.loadTagInjectionData();
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
        this.nvAutoInjectionPolicyRule = {};
        this.keywordList.forEach((key) => {
            if (this.keywordValue.hasOwnProperty(key)) {
                this.nvAutoInjectionPolicyRule[key] = this.keywordValue[key];
                if (this.nvAutoInjectionPolicyRule[key].value == "true")
                    this.selectedValues = true;
                else
                    this.selectedValues = false;
            }
        });
    }

    /**
     * The below method is used to load Auto Injection Policy Rule Data
     */
    loadPolicyRuleData() {
        console.log("------------this.profileId---------------" + this.profileId)
        this.configKeywordsService.getAutoInjectionPolicyRule(this.profileId).subscribe(data => {
            this.nvautoinjectionPolicyData = data;
        });
    }

    /**
     * The below method is used to load Auto Injection Configuration(Tag Injection) Data
     */
    loadTagInjectionData() {
        console.log("------------this.profileId---------------" + this.profileId)
        this.configKeywordsService.getAutoInjectionTagRule(this.profileId).subscribe(data => {
            this.nvautoinjectionTagRuleData = data;
        });
    }

    /**
     * The below function will be called when user clicks on Add button
     * in Auto Injection Policy Rule List
     */
    openAddPolicyRuleDialog() {
        this.isNewAutoInjectionPolicyRule = true;
        this.addEditAutoInjectionPolicyRuleDialog = true;
        this.autoInjectionPolicyRuleDialogData = new NVAutoInjectionPolicyRule();
    }

    /**
     * The below function will be called when user clicks on Edit button
     * in Auto Injection Policy Rule List
     */
    openEditPolicyRuleDialog() {
        if (!this.selectedAutoInjectionPolicyRule || this.selectedAutoInjectionPolicyRule.length < 1) {
            this.configUtilityService.errorMessage("Select a row to edit");
            return;
        }
        else if (this.selectedAutoInjectionPolicyRule.length > 1) {
            this.configUtilityService.errorMessage("Select only one row to edit");
            return;
        }
        this.isNewAutoInjectionPolicyRule = false;
        this.autoInjectionPolicyRuleDialogData = new NVAutoInjectionPolicyRule();
        this.addEditAutoInjectionPolicyRuleDialog = true;
        this.autoInjectionPolicyRuleDialogData = Object.assign({}, this.selectedAutoInjectionPolicyRule[0]);
    }

    /**
     * The below function will be called when user clicks on save button in
     * Add/Edit Auto Injection Policy Rule
     */
    saveAddEditAutoInject() {
        if (this.isNewAutoInjectionPolicyRule) {                // For new Auto Injection Policy Rule
            //Check for app name already exist or not
            if (!this.checkAutoInjectionPolicyRuleNameAlreadyExist()) {
                this.addEditAutoInjectionPolicyRuleDialog = false;
                this.saveNewAutoInjectionPolicyRule();
                return;
            }
        }
        else {                                       // For existing Auto Injection Policy Rule
            if (this.selectedAutoInjectionPolicyRule[0].ruleName != this.autoInjectionPolicyRuleDialogData.ruleName) {
                if (this.checkAutoInjectionPolicyRuleNameAlreadyExist())
                    return;
            }
            this.addEditAutoInjectionPolicyRuleDialog = false;
            this.editAutoInjectionPolicyRule();
        }
    }

    /**
     * This method is used to validate the Auto Injection Policy Rule Name
     */
    checkAutoInjectionPolicyRuleNameAlreadyExist(): boolean {
        for (let i = 0; i < this.nvautoinjectionPolicyData.length; i++) {
            if (this.nvautoinjectionPolicyData[i].ruleName == this.autoInjectionPolicyRuleDialogData.ruleName) {
                this.configUtilityService.errorMessage("Rule Name already exist");
                return true;
            }
        }
    }

    /**
     * This method is used to save the New Auto Injection Policy Rule Data
     */
    saveNewAutoInjectionPolicyRule() {
        this.configKeywordsService.addAutoInjectionPolicyRule(this.profileId, this.autoInjectionPolicyRuleDialogData)
            .subscribe(data => {
                if (data[Object.keys(data)[0]] == "Provided Rule Name already exists!!!") {
                    this.configUtilityService.errorMessage("Rule Name already exists.");
                    return;
                }
                //to insert new row in table ImmutableArray.push() is created as primeng 4.0.0 does not support above line 
                this.nvautoinjectionPolicyData = ImmutableArray.push(this.nvautoinjectionPolicyData, data);
                this.configUtilityService.successMessage(addMessage);
                this.loadPolicyRuleData();
                this.addEditAutoInjectionPolicyRuleDialog = false;
            });
    }

    /**
     * This method is used to save the Edited Auto Injection Data
     */
    editAutoInjectionPolicyRule() {
        this.configKeywordsService.editAutoInjectionPolicyRule(this.profileId, this.autoInjectionPolicyRuleDialogData)
            .subscribe(data => {
                if (data[Object.keys(data)[0]] == "Provided Rule Name already exists!!!") {
                    this.configUtilityService.errorMessage("Rule Name already exists.");
                    return;
                }
                let index = this.getAutoInjectionRuleIndex();
                this.selectedAutoInjectionPolicyRule.length = 0;
                //to insert new row in table ImmutableArray.replace() is created as primeng 4.0.0 does not support above line 
                this.nvautoinjectionPolicyData = ImmutableArray.replace(this.nvautoinjectionPolicyData, data, index);
                this.configUtilityService.successMessage(editMessage);
                this.addEditAutoInjectionPolicyRuleDialog = false;
            });
    }

    /**
     * The below method is used to return the index position of the selected row
     */
    getAutoInjectionRuleIndex(): number {
        if (this.autoInjectionPolicyRuleDialogData) {
            let id = this.autoInjectionPolicyRuleDialogData.id;
            for (let i = 0; i < this.nvautoinjectionPolicyData.length; i++) {
                if (this.nvautoinjectionPolicyData[i].id == id) {
                    return i;
                }
            }
        }
        return -1;
    }

    /**
     * This method is called when user clicks on Delete button
     */
    deleteAutoInjectionRule() {
        if (!this.selectedAutoInjectionPolicyRule || this.selectedAutoInjectionPolicyRule.length < 1) {
            this.configUtilityService.errorMessage("Select row(s) to delete");
            return;
        }
        this.confirmationService.confirm({
            message: 'Do you want to delete the selected row?',
            header: 'Delete Confirmation',
            icon: 'fa fa-trash',
            accept: () => {
                //Get Selected Auto Injection Rule id
                let selectedAutoInjectionRule = this.selectedAutoInjectionPolicyRule;
                let arrAppIndex = [];
                for (let index in selectedAutoInjectionRule) {
                    arrAppIndex.push(selectedAutoInjectionRule[index].id);
                }
                this.configKeywordsService.deleteAutoInjectionPolicyRule(arrAppIndex, this.profileId)
                    .subscribe(data => {
                        this.deleteAutoInjectionRuleFromTable(arrAppIndex);
                        this.selectedAutoInjectionPolicyRule = [];
                        this.configUtilityService.infoMessage("Deleted Successfully");
                    })
            },
            reject: () => {
            }
        });
    }

    /**This method is used to delete  from Data Table */
    deleteAutoInjectionRuleFromTable(arrIndex) {
        let rowIndex: number[] = [];
        for (let index in arrIndex) {
            rowIndex.push(this.getAutoInjectionRowIndex(arrIndex[index]));
        }
        this.nvautoinjectionPolicyData = deleteMany(this.nvautoinjectionPolicyData, rowIndex);
    }


    /**This method returns selected Auto Injection row on the basis of selected row */
    getAutoInjectionRowIndex(id: any): number {
        for (let i = 0; i < this.nvautoinjectionPolicyData.length; i++) {
            if (this.nvautoinjectionPolicyData[i].id == id) {
                return i;
            }
        }
        return -1;
    }

    saveKeywordData() {
        if (this.saveDisable == true) {
            return;
        }
        let filePath = '';
        for (let key in this.nvAutoInjectionPolicyRule) {
            if (key == 'AutoInjectionRuleConfig') {
                if (this.selectedValues == true) {
                    this.nvAutoInjectionPolicyRule[key]["value"] = "true";
                }
                else {
                    this.nvAutoInjectionPolicyRule[key]["value"] = "false";
                }
            }
            this.configKeywordsService.keywordData[key] = this.nvAutoInjectionPolicyRule[key];
        }

        this.configKeywordsService.getFilePath(this.profileId).subscribe(data => {
            if (this.selectedValues == false) {
                filePath = "NA";
            }
            else {
                filePath = data["_body"];
                filePath = filePath + "/NDNVInjectTagProcessor.txt";
            }
            this.nvAutoInjectionPolicyRule['AutoInjectionRuleConfig'].path = filePath;
            this.keywordData.emit(this.nvAutoInjectionPolicyRule);
        });
    }

    /**
     * The Below method is used to save Auto Injection Data on file
     */
    saveAutoInjectionDataOnFile() {
        this.saveKeywordData();
        this.configKeywordsService.saveAutoInjectionData(this.profileId)
            .subscribe(data => {
                console.log("return type", data)

            })
    }


    /**
     * The below function will be called when user clicks on Add button
     * in Tag Injection Rule List
     */
    openAddTagInjectionDialog() {
        this.isNewAutoInjectionTagRule = true;
        this.addEditAutoInjectionTagRule = true;
        this.autoInjectionTagRuleDialogData = new NVAutoInjectionTagRule();
    }


    /**
     * The below function will be called when user clicks on Edit button
     * in Auto Injection Configuration Rule List
     */
    openEditTagInjectionDialog() {
        if (!this.selectedAutoInjectionTagRule || this.selectedAutoInjectionTagRule.length < 1) {
            this.configUtilityService.errorMessage("Select a row to edit");
            return;
        }
        else if (this.selectedAutoInjectionTagRule.length > 1) {
            this.configUtilityService.errorMessage("Select only one row to edit");
            return;
        }
        this.isNewAutoInjectionTagRule = false;
        this.autoInjectionTagRuleDialogData = new NVAutoInjectionTagRule();
        this.addEditAutoInjectionTagRule = true;
        this.autoInjectionTagRuleDialogData = Object.assign({}, this.selectedAutoInjectionTagRule[0]);
    }


    /**
     * The below function will be called when user clicks on save button in
     * Add/Edit Auto Injection Configuration Rule(Tag Injection)
     */
    saveAddEditTagInject() {
        if (this.isNewAutoInjectionTagRule) {                // For new Tag Injection Rule
            //Check for app name already exist or not
            if (!this.checkTagInjectionRuleNameAlreadyExist()) {
                this.addEditAutoInjectionTagRule = false;
                this.saveNewTagInjectionRule();
                return;
            }
        }
        else {                                       // For existing Tag Injection Rule
            if (this.selectedAutoInjectionTagRule[0].ruleName != this.autoInjectionTagRuleDialogData.ruleName) {
                if (this.checkTagInjectionRuleNameAlreadyExist())
                    return;
            }
            this.addEditAutoInjectionTagRule = false;
            this.editTagInjectionRule();
        }
    }

    /**
     * This method is used to validate the Tag Configuration Rule Rule Name
     */
    checkTagInjectionRuleNameAlreadyExist(): boolean {
        for (let i = 0; i < this.nvautoinjectionTagRuleData.length; i++) {
            if (this.nvautoinjectionTagRuleData[i].ruleName == this.autoInjectionTagRuleDialogData.ruleName) {
                this.configUtilityService.errorMessage("Rule Name already exist");
                return true;
            }
        }
    }

    /**
     * This method is used to save the New Tag Configuration Rule Data
     */
    saveNewTagInjectionRule() {
        console.log("----this.autoInjectionTagRuleDialogData-----",this.autoInjectionTagRuleDialogData)
        this.configKeywordsService.addAutoInjectionTagRule(this.profileId, this.autoInjectionTagRuleDialogData)
            .subscribe(data => {
                if (data[Object.keys(data)[0]] == "Provided Rule Name already exists!!!") {
                    this.configUtilityService.errorMessage("Rule Name already exists.");
                    return;
                }
                //to insert new row in table ImmutableArray.push() is created as primeng 4.0.0 does not support above line 
                this.nvautoinjectionTagRuleData = ImmutableArray.push(this.nvautoinjectionTagRuleData, data);
                this.configUtilityService.successMessage(addMessage);
                this.loadTagInjectionData();
                this.addEditAutoInjectionTagRule = false;
            });
    }

    /**
     * This method is used to save the Edited Auto Injection Configuration(Tag Injection) Data
     */
    editTagInjectionRule() {
        this.configKeywordsService.editAutoInjectionTagRule(this.profileId, this.autoInjectionTagRuleDialogData)
            .subscribe(data => {
                if (data[Object.keys(data)[0]] == "Provided Rule Name already exists!!!") {
                    this.configUtilityService.errorMessage("Rule Name already exists.");
                    return;
                }
                let index = this.getTagInjectionRuleIndex();
                this.selectedAutoInjectionTagRule.length = 0;
                //to insert new row in table ImmutableArray.replace() is created as primeng 4.0.0 does not support above line 
                this.nvautoinjectionTagRuleData = ImmutableArray.replace(this.nvautoinjectionTagRuleData, data, index);
                this.configUtilityService.successMessage(editMessage);
                this.addEditAutoInjectionTagRule = false;
            });
    }

    /**
     * The below method is used to return the index position of the selected row
     */
    getTagInjectionRuleIndex(): number {
        if (this.autoInjectionTagRuleDialogData) {
            let id = this.autoInjectionTagRuleDialogData.id;
            for (let i = 0; i < this.nvautoinjectionTagRuleData.length; i++) {
                if (this.nvautoinjectionTagRuleData[i].id == id) {
                    return i;
                }
            }
        }
        return -1;
    }


    /**
     * This method is called when user clicks on Delete button
     * in Tag Injection Rule list
     */
    deleteTagInjectionRules() {
        if (!this.selectedAutoInjectionTagRule || this.selectedAutoInjectionTagRule.length < 1) {
            this.configUtilityService.errorMessage("Select row(s) to delete");
            return;
        }
        this.confirmationService.confirm({
            message: 'Do you want to delete the selected row?',
            header: 'Delete Confirmation',
            icon: 'fa fa-trash',
            accept: () => {
                //Get Selected Auto Injection Rule id
                let selectedTagRule = this.selectedAutoInjectionTagRule;
                let arrAppIndex = [];
                for (let index in selectedTagRule) {
                    arrAppIndex.push(selectedTagRule[index].id);
                }
                this.configKeywordsService.deleteAutoInjectionTagRule(arrAppIndex, this.profileId)
                    .subscribe(data => {
                        this.deleteAutoInjectionTagRuleFromTable(arrAppIndex);
                        this.selectedAutoInjectionTagRule = [];
                        this.configUtilityService.infoMessage("Deleted Successfully");
                    })
            },
            reject: () => {
            }
        });
    }

    /**This method is used to delete Auto injection Tag Rule from Data Table */
    deleteAutoInjectionTagRuleFromTable(arrIndex) {
        let rowIndex: number[] = [];
        for (let index in arrIndex) {
            rowIndex.push(this.getAutoInjectionTagRuleRowIndex(arrIndex[index]));
        }
        this.nvautoinjectionTagRuleData = deleteMany(this.nvautoinjectionTagRuleData, rowIndex);
    }


    /**This method returns selected Tag Rule row on the basis of selected row */
    getAutoInjectionTagRuleRowIndex(id: any): number {
        for (let i = 0; i < this.nvautoinjectionTagRuleData.length; i++) {
            if (this.nvautoinjectionTagRuleData[i].id == id) {
                return i;
            }
        }
        return -1;
    }

    ngOnDestroy(): void {
    }

}

