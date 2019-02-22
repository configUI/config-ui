import { Component, OnInit } from '@angular/core';
import { ConfigKeywordsService } from '../../../../../services/config-keywords.service';
import { BusinessTransMethodInfo } from '../../../../../interfaces/business-trans-method-info';
import { ImmutableArray } from '../../../../../utils/immutable-array';
import { ConfigUiUtility } from '../../../../../utils/config-utility';
import { BusinessTransMethodData, RulesData, ArgumentRulesData } from '../../../../../containers/instrumentation-data'
import { SelectItem, ConfirmationService } from 'primeng/primeng';
import { ConfigUtilityService } from '../../../../../services/config-utility.service';
import { deleteMany } from '../../../../../utils/config-utility';
import { ActivatedRoute, Params } from '@angular/router';
import { MethodBasedCustomData, ReturnTypeData, ArgumentTypeData } from '../../../../../containers/method-based-custom-data';
import { Messages, addMessage, editMessage } from '../../../../../constants/config-constant'
import { ConfigHomeService } from '../../../../../services/config-home.service';

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
  selectedbusinessTransMethod: any[];

  /* Assign data to Rules Business Transaction Data table */
  methodRulesInfo: RulesData[];
  methodArgRulesInfo: RulesData[];

  btMethodRulesDetail: RulesData;

  selectedMethodRules: RulesData[];
  selectedArgRules: RulesData[];

  // /* For holding form fields*/
  // returnTypeRules: ReturnTypeData;
  // argumentTypeRules: ArgumentTypeData;

  /* open dialog box */
  addBusinessTransMethodDialog: boolean = false;
  addRulesDialog: boolean = false;
  addArgRulesDialog: boolean = false;

  /* Assign value to return type drop down */
  returnTypeList: SelectItem[];

  /*selected item from Return type list*/
  selectedReturnType: string;

  /* to hold data to display in table of return type and argument type in table */
  // returnTypeData: ReturnTypeData[];
  argumentTypeData: ArgumentTypeData[];

  /* Assign value to Return type drop down */
  returnOperationList: SelectItem[];
  /* Assign value to Argument type drop down */
  operationList: SelectItem[];

  /**It stores selected data for edit or add functionality */
  methodBasedCustomData: MethodBasedCustomData;

  /* hold the data that needs to be displayed in table */
  tableData: MethodBasedCustomData[];

  /*selected item from return type list*/
  selectedOperation: string;

  isNewMethod: boolean = false;
  isNewReturn: boolean = false;
  isNewArg: boolean = false;

  //flag used for titles in edit dialog of rules
  editReturnRules: boolean = false;
  editArgumentRules: boolean = false;

  /*For cheking FQM */
  first: boolean;
  second: boolean;

  enableArgumentType: string;

  saveDisable: boolean = false;
  indexList: SelectItem[];

  capturingType: string;

  argCount: number = 0;
  returnCount: number = 0;
  returnCountEdit: number = 0;
  argCountEdit: number = 0;

  methodBtTypeDelete = [];

  bTMethodBrowse: boolean;
  isbTMethodBrowse: boolean;
  /** To open file explorer dialog */
  openFileExplorerDialog: boolean = false;
  flag: boolean = true;

  //used to hold value of "type " i.e data type of return value or argument value whichever is selected
  type: string;
  isProfilePerm: boolean;
  fqm: any;

  //All below variables are to implement BT Method Invocation
  methodInvocationRulesInfo: RulesData[];
  selectedInvocationRules: RulesData[];
  btMethodInvococationRulesDetail: RulesData;
  methodInvocation: string
  addInvocationRulesDialog: boolean;
  isNewInvocation: boolean;
  returnCountForInvocation: number = 0;
  returnCountForInvocationEdit: number = 0;
  invocationCount: number = 0
  invocationCountEdit: number = 0;
  editInvocationRules: boolean = false;
  third: boolean;
  indexListForInvoc: SelectItem[];

  constructor(private configHomeService: ConfigHomeService, private route: ActivatedRoute, private configKeywordsService: ConfigKeywordsService, private configUtilityService: ConfigUtilityService, private confirmationService: ConfirmationService) {

    let arrLabel = ['Numeric', 'String', 'Boolean', 'Char or byte'];
    let arrValue = ['0', '1', '2', '3'];

    this.returnTypeList = [];
    this.returnTypeList = ConfigUiUtility.createListWithKeyValue(arrLabel, arrValue);

    this.methodRulesInfo = [];
    this.methodArgRulesInfo = [];
    this.methodInvocationRulesInfo = [];

    this.configHomeService.getBTMethodDataFromAD$.subscribe(val => {
      this.flag = val;
    });
    this.configHomeService.selectedFromAD$.subscribe(val => {
      if (val.includes('#')) {
        this.profileId = val.split("#")[0];
        this.fqm = val.split("#")[1];

      }
      this.configKeywordsService.getBusinessTransMethodData(this.profileId).subscribe(data => {
        let that = this;
        data.map(function (val) {
          that.modifyData(val);
        })
        this.businessTransMethodInfo = data;
        this.openMethodDialog();
      });
    });
  }

  arrStringLabelReturnType: any[] = ['Equals', 'Not equals', 'Contains', 'Starts with', 'Ends with', 'Exception', 'Invocation'];
  arrStringValueReturnType: any[] = ['EQUALS', 'NOT_EQUALS', 'CONTAINS', 'STARTS_WITH', 'ENDS_WITH', 'EXCEPTION', 'INVOCATION'];


  arrNumericLabelReturnType: any[] = ['Equals', 'Not equals', 'Less than', 'Greater than', 'Less than equals to', 'Greater than equals to', 'Exception', 'Invocation'];
  arrNumericValueReturnType: any[] = ['EQ', 'NE', 'LT', 'GT', 'LE', 'GE', 'EXCEPTION', 'INVOCATION'];

  arrCharLabelReturnType: any[] = ['Exception', 'Equals', 'Not equals', 'Invocation'];
  arrCharValueReturnType: any[] = ['EXCEPTION', 'EQ', 'NE'];

  arrBooleanLabelReturnType: any[] = ['True', 'False', 'Exception', 'Invocation'];
  arrBooleanValueReturnType: any[] = ['TRUE', 'FALSE', 'EXCEPTION', 'INVOCATION'];

  arrVoidLabelReturnType: any[] = ['Invocation'];
  arrVoidValueReturnType: any[] = ['INVOCATION'];

  arrStringLabelArgType: any[] = ['Equals', 'Not equals', 'Contains', 'Starts with', 'Ends with', 'Exception'];
  arrStringValueArgType: any[] = ['EQUALS', 'NOT_EQUALS', 'CONTAINS', 'STARTS_WITH', 'ENDS_WITH', 'EXCEPTION'];

  arrNumericLabelArgType: any[] = ['Equals', 'Not equals', 'Less than', 'Greater than', 'Less than equals to', 'Greater than equals to', 'Exception'];
  arrNumericValueArgType: any[] = ['EQ', 'NE', 'LT', 'GT', 'LE', 'GE', 'EXCEPTION'];

  arrCharLabelArgType: any[] = ['Exception', 'Equals', 'Not equals'];
  arrCharValueArgType: any[] = ['EXCEPTION', 'EQ', 'NE'];

  arrBooleanLabelArgType: any[] = ['True', 'False', 'Exception'];
  arrBooleanValueArgType: any[] = ['TRUE', 'FALSE', 'EXCEPTION'];

  DATA_TYPE = {
    BOOLEAN: 'Z',
    SHORT: 'S',
    INTEGER: 'I',
    STRING: 'Ljava/lang/String;',
    BYTE: 'B',
    FLOAT: 'F',
    DOUBLE: 'D',
    LONG: 'J',
    CHAR: 'C',
    VOID: 'V'
  };

  DATA_TYPE_ARR = [
    this.DATA_TYPE.BOOLEAN,
    this.DATA_TYPE.SHORT,
    this.DATA_TYPE.INTEGER,
    this.DATA_TYPE.STRING,
    this.DATA_TYPE.BYTE,
    this.DATA_TYPE.FLOAT,
    this.DATA_TYPE.DOUBLE,
    this.DATA_TYPE.LONG,
    this.DATA_TYPE.CHAR,
    this.DATA_TYPE.VOID
  ];

  changeOpertionType(type) {

    if (type == "object/string") {
      this.returnOperationList = ConfigUiUtility.createListWithKeyValue(this.arrStringLabelReturnType, this.arrStringValueReturnType);
      this.operationList = ConfigUiUtility.createListWithKeyValue(this.arrStringLabelArgType, this.arrStringValueArgType);
      this.type = '1';
    }
    else if (type == "int" || type == "short" || type == "float" || type == "long" || type == "double") {
      this.returnOperationList = ConfigUiUtility.createListWithKeyValue(this.arrNumericLabelReturnType, this.arrNumericValueReturnType);
      this.operationList = ConfigUiUtility.createListWithKeyValue(this.arrNumericLabelArgType, this.arrNumericValueArgType);
      this.type = '0';
    }
    else if (type == "byte" || type == "char") {
      this.returnOperationList = ConfigUiUtility.createListWithKeyValue(this.arrCharLabelReturnType, this.arrCharValueReturnType);
      this.operationList = ConfigUiUtility.createListWithKeyValue(this.arrCharLabelArgType, this.arrCharValueArgType);
      this.type = '3';
    }

    else if (type == "boolean") {
      this.returnOperationList = ConfigUiUtility.createListWithKeyValue(this.arrBooleanLabelReturnType, this.arrBooleanValueReturnType);
      this.operationList = ConfigUiUtility.createListWithKeyValue(this.arrBooleanLabelArgType, this.arrBooleanValueArgType);
      this.type = '2';
    }

    else if (type == "void") {
      this.returnOperationList = ConfigUiUtility.createListWithKeyValue(this.arrVoidLabelReturnType, this.arrVoidValueReturnType);
      this.type = '4';
    }
  }

  ngOnInit() {
    this.isProfilePerm = +sessionStorage.getItem("ProfileAccess") == 4 ? true : false;
    if (this.flag)
      this.loadBTMethodData();
    this.configKeywordsService.fileListProvider.subscribe(data => {
      this.uploadFile(data);
    });
  }

  /** Fetch BT Mehtod Data and Assign on Loading */
  loadBTMethodData(): void {
    this.businessTransMethodDetail = new BusinessTransMethodData();
    this.route.params.subscribe((params: Params) => {
      this.profileId = params['profileId'];
      if (this.profileId == 1 || this.profileId == 777777 || this.profileId == 888888)
        this.saveDisable = true;
    });
    //this.businessTransMethodInfo = data
    this.configKeywordsService.getBusinessTransMethodData(this.profileId).subscribe(data => {
      let that = this;
      data.map(function (val) {
        that.modifyData(val);
      })
      this.businessTransMethodInfo = data;
    }

    );
  }

  /** this method used for open dialog for add Method Business Transaction */
  openMethodDialog() {
    this.businessTransMethodDetail = new BusinessTransMethodData();
    this.businessTransMethodDetail.fqm = this.fqm;
    this.btMethodRulesDetail = new RulesData();
    this.methodRulesInfo = [];
    this.methodArgRulesInfo = [];
    this.methodInvocationRulesInfo = [];
    this.enableArgumentType = "";
    this.methodInvocation = "";

    this.addBusinessTransMethodDialog = true;
    this.isNewMethod = true;

  }

  /** This method is used to open a dialog for add Rules
   * Call a method for fill Operation drop down according Return Type
  */
  openAddReturnRulesDialog() {
    this.addRulesDialog = true;
    this.btMethodRulesDetail = new RulesData();
    /*calling this function
    * to know data type of return value of provided fqm
    * and creating opertaion list a/c to return type
    */
    this.createMatchCriteria();
    // this.changeOpertionType();
  }

 createMatchCriteria() {
    let type = this.getTypeReturnType(this.businessTransMethodDetail.fqm);
    this.changeOpertionType(type);
  }

  openAddArgumentRulesDialog() {
    this.btMethodRulesDetail = new RulesData();
    this.addArgRulesDialog = true;
  }

  /** Edit BT Method */
  editMethodTrans(): void {
    if (!this.selectedbusinessTransMethod || this.selectedbusinessTransMethod.length < 1) {
      this.configUtilityService.errorMessage("Select a row to edit");
      return;
    }
    else if (this.selectedbusinessTransMethod.length > 1) {
      this.configUtilityService.errorMessage("Select only one row to edit");
      return;
    }

    this.addBusinessTransMethodDialog = true;
    this.isNewMethod = false;
    //  this.businessTransMethodDetail.argumentIndex = Number(this.businessTransMethodDetail.argumentIndex);
    this.businessTransMethodDetail = Object.assign({}, this.selectedbusinessTransMethod[0]);

    if (this.businessTransMethodDetail.enableArgumentType && ((this.businessTransMethodDetail.methodInvocation == null || this.businessTransMethodDetail.methodInvocation == '-1'))) {
      this.validateArgAndGetArgumentsNumberList('ARGUMENT');
      this.methodArgRulesInfo = this.selectedbusinessTransMethod[0].rules;
      this.methodRulesInfo = [];
      this.methodInvocationRulesInfo = [];
      this.enableArgumentType = "argument";
    }
    else if (this.businessTransMethodDetail.enableArgumentType && this.businessTransMethodDetail.methodInvocation == '1') {
      this.validateArgAndGetArgumentsNumberList('INVOCATION');
      this.methodInvocationRulesInfo = this.selectedbusinessTransMethod[0].rules;
      this.methodArgRulesInfo = [];
      this.methodRulesInfo = [];
      this.enableArgumentType = "invocation";
    }
    else {
      this.methodRulesInfo = this.selectedbusinessTransMethod[0].rules;
      this.methodArgRulesInfo = [];
      this.methodInvocationRulesInfo = [];
      this.enableArgumentType = "returnType";
    }
    this.selectedArgRules = [];
    this.selectedMethodRules = [];
    this.selectedInvocationRules = [];
    this.indexList = [];
  }

  //Open view window on FQM name click
  openViewMethodTrans(data) {
    this.businessTransMethodDetail = new BusinessTransMethodData();
    this.addBusinessTransMethodDialog = true;
    this.isNewMethod = false;
    this.businessTransMethodDetail = Object.assign({}, data);
    if (this.businessTransMethodDetail.enableArgumentType) {
      this.methodArgRulesInfo = this.businessTransMethodDetail.rules;
      this.enableArgumentType = "argument";
    }
    else {
      this.methodRulesInfo = this.businessTransMethodDetail.rules;
      this.enableArgumentType = "returnType";
    }
  }

  getIndex(fqm): number {
    for (let i = 0; i < this.businessTransMethodInfo.length; i++) {
      if (this.businessTransMethodInfo[i].fqm == fqm) {
        return i;
      }
    }
    return -1;
  }

  /**This method is used to edit Method detail */
  editMethod(): void {
    if (this.enableArgumentType == "returnType") {
      this.businessTransMethodDetail.enableArgumentType = false;
      this.businessTransMethodDetail.rules = this.methodRulesInfo;
      this.businessTransMethodDetail.methodInvocation = '-1';
      this.businessTransMethodDetail.methodInvocationIndex = -1;
      this.businessTransMethodDetail.argumentIndex = -1;
      //If return type is selected then, to delete all the rules from argument table
      if (this.methodRulesInfo != []) {
        for (let index in this.methodArgRulesInfo) {
          if (this.methodArgRulesInfo[index].btMethodRuleId != null)
            this.methodBtTypeDelete.push(this.methodArgRulesInfo[index].btMethodRuleId);
        }
        this.methodArgRulesInfo = [];
        //If return type is selected then, to delete all the rules from Invocation table
        for (let index in this.methodInvocationRulesInfo) {
          if (this.methodInvocationRulesInfo[index].btMethodRuleId != null)
            this.methodBtTypeDelete.push(this.methodInvocationRulesInfo[index].btMethodRuleId);
        }
        this.methodInvocationRulesInfo = [];
      }
    }
    else if (this.enableArgumentType == "argument") {
      // this.operationListArgumentType();
      this.businessTransMethodDetail.enableArgumentType = true;
      this.businessTransMethodDetail.rules = this.methodArgRulesInfo;
      this.businessTransMethodDetail.methodInvocation = '-1';
      this.businessTransMethodDetail.methodInvocationIndex = -1;

      //If argument type is selected then, to delete all the rules from return table
      if (this.methodRulesInfo != []) {
        for (let index in this.methodRulesInfo) {
          if (this.methodRulesInfo[index].btMethodRuleId != null)
            this.methodBtTypeDelete.push(this.methodRulesInfo[index].btMethodRuleId)
        }
        this.methodRulesInfo = [];
        //If argument type is selected then, to delete all the rules from Invocation table
        for (let index in this.methodInvocationRulesInfo) {
          if (this.methodInvocationRulesInfo[index].btMethodRuleId != null)
            this.methodBtTypeDelete.push(this.methodInvocationRulesInfo[index].btMethodRuleId)
        }
        this.methodInvocationRulesInfo = [];
      }
    }
    else if (this.enableArgumentType == "invocation") {
      this.businessTransMethodDetail.enableArgumentType = true;
      this.businessTransMethodDetail.methodInvocation = '1';
      this.businessTransMethodDetail.argumentIndex = -1;
      this.businessTransMethodDetail.rules = this.methodInvocationRulesInfo;
      //If argument type is selected then, to delete all the rules from return table
      if (this.methodRulesInfo != []) {
        for (let index in this.methodRulesInfo) {
          if (this.methodRulesInfo[index].btMethodRuleId != null)
            this.methodBtTypeDelete.push(this.methodRulesInfo[index].btMethodRuleId)
        }
        this.methodRulesInfo = [];
        //If argument type is selected then, to delete all the rules from Argument table
        for (let index in this.methodArgRulesInfo) {
          if (this.methodArgRulesInfo[index].btMethodRuleId != null)
            this.methodBtTypeDelete.push(this.methodArgRulesInfo[index].btMethodRuleId);
        }
        this.methodArgRulesInfo = [];
      }
    }
    if (this.enableArgumentType == "invocation") {
      this.businessTransMethodDetail.returnType = '4';
    }
    else
      this.businessTransMethodDetail.returnType = this.type;
    if (this.enableArgumentType == "returnType" && this.methodRulesInfo.length == 0) {
      this.configUtilityService.errorMessage("Provide return type settings");
      return;
    }
    if (this.enableArgumentType == "argument" && this.methodArgRulesInfo.length == 0) {
      this.configUtilityService.errorMessage("Provide argument type settings");
      return;
    }
    if (this.enableArgumentType == "invocation" && this.methodInvocationRulesInfo.length == 0) {
      this.configUtilityService.errorMessage("Provide invocation type settings");
      return;
    }
    this.businessTransMethodDetail.btMethodId = this.selectedbusinessTransMethod[0].btMethodId;
    this.selectedbusinessTransMethod = [];
    /****for edit case
       *  first triggering the request to delete the  rules and
       *  when response comes then triggering request to add the new added rules
       *
       */
    this.configKeywordsService.deleteMethodBtRules(this.methodBtTypeDelete).subscribe(data => {
      let that = this;
      //Edit call, sending row data to service
      this.configKeywordsService.editBusinessTransMethod(this.businessTransMethodDetail).subscribe(data => {

        this.businessTransMethodInfo.map(function (val) {
          if (val.btMethodId == data.btMethodId) {
            val.argumentIndex = data.argumentIndex;
            val.btMethodId = data.btMethodId;
            val.enableArgumentType = data.enableArgumentType;
            val.fqm = data.fqm;
            val.returnType = data.returnType;
            val.rules = data.rules;
            val.methodInvocation = data.methodInvocation;
            val.methodInvocationIndex = data.methodInvocationIndex;
          }
          that.modifyData(val);
        })
        this.configUtilityService.successMessage(editMessage);
      });
    })
    this.closeDialog();
  }

  /**This method is used to delete Mehtod BT*/
  deleteMethodTrans(): void {
    if (!this.selectedbusinessTransMethod || this.selectedbusinessTransMethod.length < 1) {
      this.configUtilityService.errorMessage("Select row(s) to delete");
      return;
    }
    this.confirmationService.confirm({
      message: 'Do you want to delete the selected row?',
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
            this.configUtilityService.infoMessage("Deleted Successfully");
          })
      },
      reject: () => {
      }
    });
  }

  /**This method is used to delete Method Rules */
  deleteRules() {
    if (!this.selectedMethodRules || this.selectedMethodRules.length < 1) {
      this.configUtilityService.errorMessage("Select row(s) to delete");
      return;
    }
    let selectedRules = this.selectedMethodRules;
    let arrRulesIndex = [];
    for (let index in selectedRules) {
      arrRulesIndex.push(selectedRules[index]);
      if (selectedRules[index].hasOwnProperty('btMethodRuleId')) {
        this.methodBtTypeDelete.push(selectedRules[index].btMethodRuleId);
      }
    }
    this.deleteRulesFromTable(arrRulesIndex);
    this.selectedMethodRules = [];
  }

  //deletimg Argument rules
  deleteArgumentsRules(): void {
    if (!this.selectedArgRules || this.selectedArgRules.length < 1) {
      this.configUtilityService.errorMessage("Select row(s) to delete");
      return;
    }
    let selectedRules = this.selectedArgRules;
    let arrArgIndex = [];
    for (let index in selectedRules) {
      arrArgIndex.push(selectedRules[index]);
      if (selectedRules[index].hasOwnProperty('btMethodRuleId')) {
        this.methodBtTypeDelete.push(selectedRules[index].btMethodRuleId);
      }
    }
    this.deleteArgRulesFromTable(arrArgIndex);
    this.selectedArgRules = [];

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

  /**This method returns selected argument row on the basis of selected row */
  getArgRulesIndex(appId: any): number {
    for (let i = 0; i < this.methodArgRulesInfo.length; i++) {
      if (this.methodArgRulesInfo[i] == appId) {
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

  /**This method is used to delete  Argument Rules from Data Table */
  deleteArgRulesFromTable(arrRulesIndex: any[]): void {
    //For stores table row index
    let rowIndex: number[] = [];

    for (let index in arrRulesIndex) {
      rowIndex.push(this.getArgRulesIndex(arrRulesIndex[index]));
    }
    this.methodArgRulesInfo = deleteMany(this.methodArgRulesInfo, rowIndex);
  }

  /**This method is used to delete Rules from Data Table */
  deleteMethodsBusinessTransactions(arrIndex) {
    let rowIndex: number[] = [];

    for (let index in arrIndex) {
      rowIndex.push(this.getMethodBusinessIndex(arrIndex[index]));
    }
    this.businessTransMethodInfo = deleteMany(this.businessTransMethodInfo, rowIndex);
  }

  //For checking FQM 
  saveRules() {
    if (this.btMethodRulesDetail.value == null || this.btMethodRulesDetail.value == undefined || this.btMethodRulesDetail.value == '') {
      this.btMethodRulesDetail.value = 'NA';
    }
    //in edit form, to edit return rules
    if (!this.isNewMethod) {
      if (this.editReturnRules) {
        this.editReturnRules = false;
        let that = this;
        this.methodRulesInfo.map(function (val) {
          if (val.id == that.btMethodRulesDetail.id) {
            val.btName = that.btMethodRulesDetail.btName;
            val.opCode = that.btMethodRulesDetail.opCode;
            val.opCodeDropDown = that.btMethodRulesDetail.opCodeDropDown;
            val.operationName = that.btMethodRulesDetail.operationName;
            val.previousBtMethodRulesIds = that.btMethodRulesDetail.previousBtMethodRulesIds;
            val.value = that.btMethodRulesDetail.value;
          }
        })
        this.selectedMethodRules = [];
      }
      else {
        //In edit form, to add new return rule
        this.btMethodRulesDetail["id"] = this.returnCountEdit;
        this.businessTransMethodDetail.rules = ImmutableArray.push(this.methodRulesInfo, this.btMethodRulesDetail);
        this.methodRulesInfo = this.businessTransMethodDetail.rules;
        this.returnCountEdit = this.returnCountEdit + 1;
      }
    }
    else {
      //in add form, to edit return rules
      if (this.editReturnRules) {
        this.editReturnRules = false;
        let that = this;
        this.methodRulesInfo.map(function (val) {
          if (val.id == that.btMethodRulesDetail.id) {
            val.btName = that.btMethodRulesDetail.btName;
            val.opCode = that.btMethodRulesDetail.opCode;
            val.opCodeDropDown = that.btMethodRulesDetail.opCodeDropDown;
            val.operationName = that.btMethodRulesDetail.operationName;
            val.previousBtMethodRulesIds = that.btMethodRulesDetail.previousBtMethodRulesIds;
            val.value = that.btMethodRulesDetail.value;
          }
        })
        this.selectedMethodRules = [];
      }
      else {
        //In add form, to add new return rule
        this.btMethodRulesDetail["id"] = this.returnCount;
        this.methodRulesInfo = ImmutableArray.push(this.methodRulesInfo, this.btMethodRulesDetail);
        this.returnCount = this.returnCount + 1;
      }
    }
    this.selectedMethodRules = [];
    this.addRulesDialog = false;
    this.btMethodRulesDetail = new RulesData();
  }

  saveArgRules() {
    //in edit form, to edit Argument rules
    if (!this.isNewMethod) {
      if (this.editArgumentRules) {
        this.editArgumentRules = false;
        let that = this;
        this.methodArgRulesInfo.map(function (val) {
          if (val.id == that.btMethodRulesDetail.id) {
            val.btName = that.btMethodRulesDetail.btName;
            val.opCode = that.btMethodRulesDetail.opCode;
            val.opCodeDropDown = that.btMethodRulesDetail.opCodeDropDown;
            val.operationName = that.btMethodRulesDetail.operationName;
            val.previousBtMethodRulesIds = that.btMethodRulesDetail.previousBtMethodRulesIds;
            val.value = that.btMethodRulesDetail.value;
          }
        })
        this.selectedArgRules = [];
      }
      else {
        //In edit form, to add new argument rule
        this.btMethodRulesDetail["id"] = this.argCountEdit;
        this.businessTransMethodDetail.rules = ImmutableArray.push(this.methodArgRulesInfo, this.btMethodRulesDetail);
        this.methodArgRulesInfo = this.businessTransMethodDetail.rules;
        this.argCountEdit = this.argCountEdit + 1;
      }
    }
    else {
      //in add form, to edit return rules
      if (this.editArgumentRules) {
        this.editArgumentRules = false;
        let that = this;
        this.methodArgRulesInfo.map(function (val) {
          if (val.id == that.btMethodRulesDetail.id) {
            val.btName = that.btMethodRulesDetail.btName;
            val.opCode = that.btMethodRulesDetail.opCode;
            val.opCodeDropDown = that.btMethodRulesDetail.opCodeDropDown;
            val.operationName = that.btMethodRulesDetail.operationName;
            val.previousBtMethodRulesIds = that.btMethodRulesDetail.previousBtMethodRulesIds;
            val.value = that.btMethodRulesDetail.value;
          }
        })
        this.selectedArgRules = [];
      }
      else {
        //In add form, to add new return rule

        this.btMethodRulesDetail["id"] = this.argCount;
        this.methodArgRulesInfo = ImmutableArray.push(this.methodArgRulesInfo, this.btMethodRulesDetail);
        this.argCount = this.argCount + 1;
      }
    }
    this.addArgRulesDialog = false;
    this.selectedArgRules = [];
    this.btMethodRulesDetail = new RulesData();
  }

  getTypeReturnType(fqm) {
    //for getting return Type
    let returnType = "NA";
    if (fqm != null) {
      let li = fqm.indexOf(')');
      let i = li + 1;

      let pi = 1;
      let charArr = fqm.split('');
      if (charArr[i] == '') {
        return null;
      }
      //      System.out.println("pi " + pi + ", index - " + index + ", char - " + charArr[i] + ", i" + i + " bracket -" + (bi +1));
      else {
        switch (charArr[i]) {
          case 'Z':
            returnType = "boolean";
            break;
          case 'B':
            returnType = "byte";
            break;
          case 'C':
            returnType = "char";
            break;
          case 'S':
            returnType = "short";
            break;
          case 'I':
            returnType = "int";
            break;
          case 'J':
            returnType = "long";
            break;
          case 'F':
            returnType = "float";
            break;
          case 'D':
            returnType = "double";
            break;
          case 'L':
          case '[':
            while (charArr[i++] != ';')
              ;
            returnType = "object/string";
            break;
          case 'V':
            returnType = "void";
            break;
          default:
            returnType = null;
            break;
        }
      }

      return returnType;
      //let list = opData.opValList(returnType);
    }
  }

  /**This method is common method for save or edit BT Method */
  saveADDEditMethodTrans(fqmField): void {
    //openAddReturnRulesDialog()
    if (this.first) {
      this.first = false;
      this.isNewReturn = true;
      let returnType = this.getTypeReturnType(this.businessTransMethodDetail.fqm);
      if (returnType == 'null') {
        this.configUtilityService.errorMessage("FQM doesn't have any return type.");
      }
      else {
        this.openAddReturnRulesDialog();
      }
    }
    else if (this.second) {
      this.second = false;
      this.isNewArg = true;
      this.openAddArgumentRulesDialog();
    }
    else if (this.third) {
      this.third = false;
      this.isNewInvocation = true;
      this.openAddInvocationDialog();
    }
    else {
      //When add new application
      if (this.isNewMethod) {
        //Check for app name already exist or not
        if (!this.checkMethodNameAlreadyExist()) {
          this.saveMethod();
          this.btMethodRulesDetail = new RulesData();
          return;
        }
      }
      //When add edit Method
      else {
        if (this.selectedbusinessTransMethod[0].fqm != this.businessTransMethodDetail.fqm) {
          if (this.checkMethodNameAlreadyExist())
            return;
        }
        this.editMethod();
      }
    }

  }
  /**This method is used to validate the name of Method is already exists. */
  checkMethodNameAlreadyExist(): boolean {
    for (let i = 0; i < this.businessTransMethodInfo.length; i++) {
      if (this.businessTransMethodInfo[i].fqm == this.businessTransMethodDetail.fqm) {
        this.configUtilityService.errorMessage("Fully qualified method name already exists");
        return true;
      }
    }
  }

  modifyData(val) {
    if (val.enableArgumentType == true && (val.methodInvocation == null || val.methodInvocation == '-1')) {
      val.capturingType = "Argument";
    }
    else if (val.enableArgumentType == true && val.methodInvocation == '1') {
      val.capturingType = "Invocation";
    }
    else {
      val.capturingType = "Return";
    }
  }

  getHdrNames(data) {
    let hdrNamesHref = '';
    data.map(function (val, index) {
      if (index != (data.length - 1)) {
        hdrNamesHref = hdrNamesHref + val.headerName + ",";
      }
      else {
        hdrNamesHref = hdrNamesHref + val.headerName
      }
    })
    return hdrNamesHref;
  }

  operationListArgumentType() {
    let type = this.getTypeArgumentType(this.businessTransMethodDetail.fqm, this.businessTransMethodDetail.argumentIndex)
    this.changeOpertionType(type)
  }

  getTypeArgumentType(fqm, index) {

    //    let fqm = this.props.fqm;
    if (fqm != null) {
      if (index != -1) {
        let li = fqm.indexOf(')');
        let bi = fqm.indexOf('(');
        let i = bi + 1;

        let pi = 1;
        let charArr = fqm.split('');

        while (i < li) {
          //      System.out.println("pi " + pi + ", index - " + index + ", char - " + charArr[i] + ", i" + i + " bracket -" + (bi +1));
          switch (charArr[i]) {
            case 'Z':
              if (pi == index)
                return "boolean";
              break;
            case 'B':
              if (pi == index)
                return "byte";
              break;
            case 'C':
              if (pi == index)
                return "char";
              break;
            case 'S':
              if (pi == index)
                return "short";
              break;
            case 'I':
              if (pi == index)
                return "int";
              break;
            case 'J':
              if (pi == index)
                return "long";
              break;
            case 'F':
              if (pi == index)
                return "float";
              break;
            case 'D':
              if (pi == index)
                return "double";
              break;
            case 'L':
            case '[':
              while (charArr[i++] != ';') {
              }
              i--;
              if (pi == index)
                return "object/string";
            default:
              if (pi == index)
                return "void";
              break;
          }
          ++pi; i++;
        }
        //throw new InvalidOperationTypeException("Method argument index is not correct");
        return "NA";
      }
    }
  }

  //for creating list for index i.e arguments number list
  validateArgAndGetArgumentsNumberList(argVal) {
    if (this.businessTransMethodDetail.fqm == null || this.businessTransMethodDetail.fqm == "") {
      this.configUtilityService.errorMessage("Fill out fully qualified method name first");
      this.indexList = [];
      this.indexListForInvoc = [];
      return;
    }
    else {
      let argStart = this.businessTransMethodDetail.fqm.indexOf("(");
      let argEnd = this.businessTransMethodDetail.fqm.indexOf(")");
      let args = this.businessTransMethodDetail.fqm.substring(argStart + 1, argEnd);
      //flag used for creating string "Ljava/lang/String;"
      let flag = false;
      let length = 0;
      let string = '';
      if (args.length == 0) {
        this.configUtilityService.errorMessage("No Arguments present in Fqm")
      }
      else {
        for (let i = 0; i < args.length; i++) {
          if (args[i] == "L") {
            flag = true;
            string = string + args[i];
            continue;
          }
          else if (flag) {
            if (args[i] == ";") {
              string = string + args[i];

              // if (this.DATA_TYPE_ARR.indexOf(string) == -1) {
              //   this.configUtilityService.errorMessage("Invalid Argument Data Type")
              //   flag = false;
              //   return;
              // }
              // else {
              length++;
              string = '';
              flag = false;
              // }
            }
            else
              string = string + args[i];

          }
          else {
            if (this.DATA_TYPE_ARR.indexOf(args[i]) == -1) {
              this.configUtilityService.errorMessage("Invalid Argument Data Type")
              return;
            }
            else {
              length++;
            }
          }
        }
      }
      // this.indexList.push({ value: -1, label: '--Select Index--' });
      if (argVal == "ARGUMENT") {
        this.indexList = [];
        for (let i = 1; i <= length; i++) {
          this.indexList.push({ 'value': i, 'label': i + '' });
        }
      }
      else {
        this.indexListForInvoc = [];
        for (let i = 0; i <= length; i++) {
          this.indexListForInvoc.push({ 'value': i, 'label': i + '' });
        }
      }
    }
  }

  saveMethod() {
    this.businessTransMethodDetail.rules = [];
    if (this.enableArgumentType == "returnType") {
      this.businessTransMethodDetail.enableArgumentType = false;
      this.businessTransMethodDetail.rules = this.methodRulesInfo;
      this.businessTransMethodDetail.methodInvocation = '-1';
      this.businessTransMethodDetail.methodInvocationIndex = -1;
    }
    else if (this.enableArgumentType == "argument") {
      this.businessTransMethodDetail.enableArgumentType = true;
      this.businessTransMethodDetail.rules = this.methodArgRulesInfo;
      this.businessTransMethodDetail.methodInvocation = '-1';
      this.businessTransMethodDetail.methodInvocationIndex = -1;
    }
    else if (this.enableArgumentType == "invocation") {
      this.businessTransMethodDetail.enableArgumentType = true;
      this.businessTransMethodDetail.rules = this.methodInvocationRulesInfo;
      this.businessTransMethodDetail.methodInvocation = "1";
    }
    if (this.enableArgumentType == "invocation") {
      this.businessTransMethodDetail.returnType = '4';
    }
    else
      this.businessTransMethodDetail.returnType = this.type;

    if (this.enableArgumentType == "") {
      this.configUtilityService.errorMessage("Select enable return/argument type capturing");
      return;
    }
    if (this.enableArgumentType == "returnType" && this.methodRulesInfo.length == 0) {
      this.configUtilityService.errorMessage("Provide return type settings");
      return;
    }
    if (this.enableArgumentType == "argument" && this.methodArgRulesInfo.length == 0) {
      this.configUtilityService.errorMessage("Provide argument type settings");
      return;
    }
    if (this.enableArgumentType == "invocation" && this.methodInvocationRulesInfo.length == 0) {
      this.configUtilityService.errorMessage("Provide invocation type settings");
      return;
    }
    this.configKeywordsService.addBusinessTransMethod(this.businessTransMethodDetail, this.profileId).subscribe(data => {
      // this.businessTransMethodInfo.push(data)
      this.modifyData(data);
      this.businessTransMethodInfo = ImmutableArray.push(this.businessTransMethodInfo, data);
      if (!this.flag) {
        this.configKeywordsService.saveBusinessTransMethodData(this.profileId)
          .subscribe(data => {
          })
      }
      this.configUtilityService.successMessage(addMessage);
    });
    this.addBusinessTransMethodDialog = false;
    this.selectedbusinessTransMethod = [];
    this.indexList = [];
  }

  //For openong edit form of return type rules
  openEditReturnRulesDialog() {
    if (!this.selectedMethodRules || this.selectedMethodRules.length < 1) {
      this.configUtilityService.errorMessage("Select a row to edit");
    }
    else if (this.selectedMethodRules.length > 1) {
      this.configUtilityService.errorMessage("Select only one row to edit")
    }
    else {
      // this.isNewReturn = false;
      this.editReturnRules = true;
      let selectedRules = this.selectedMethodRules;
      // this.addRulesDialog = true;
      let that = this;
      this.methodRulesInfo.map(function (val) {
        val.id = that.returnCount;
        that.returnCount = that.returnCount + 1;
        // val.typeName = that.getTypeName(val.type)
      })
      this.btMethodRulesDetail = Object.assign({}, this.selectedMethodRules[0]);
    }
  }

  //For openong edit form of argument type rules
  openEditArgRulesDialog() {
    if (!this.selectedArgRules || this.selectedArgRules.length < 1) {
      this.configUtilityService.errorMessage("Select a row to edit");
    }
    else if (this.selectedArgRules.length > 1) {
      this.configUtilityService.errorMessage("Select only one row to edit")
    }
    else {
      this.isNewArg = false;
      this.editArgumentRules = true;
      let selectedRules = this.selectedArgRules;
      let that = this;
      this.methodArgRulesInfo.map(function (val) {
        val.id = that.argCount;
        that.argCount = that.argCount + 1;
        // val.typeName = that.getTypeName(val.type)
      })
      // this.addArgRulesDialog = true;
      this.btMethodRulesDetail = Object.assign({}, this.selectedArgRules[0]);
    }
  }

  /**For close add/edit Method dialog box */
  closeDialog(): void {
    this.addBusinessTransMethodDialog = false;
    this.selectedbusinessTransMethod = [];
    this.selectedMethodRules = [];
    this.methodBtTypeDelete = [];
    this.selectedArgRules = [];
    this.indexList = [];
    // this.btMethodRulesDetail = new RulesData();
  }

  closeReturnDialog(): void {
    this.addRulesDialog = false;
    this.selectedMethodRules = [];
    this.addBusinessTransMethodDialog = true;
  }

  closeArgDialog(): void {
    this.addArgRulesDialog = false;
    this.selectedArgRules = [];
    this.addBusinessTransMethodDialog = true;
  }

  validateReturnType(fqm) {
    //for getting return Type
    let returnType = "NA";
    if (fqm != null) {
      let li = fqm.indexOf(')');
      let i = li + 1;

      let pi = 1;
      let charArr = fqm.split('');
      if (charArr[i] == '') {
        return null;
      }
      //      System.out.println("pi " + pi + ", index - " + index + ", char - " + charArr[i] + ", i" + i + " bracket -" + (bi +1));
      else {
        switch (charArr[i]) {
          case 'Z':
            returnType = "boolean";
            break;
          case 'B':
            returnType = "byte";
            break;
          case 'C':
            returnType = "char";
            break;
          case 'S':
            returnType = "short";
            break;
          case 'I':
            returnType = "int";
            break;
          case 'J':
            returnType = "long";
            break;
          case 'F':
            returnType = "float";
            break;
          case 'D':
            returnType = "double";
            break;
          case 'L':
          case '[':
            while (charArr[i++] != ';')
              ;
            returnType = "object/string";
            break;
          case 'V':
            returnType = "void";
            // this.enableArgumentType = "void";
            // this.configUtilityService.errorMessage("Operation not permitted for FQM's having return type as Void");
            break;
          default:
            returnType = null;
            break;
        }
      }
      return returnType;
    }
  }

  openFileManager() {
    this.openFileExplorerDialog = true;
    this.isbTMethodBrowse = true;
  }

  /** This method is called form ProductUI config-nd-file-explorer component with the path
 ..\ProductUI\gui\src\app\modules\file-explorer\components\config-nd-file-explorer\ */

  /* dialog window & set relative path */
  uploadFile(filepath) {
    if (this.isbTMethodBrowse == true) {
      this.isbTMethodBrowse = false;
      this.openFileExplorerDialog = false;
      let fileNameWithExt: string;
      let fileExt: string;
      fileNameWithExt = filepath.substring(filepath.lastIndexOf("/"), filepath.length)
      fileExt = fileNameWithExt.substring(fileNameWithExt.lastIndexOf("."), fileNameWithExt.length);
      let check: boolean;
      if (fileExt == ".btr" || fileExt == ".txt") {
        check = true;
      }
      else {
        check = false;
      }
      if (check == false) {
        this.configUtilityService.errorMessage("File Extension(s) other than .txt and .btr are not supported");
        return;
      }

      if (filepath.includes(";")) {
        this.configUtilityService.errorMessage("Multiple files cannot be imported at the same time");
        return;
      }
      this.configKeywordsService.uploadBTMethodFile(filepath, this.profileId).subscribe(data => {
        if (data.length == this.businessTransMethodInfo.length) {
          this.configUtilityService.errorMessage("Could not upload. This file may already be imported or contains invalid data");
        }
        let that = this;
        data.map(function (val) {
          that.modifyData(val);
        })
        this.businessTransMethodInfo = data;
      });
    }
  }

  //Method Invoked to open Dialog of Invocation during ADD
  openAddInvocationDialog() {
    this.btMethodRulesDetail = new RulesData();
    this.addInvocationRulesDialog = true;
  }
//Method Invoked to open Dialog of Invocation during EDIT
  openEditInvocationDialog() {
    if (!this.selectedInvocationRules || this.selectedInvocationRules.length < 1) {
      this.configUtilityService.errorMessage("Select a row to edit");
    }
    else if (this.selectedInvocationRules.length > 1) {
      this.configUtilityService.errorMessage("Select only one row to edit")
    }
    else {
      this.isNewInvocation = false;
      this.editInvocationRules = true;
      let selectedRules = this.selectedInvocationRules;
      let that = this;
      this.methodInvocationRulesInfo.map(function (val) {
        val.id = that.invocationCount;
        that.invocationCount = that.invocationCount + 1;
      })
      // this.addInvocationRulesDialog = true;
      this.btMethodRulesDetail = Object.assign({}, this.selectedInvocationRules[0]);
    }
  }
  //saveInvocationRules called from Dialog of INVOCATION
  saveInvocationRules() {
    this.btMethodRulesDetail.operationName = "METHODRETVALUE";
    //in edit form, to edit Invocation rules
    if (!this.isNewMethod) {
      if (this.editInvocationRules) {
        this.editInvocationRules = false;
        let that = this;
        this.methodInvocationRulesInfo.map(function (val) {
          if (val.id == that.btMethodRulesDetail.id) {
            val.btName = that.btMethodRulesDetail.btName;
            val.opCode = that.btMethodRulesDetail.opCode;
            val.operationName = that.btMethodRulesDetail.operationName;
            val.previousBtMethodRulesIds = that.btMethodRulesDetail.previousBtMethodRulesIds;
            val.value = that.btMethodRulesDetail.value;
          }
        })
        this.selectedInvocationRules = [];
      }
      else {
        //In edit form, to add new Invocation rule
        this.btMethodRulesDetail["id"] = this.invocationCountEdit;
        this.businessTransMethodDetail.rules = ImmutableArray.push(this.methodInvocationRulesInfo, this.btMethodRulesDetail);
        this.methodInvocationRulesInfo = this.businessTransMethodDetail.rules;
        this.invocationCountEdit = this.invocationCountEdit + 1;
      }
    }
    else {
      //in add form, to edit Invocation rules
      if (this.editInvocationRules) {
        this.editInvocationRules = false;
        let that = this;
        this.methodInvocationRulesInfo.map(function (val) {
          if (val.id == that.btMethodRulesDetail.id) {
            val.btName = that.btMethodRulesDetail.btName;
            val.opCode = that.btMethodRulesDetail.opCode;
            val.operationName = that.btMethodRulesDetail.operationName;
            val.previousBtMethodRulesIds = that.btMethodRulesDetail.previousBtMethodRulesIds;
            val.value = that.btMethodRulesDetail.value;
          }
        })
        this.selectedInvocationRules = [];
      }
      else {
        //In add form, to add new Invocation rule
        this.btMethodRulesDetail["id"] = this.invocationCountEdit;
        this.methodInvocationRulesInfo = ImmutableArray.push(this.methodInvocationRulesInfo, this.btMethodRulesDetail);
        this.invocationCountEdit = this.invocationCountEdit + 1;
      }
    }
    this.addInvocationRulesDialog = false;
    this.selectedInvocationRules = [];
    this.btMethodRulesDetail = new RulesData();
  }

  //Deletimg  Method Invocation rules
  deleteInvocationsRules(): void {
    if (!this.selectedInvocationRules || this.selectedInvocationRules.length < 1) {
      this.configUtilityService.errorMessage("Select row(s) to delete");
      return;
    }
    let selectedRules = this.selectedInvocationRules;
    let arrInvocationIndex = [];
    for (let index in selectedRules) {
      arrInvocationIndex.push(selectedRules[index]);
      if (selectedRules[index].hasOwnProperty('btMethodRuleId')) {
        this.methodBtTypeDelete.push(selectedRules[index].btMethodRuleId);
      }
    }
    this.deleteInvocationRulesFromTable(arrInvocationIndex);
    this.selectedInvocationRules = [];
  }

  /**This method is used to delete  Method Invocation Rules from Data Table */
  deleteInvocationRulesFromTable(arrRulesIndex: any[]): void {
    //For stores table row index
    let rowIndex: number[] = [];

    for (let index in arrRulesIndex) {
      rowIndex.push(this.getInvocationRulesIndex(arrRulesIndex[index]));
    }
    this.methodInvocationRulesInfo = deleteMany(this.methodInvocationRulesInfo, rowIndex);
  }

  /**This method returns selected method invocation row on the basis of selected row */
  getInvocationRulesIndex(methodInvocationId: any): number {
    for (let i = 0; i < this.methodInvocationRulesInfo.length; i++) {
      if (this.methodInvocationRulesInfo[i] == methodInvocationId) {
        return i;
      }
    }
    return -1;
  }

  /**This method is used to validate the name of MethodBT  already exists. */
  checkMethodBTNameNameAlreadyExist(): boolean {
    for (let i = 0; i < this.methodInvocationRulesInfo.length; i++) {
      if (this.methodInvocationRulesInfo[i].btName == this.btMethodRulesDetail.btName) {
        this.configUtilityService.errorMessage("Default BT Name already exist");
        return true;
      }
    }
  }
  closeInvocationDialog() {
    this.addInvocationRulesDialog = false;
    this.selectedInvocationRules = [];
    this.addBusinessTransMethodDialog = true;
  }
}
