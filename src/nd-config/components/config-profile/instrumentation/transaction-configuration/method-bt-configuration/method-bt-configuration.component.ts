import { Component, OnInit } from '@angular/core';
import { ConfigKeywordsService } from '../../../../../services/config-keywords.service';
import { BusinessTransMethodInfo } from '../../../../../interfaces/business-trans-method-info';
import { ConfigUiUtility } from '../../../../../utils/config-utility';
import { BusinessTransMethodData, RulesData, ArgumentRulesData } from '../../../../../containers/instrumentation-data'
import { SelectItem, ConfirmationService } from 'primeng/primeng';
import { ConfigUtilityService } from '../../../../../services/config-utility.service';
import { deleteMany } from '../../../../../utils/config-utility';
import { ActivatedRoute, Params } from '@angular/router';
import { MethodBasedCustomData, ReturnTypeData, ArgumentTypeData } from '../../../../../containers/method-based-custom-data';
import { Messages } from '../../../../../constants/config-constant'

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
  selectedbusinessTransMethod: any;

  /* Assign data to Rules Business Transaction Data table */
  methodRulesInfo: RulesData[];
  methodArgRulesInfo: ArgumentRulesData[];
  btMethodRulesDetail: RulesData;

  selectedMethodRules: any;
  selectedArgRules: any;

  /* For holding form fields*/
  returnTypeRules: ReturnTypeData;
  argumentTypeRules: ArgumentTypeData;

  selectedReturnRules: ReturnTypeData[];

  selectedArgumentRules:ArgumentTypeData[];

  /* open dialog box */
  addBusinessTransMethodDialog: boolean = false;
  addRulesDialog: boolean = false;
  addArgRulesDialog: boolean = false;

  /* Assign value to return type drop down */
  returnTypeList: SelectItem[];

  /*selected item from Return type list*/
  selectedReturnType: string;

  /* to hold data to display in table of return type and argument type in table */
  returnTypeData: ReturnTypeData[];
  argumentTypeData: ArgumentTypeData[];

  /* Assign value to Return type drop down */
  operationList: SelectItem[];

  /*selected item from return type list*/
  selectedOperation: string;

  isNewMethod: boolean = false;

  /*For cheking FQM */
  first: boolean;
  second: boolean;

  saveDisable: boolean = false;
  indexList: SelectItem[];

  constructor(private route: ActivatedRoute, private configKeywordsService: ConfigKeywordsService, private configUtilityService: ConfigUtilityService, private confirmationService: ConfirmationService) {

    let arrLabel = ['Numeric', 'String', 'Boolean', 'Char or byte'];
    let arrValue = ['Numeric', 'String', 'Boolean', 'Char or Byte'];

    this.returnTypeList = [];
    this.returnTypeList = ConfigUiUtility.createListWithKeyValue(arrLabel, arrValue);

    this.methodRulesInfo = [];
    this.methodArgRulesInfo = [];
  }

  arrStringLabel: any[] = ['Equals', 'Not equals', 'Contains', 'Starts with', 'Ends with', 'Exception'];
  arrStringValue: any[] = ['EQUALS', 'NOT EQUALS', 'CONTAINS', 'STARTS WITH', 'ENDS WITH', 'EXCEPTION'];


  arrNumericLabel: any[] = ['Equals', 'Not equals', 'Less than', 'Greater than', 'Less than equals to', 'Greater than equals to', 'Eq', 'Ne', 'Exception'];
  arrNumericValue: any[] = ['EQUAL', 'NOT EQUAL', 'LESS THAN', 'GREATER THAN', 'LESS THAN EQUAL TO', 'GREATER THAN EQUAL TO', 'EQ', 'NE', 'EXCEPTION'];

  arrCharLabel: any[] = ['Exception', 'Eq', 'Ne'];
  arrCharValue: any[] = ['EXCEPTION', 'EQ', 'NE'];

  arrBooleanLabel: any[] = ['True', 'False', 'Exception'];
  arrBooleanValue: any[] = ['TRUE', 'FALSE', 'EXCEPTION'];

  DATA_TYPE = {
    BOOLEAN: 'Z',
    SHORT: 'S',
    INTEGER: 'I',
    STRING: 'Ljava/lang/String;',
    BYTE: 'B',
    FLOAT: 'F',
    DOUBLE: 'D',
    LONG: 'J'
  };

  DATA_TYPE_ARR = [
    this.DATA_TYPE.BOOLEAN,
    this.DATA_TYPE.SHORT,
    this.DATA_TYPE.INTEGER,
    this.DATA_TYPE.STRING,
    this.DATA_TYPE.BYTE,
    this.DATA_TYPE.FLOAT,
    this.DATA_TYPE.DOUBLE,
    this.DATA_TYPE.LONG
  ];

  changeOpertionType(type) {
    //     console.log("rrrrrrrr",type);
    //     if (type == "Numeric") {
    //       this.operationList = [];
    //       let arrLabel = ['Equals', 'Not equals', 'Less than', 'Greater than', 'Less than equals to', 'Greater than equals to', 'Eq', 'Ne', 'Exception'];
    //       let arrValue = ['EQUAL', 'NOT EQUAL', 'LESS THAN', 'GREATER THAN', 'LESS THAN EQUAL TO', 'GREATER THAN EQUAL TO', 'EQ', 'NE', 'EXCEPTION'];
    //       this.operationList = ConfigUiUtility.createListWithKeyValue(arrLabel, arrValue);
    //     }
    //     else if (type == "String") {
    //       this.operationList = [];
    //       let arrLabel = ['Equals', 'Not equals', 'Contains', 'Starts with', 'Ends with', 'Exception'];
    //       let arrValue = ['EQUALS', 'NOT EQUALS', 'CONTAINS', 'STARTS WITH', 'ENDS WITH', 'EXCEPTION'];
    //       this.operationList = ConfigUiUtility.createListWithKeyValue(arrLabel, arrValue);
    //     }
    //     else if (type == "boolean") {
    //       this.operationList = [];
    //       let arrLabel = ['True', 'False', 'Exception'];
    //       let arrValue = ['TRUE', 'FALSE', 'EXCEPTION'];
    //       this.operationList = ConfigUiUtility.createListWithKeyValue(arrLabel, arrValue);
    //     }
    //     else if (type == "Char or Byte") {
    //       this.operationList = [];
    //       let arrLabel = ['Exception', 'Eq', 'Ne'];
    //       let arrValue = ['EXCEPTION', 'EQ', 'NE'];
    //       this.operationList = ConfigUiUtility.createListWithKeyValue(arrLabel, arrValue);
    //     }
    // console.log("this.operationList----",this.operationList)

    if (type == "object/string")
      this.operationList = ConfigUiUtility.createListWithKeyValue(this.arrStringLabel, this.arrStringValue);

    else if (type == "int" || type == "short" || type == "float" || type == "long" || type == "double")
      this.operationList = ConfigUiUtility.createListWithKeyValue(this.arrNumericLabel, this.arrNumericValue)

    else if (type == "byte" || type == "char")
      this.operationList = ConfigUiUtility.createListWithKeyValue(this.arrCharLabel, this.arrCharValue)

    else if (type == "boolean")
      this.operationList = ConfigUiUtility.createListWithKeyValue(this.arrBooleanLabel, this.arrBooleanValue)
  }

  ngOnInit() {
    this.loadBTMethodData();
  }

  /** Fetch BT Mehtod Data and Assign on Loading */
  loadBTMethodData(): void {
    this.route.params.subscribe((params: Params) => {
      this.profileId = params['profileId'];
      this.saveDisable = this.profileId == 1 ? true : false;
    });
    this.configKeywordsService.getBusinessTransMethodData(this.profileId).subscribe(data => this.businessTransMethodInfo = data);
  }

  /** this method used for open dialog for add Method Business Transaction */
  openMethodDialog() {
    this.businessTransMethodDetail = new BusinessTransMethodData();
    this.btMethodRulesDetail = new RulesData();
    this.addBusinessTransMethodDialog = true;
    this.isNewMethod = true;

  }

  /** This method is used to open a dialog for add Rules
   * Call a method for fill Operation drop down according Return Type
  */
  openAddReturnRulesDialog() {

    this.addRulesDialog = true;
    this.returnTypeRules = new ReturnTypeData()
    /*calling this function
    * to know data type of return value of provided fqm
    * and creating opertaion list a/c to return type
    */
    let type = this.getTypeReturnType(this.businessTransMethodDetail.fqm)
    this.changeOpertionType(type)
    // this.changeOpertionType();
  }

  openAddArgumentRulesDialog() {
    this.validateArgAndGetArgumentsNumberList();
  }

  /** Edit BT Method */
  editMethodTrans(): void {
    this.businessTransMethodDetail = new BusinessTransMethodData();
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
    this.businessTransMethodDetail = Object.assign({}, this.selectedbusinessTransMethod[0]);
  }

  /**This method is used to edit Method detail */
  editMethod(): void {
    this.configKeywordsService.editBusinessTransMethod(this.businessTransMethodDetail, this.profileId)
      .subscribe(data => {
        let index = this.getMethodBusinessIndex(this.businessTransMethodDetail.btMethodId);
        this.selectedbusinessTransMethod.length = 0;
        this.selectedbusinessTransMethod.push(data);
        this.configUtilityService.successMessage(Messages);
        this.businessTransMethodInfo[index] = data;
      });
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
    let selectedRules = this.selectedMethodRules;
    let arrRulesIndex = [];
    for (let index in selectedRules) {
      arrRulesIndex.push(selectedRules[index]);
    }
    this.deleteRulesFromTable(arrRulesIndex);
  }

  //deletimg Argument rules
  deleteArgumentsRules():void{
      let selectedRules = this.selectedArgRules;
      let arrArgIndex = [];
      for (let index in selectedRules) {
          arrArgIndex.push(selectedRules[index].id);
      }
    this.deleteArgRulesFromTable(arrArgIndex);     
    
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
     console.log("this.btMethodRulesDetail--re",this.btMethodRulesDetail);
    
    this.methodRulesInfo.push(this.btMethodRulesDetail);
    // this.configUtilityService.successMessage(Messages);
    this.addRulesDialog = false;
  }

   saveArgRules() {
     console.log("this.btMethodRulesDetail--arg",this.btMethodRulesDetail);
    this.methodArgRulesInfo.push(this.btMethodRulesDetail);
    // this.configUtilityService.successMessage(Messages);
    this.addArgRulesDialog = false;
  }

  getTypeReturnType(fqm) {
    //for getting return Type
    let returnType = "NA";
    if (fqm != null) {
      let li = fqm.indexOf(')');
      let i = li + 1;

      let pi = 1;
      let charArr = fqm.split('');
      //      System.out.println("pi " + pi + ", index - " + index + ", char - " + charArr[i] + ", i" + i + " bracket -" + (bi +1));
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
        default:
          returnType = "void";
          break;
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
      let returnType = this.getTypeReturnType(this.businessTransMethodDetail.fqm);
      if (returnType == 'void') {
        this.configUtilityService.errorMessage("FQM doesn't have any return type.");
        //  fqmField.setCustomValidity("FQM doesn't have any return type.");
      }
      else if (returnType == 'null') {
        this.configUtilityService.errorMessage("FQM doesn't have any valid return type.");
      }
      else {
        this.openAddReturnRulesDialog();
      }
    }
    else if (this.second) {
      this.second = false;
      this.openAddArgumentRulesDialog();
    }
    else {
      //When add new application
      if (this.isNewMethod) {
        //Check for app name already exist or not
        if (!this.checkMethodNameAlreadyExist()) {
          this.saveMethod();
          return;
        }
      }

      //When add edit Method
      else {
        if (this.businessTransMethodInfo[0].fqm != this.businessTransMethodDetail.fqm) {
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
        this.configUtilityService.errorMessage("Application Name already exist");
        return true;
      }
    }
  }

  operationListArgumentType() {
    let type = this.getTypeArgumentType(this.businessTransMethodDetail.fqm, this.argumentTypeRules.indexVal)
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
              while (charArr[i++] != ';' && i < charArr[i].length)
                ;
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
  validateArgAndGetArgumentsNumberList() {
    if (this.businessTransMethodDetail.fqm != null) {
      let argStart = this.businessTransMethodDetail.fqm.indexOf("(");
      let argEnd = this.businessTransMethodDetail.fqm.indexOf(")");
      let args = this.businessTransMethodDetail.fqm.substring(argStart + 1, argEnd);
      //flag used for creating string "Ljava/lang/String;"
      let flag = false;
      let length = 0;
      let string = '';
      for (let i = 0; i < args.length; i++) {
        if (args[i] == "L") {
          flag = true;
          string = string + args[i];
          continue;
        }
        else if (flag) {
          if (args[i] == ";") {
            string = string + args[i];

            //here string = "Ljava/lang/String;"

            if (this.DATA_TYPE_ARR.indexOf(args[i]) == -1) {
              this.configUtilityService.errorMessage("Invalid Argument Data Type")
              flag = false;
              return;
            }
            else {
              length++;
            }
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
      this.indexList = [];
      // this.indexList.push({ value: -1, label: '--Select Index--' });
      for (let i = 1; i <= length; i++) {
        this.indexList.push({ 'value': i, 'label': i + '' });
      }
    }
    this.addArgRulesDialog = true;
    this.argumentTypeRules = new ArgumentTypeData();
    // this.addArgumentRulesDialog = true;
    // this.businessTransMethodDetail = new BusinessTransMethodData();
  }

  saveMethod() {

    this.businessTransMethodDetail.rules = [];
    var code: number;
    if ((this.businessTransMethodDetail.returnType == "String") && (this.btMethodRulesDetail.operationName == "EQUALS"))
      code = 1;
    if ((this.businessTransMethodDetail.returnType == "String") && (this.btMethodRulesDetail.operationName == "NOT EQUALS"))
      code = 2;
    if ((this.businessTransMethodDetail.returnType == "String") && (this.btMethodRulesDetail.operationName == "CONTAINS"))
      code = 3;
    if ((this.businessTransMethodDetail.returnType == "String") && (this.btMethodRulesDetail.operationName == "STARTS WITH"))
      code = 4;
    if ((this.businessTransMethodDetail.returnType == "String") && (this.btMethodRulesDetail.operationName == "ENDS WITH"))
      code = 5;
    if ((this.businessTransMethodDetail.returnType == "String") && (this.btMethodRulesDetail.operationName == "EXCEPTION"))
      code = 6;

    if ((this.businessTransMethodDetail.returnType == "Numeric") && (this.btMethodRulesDetail.operationName == "EQUAL"))
      code = 7;
    if ((this.businessTransMethodDetail.returnType == "Numeric") && (this.btMethodRulesDetail.operationName == "NOT EQUAL"))
      code = 8;
    if ((this.businessTransMethodDetail.returnType == "Numeric") && (this.btMethodRulesDetail.operationName == "LESS THAN"))
      code = 9;
    if ((this.businessTransMethodDetail.returnType == "Numeric") && (this.btMethodRulesDetail.operationName == "GREATER THAN"))
      code = 10;
    if ((this.businessTransMethodDetail.returnType == "Numeric") && (this.btMethodRulesDetail.operationName == "LESS THAN EQUAL TO"))
      code = 11;
    if ((this.businessTransMethodDetail.returnType == "Numeric") && (this.btMethodRulesDetail.operationName == "GREATER THAN EQUAL TO"))
      code = 12;
    if ((this.businessTransMethodDetail.returnType == "Numeric") && (this.btMethodRulesDetail.operationName == "EQ"))
      code = 13;
    if ((this.businessTransMethodDetail.returnType == "Numeric") && (this.btMethodRulesDetail.operationName == "NE"))
      code = 14;
    if ((this.businessTransMethodDetail.returnType == "Numeric") && (this.btMethodRulesDetail.operationName == "EXCEPTION"))
      code = 15;

    if ((this.businessTransMethodDetail.returnType == "Boolean") && (this.btMethodRulesDetail.operationName == "TRUE"))
      code = 16;
    if ((this.businessTransMethodDetail.returnType == "Boolean") && (this.btMethodRulesDetail.operationName == "FALSE"))
      code = 17;
    if ((this.businessTransMethodDetail.returnType == "Boolean") && (this.btMethodRulesDetail.operationName == "EXCEPTION"))
      code = 18;

    if ((this.businessTransMethodDetail.returnType == "Char or Byte") && (this.btMethodRulesDetail.operationName == "EXCEPTION"))
      code = 19;
    if ((this.businessTransMethodDetail.returnType == "Char or Byte") && (this.btMethodRulesDetail.operationName == "EQ"))
      code = 20;
    if ((this.businessTransMethodDetail.returnType == "Char or Byte") && (this.btMethodRulesDetail.operationName == "NE"))
      code = 21;

    for (let i = 0; i < this.methodRulesInfo.length; i++) {
      this.businessTransMethodDetail.rules[i] = { btMethodRuleId: i, opCode: code, opCodeDropDown: { dropDownVal: code }, btName: this.methodRulesInfo[i].btName, value: this.methodRulesInfo[i].value, operationName: this.methodRulesInfo[i].operationName };
    }
    this.configKeywordsService.addBusinessTransMethod(this.businessTransMethodDetail, this.profileId).subscribe(data => {
      this.businessTransMethodInfo.push(data)
      this.configUtilityService.successMessage(Messages);
    });
    this.addBusinessTransMethodDialog = false;
  }

  /**For close add/edit Method dialog box */
  closeDialog(): void {
    this.addBusinessTransMethodDialog = false;
  }

  closeReturnDialog(): void {
    this.addRulesDialog = false;
    this.addBusinessTransMethodDialog = true;
  }

  closeArgDialog(): void {
    this.addArgRulesDialog = false;
    this.addBusinessTransMethodDialog = true;
  }
}
