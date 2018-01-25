import { Component,Input, OnInit } from '@angular/core';
import { ConfigCustomDataService } from '../../../../../services/config-customdata.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { SelectItem, ConfirmationService } from 'primeng/primeng';
import { ConfigUiUtility } from '../../../../../utils/config-utility';
import { ConfigUtilityService } from '../../../../../services/config-utility.service';
import { deleteMany } from '../../../../../utils/config-utility';
import { MethodBasedCustomData, ReturnTypeData, ArgumentTypeData } from '../../../../../containers/method-based-custom-data';

import { ImmutableArray } from '../../../../../utils/immutable-array';

import { Messages } from '../../../../../constants/config-constant'

@Component({
  selector: 'app-java-method',
  templateUrl: './java-method.component.html',
  styleUrls: ['./java-method.component.css']
})
export class JavaMethodComponent implements OnInit {

  @Input()
  saveDisable: boolean;

  subscription: Subscription;

  /* hold the data that needs to be displayed in table */
  tableData: MethodBasedCustomData[];

  /**For add/edit form flag */
  isNew: boolean = false;

  /**For open/close add/edit dialog */
  addEditDialog: boolean = false;


  /**It stores selected data for edit or add functionality */
  methodBasedCustomData: MethodBasedCustomData;

  selectedReturnRules: ReturnTypeData[];

  selectedArgumentRules:ArgumentTypeData[];


  /**It stores selected java method selected data */
  selectedJavaMethod: MethodBasedCustomData[];


  /** for holding form fields */
  returnTypeRules: ReturnTypeData;
  argumentTypeRules: ArgumentTypeData;

  addReturnRulesDialog: boolean = false;

  addArgumentRulesDialog: boolean = false;

  customValTypeList: SelectItem[];

  indexList:SelectItem[];


  first:boolean;
  second:boolean;


  returnRulesDelete=[];
  argumentRulesDelete=[];



//flag used for titles in edit dialog of rules
  editReturnRules :boolean = false;
  editArgumentRules:boolean = false;
  


//these counter varaiable are used for providing unique id to ruleas added so that we can use it for delete and edit purpose
  returnCounter:number =0;
  argumentCounter:number = 0;

  returnCounterEdit :number= 0;
  argumentCounterEdit :number= 0;


  /* store operation list */
  operationList: SelectItem[];

  /* to hold data to display in table of return type and argument type in table */
  returnTypeData: ReturnTypeData[];
  argumentTypeData: ArgumentTypeData[];

//for holding operator';s value of Extract SubPart Operation for return type
  leftBoundReturn:any;
  rightBoundReturn:any;

  //for holding operartor's value of extract subpart Operation for argument Type
  leftBoundArgument:any;
  rightBoundArgument:any;



  arrStringLabel: any[] = ['Capture', 'Extract_Subpart', 'Invocation', 'Equals', 'Not Equals', 'Contains', 'Starts With', 'Ends With', 'Exception'];
  arrStringValue: any[] = ['CAPTURE', 'EXTRACT_SUBPART', 'INVOCATION', 'EQUALS', 'NOT_EQUALS', 'CONTAINS', 'STARTS_WITH', 'ENDS_WITH', 'EXCEPTION'];


  arrNumericLabel: any[] = ['Capture', 'Invocation', 'Exception', 'Equals', 'Not Equals', 'Less Than', 'Greater Than', 'Less Than Equals To', 'Greater Than Equal To'];
  arrNumericValue: any[] = ['CAPTURE', 'INVOCATION', 'EXCEPTION', 'EQ', 'NE', 'LT', 'GT', 'LE', 'GE'];

  arrCharLabel: any[] = ['Capture', 'Invocation', 'Exception', 'Equals', 'Not Equals'];
  arrCharValue: any[] = ['CAPTURE', 'INVOCATION', 'EXCEPTION', 'EQ', 'NE'];

  arrBooleanLabel: any[] = ['Capture', 'Invocation', 'Exception'];
  arrBooleanValue: any[] = ['CAPTURE', 'INVOCATION', 'EXCEPTION'];

  DATA_TYPE = {
    BOOLEAN: 'Z',
    SHORT: 'S',
    INTEGER: 'I',
    STRING: 'Ljava/lang/String;',
    BYTE: 'B',
    FLOAT: 'F',
    DOUBLE: 'D',
    LONG: 'J',
    CHAR: 'C'
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
    this.DATA_TYPE.CHAR
  ];

  isProfilePerm: boolean;

  //receiving data from store
  constructor(private route: ActivatedRoute, private configCustomDataService: ConfigCustomDataService, private store: Store<Object>, private configUtilityService: ConfigUtilityService, private confirmationService: ConfirmationService) {
    this.subscription = this.store.select("customData").subscribe(data => {
      // this.tableData = data;
    })

    this.returnTypeData = [];
    this.argumentTypeData = [];
  }
  profileId: number;


  ngOnInit() {
    this.isProfilePerm=+sessionStorage.getItem("ProfileAccess") == 4 ? true : false;
    this.loadJavaMethodBasedCustomData()
  }

  loadJavaMethodBasedCustomData() {
    this.route.params.subscribe((params: Params) => {this.profileId = params['profileId'];
      if(this.profileId == 1 || this.profileId == 777777 || this.profileId == 888888)
       this.saveDisable =  true;
  });
    this.configCustomDataService.getMethodBasedCustomData(this.profileId).subscribe(data => {
      this.modifyData(data)
    })
    let arrLabel = ['String', 'Integer', 'Decimal'];
    let arrValue = ['0', '1', '2'];
    this.customValTypeList = ConfigUiUtility.createListWithKeyValue(arrLabel, arrValue);
  }


  /* these functions are used in order to form the data as per requiremet of data to be
  *  is table screen i,e.
  * adding an extra key -value pair in each object.
  *  returnTypeValue = "aa,bb",
  *  argumentTypeValue = "bb,cc"
  *
  *
  */

  modifyData(data) {
    let that = this;
    data.map(function (val) {

      if (val.returnTypeData != null && val.returnTypeData.length != 0) {
        let hdrNames = that.getHdrNames(val.returnTypeData);
        val.returnTypeValue = hdrNames
      }
      else {
        val.returnTypeValue = "NA"
      }

      if (val.argumentTypeData != null && val.argumentTypeData.length != 0) {
        let hdrNames = that.getHdrNames(val.argumentTypeData);
        val.argumentTypeValue = hdrNames
      }
      else {
        val.argumentTypeValue = "NA"
      }
    })
    this.tableData = data
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

  openAddDialog() {
    this.methodBasedCustomData = new MethodBasedCustomData();
    this.returnTypeData = [];
    this.argumentTypeData = [];
    this.isNew = true;
    this.addEditDialog = true;
  }

  openEditDialog(){
    this.leftBoundReturn = '';
    this.rightBoundReturn = '';
    this.methodBasedCustomData = new MethodBasedCustomData();

    if (!this.selectedJavaMethod || this.selectedJavaMethod.length < 1) {
      this.configUtilityService.errorMessage("Select a row to edit");
      return;
    }
    else if (this.selectedJavaMethod.length > 1) {
      this.configUtilityService.errorMessage("Select only one row to edit");
      return;
    }
    else{

      let that = this;
      this.methodBasedCustomData = this.selectedJavaMethod[0];
      this.returnTypeData = this.selectedJavaMethod[0].returnTypeData;
      this.returnTypeData.map(function(val){
        val.id =that.returnCounterEdit;
        that.returnCounterEdit = that.returnCounterEdit + 1;
        val.typeName = that.getTypeName(val.type)
      })
      this.argumentTypeData = this.selectedJavaMethod[0].argumentTypeData;
      this.argumentTypeData.map(function(val){
        val.id = that.argumentCounterEdit;
        val.typeName = that.getTypeName(val.type)
        that.argumentCounterEdit = that.argumentCounterEdit + 1;
      })
      this.selectedArgumentRules = [];
      this.selectedReturnRules = []
      this.addEditDialog = true;
      this.isNew = false;
      this.returnRulesDelete = [];
      this.argumentRulesDelete = [];
    }
  }


  
  saveEditData(fqmField) {

    //openAddReturnRulesDialog()
    if (this.first) {
      this.first = false;
      let returnType = this.getTypeReturnType(this.methodBasedCustomData.fqm);
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
      this.methodBasedCustomData.argumentTypeData = this.argumentTypeData; 
      this.methodBasedCustomData.returnTypeData = this.returnTypeData;

      if (!this.isNew) {
        if (this.methodBasedCustomData.enableArgumentType == false && this.methodBasedCustomData.enableReturnType == false) {
          this.configUtilityService.errorMessage("Choose atleast one capturing type");
          return;
        }
        if (this.methodBasedCustomData.enableArgumentType == true && this.argumentTypeData.length == 0) {
          this.configUtilityService.errorMessage("Provide argument type setting(s)");
          return;
        }
        if (this.methodBasedCustomData.enableReturnType == true && this.returnTypeData.length == 0) {
          this.configUtilityService.errorMessage("Provide return type setting(s)");
          return;
        }
        /****for edit case
         *  first triggering the request to delete the return rules and
         *  when response comes then triggering request to delete argument rules
         * and then  adding the new added rules
         *
         */
        this.configCustomDataService.deleteReturnRules(this.returnRulesDelete).subscribe(data => {
          this.configCustomDataService.deleteArgumentRules(this.argumentRulesDelete).subscribe(data => {
            this.configCustomDataService.editMethodBasedCustomData(this.methodBasedCustomData).subscribe(data => {
              this.tableData.map(function (val) {
                if (val.methodBasedId == data.methodBasedId) {
                  val = data
                }
              })
              this.configUtilityService.successMessage(Messages);
              this.modifyData(this.tableData)
            })
          })
        })

      }
      else {
        if (this.methodBasedCustomData.enableArgumentType == false && this.methodBasedCustomData.enableReturnType == false) {
          this.configUtilityService.errorMessage("Choose atleast one capturing type");
          return;
        }
        if (this.methodBasedCustomData.enableArgumentType == true && this.argumentTypeData.length == 0) {
          this.configUtilityService.errorMessage("Provide argument type setting(s)");
          return;
        }
        if (this.methodBasedCustomData.enableReturnType == true && this.returnTypeData.length == 0) {
          this.configUtilityService.errorMessage("Provide return type setting(s)");
          return;
        }
        this.configCustomDataService.addMethodBasedCustomData(this.methodBasedCustomData, this.profileId).subscribe(data => {
          // this.tableData.push(data);
          this.tableData = ImmutableArray.push(this.tableData, data);
          this.configUtilityService.successMessage(Messages);
          this.modifyData(this.tableData)
        })
      }
      this.addEditDialog = false;
    }
  }

  /**For close add/edit dialog box */
  closeDialog(): void {
    this.addEditDialog = false;

  }

  openAddReturnRulesDialog() {

    this.addReturnRulesDialog = true;
    this.editReturnRules = false;
    this.returnTypeRules = new ReturnTypeData()
  
    /*calling this function
    * to know data type of return value of provided fqm
    * and creating opertaion list a/c to return type
    */
    let type = this.getTypeReturnType(this.methodBasedCustomData.fqm)
    this.opValList(type)
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
        // case '[':
        //   while (charArr[i++] != ';')
        //     ;
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

  opValList(type) {

    let opList = [];
    if (type == "object/string")
      this.operationList = ConfigUiUtility.createListWithKeyValue(this.arrStringLabel, this.arrStringValue);

    else if (type == "int" || type == "short" || type == "float" || type == "long" || type == "double")
      this.operationList = ConfigUiUtility.createListWithKeyValue(this.arrNumericLabel, this.arrNumericValue)

    else if (type == "byte" || type == "char")
      this.operationList = ConfigUiUtility.createListWithKeyValue(this.arrCharLabel, this.arrCharValue)

    else if (type == "boolean")
      this.operationList = ConfigUiUtility.createListWithKeyValue(this.arrBooleanLabel, this.arrBooleanValue)

  }

//for deleting Return Rules in add form
  deleteReturnRules(): void {
    if (!this.selectedReturnRules || this.selectedReturnRules.length < 1) {
      this.configUtilityService.errorMessage("Select row(s) to delete");
    }
    else{

      let selectedRules = this.selectedReturnRules;
      let arrAppIndex = [];
      for (let index in selectedRules) {
          arrAppIndex.push(selectedRules[index].id);
          if(selectedRules[index].hasOwnProperty('returnTypeId')){
             this.returnRulesDelete.push(selectedRules[index].returnTypeId)
          }
      }
      this.returnTypeData = this.returnTypeData.filter(function(val){
                               return arrAppIndex.indexOf(val.id) == -1 //here if it returns -1 dt row is deleted
                            })
    }
    this.selectedReturnRules = [];
  }

//deletimg Argument rules
  deleteArgumentsRules():void{
     if (!this.selectedArgumentRules || this.selectedArgumentRules.length < 1) {
      this.configUtilityService.errorMessage("Select row(s) to delete");
    }
    else{
      let selectedRules = this.selectedArgumentRules;
      let arrAppIndex = [];
      for (let index in selectedRules) {
          arrAppIndex.push(selectedRules[index].id);
           if(selectedRules[index].hasOwnProperty('argTypeId')){
             this.argumentRulesDelete.push(selectedRules[index].argTypeId)
          }
      }
      this.argumentTypeData = this.argumentTypeData.filter(function(val){
                               return arrAppIndex.indexOf(val.id) == -1 //here if it returns -1 dt row is deleted
                            })
      }
      this.selectedArgumentRules = [];
  }



   /**This method is used to delete Rules from Data Table */
  deleteRulesFromTable(arrRulesIndex: any[]): void {
    //For stores table row index
    let rowIndex: number[] = [];

    for (let index in arrRulesIndex) {
     //rowIndex.push(this.getRulesIndex(arrRulesIndex[index]));
    }
    //this.rulesDataInfo = deleteMany(this.rulesDataInfo, rowIndex);
  }
  // /**This method returns selected Rules row on the basis of selected row */
  // getRulesIndex(appId: any): number {
  //   // for (let i = 0; i < this.rulesDataInfo.length; i++) {
  //   //  if (this.rulesDataInfo[i].valName == appId) {
  //   //     return i;
  //   //   }
  //   // }
  //   // return -1;
  // }

  getTypeName(type){
    let typeName = '';
    if(type == 0)
      typeName = 'STRING'
    else if(type == 1)
      typeName = 'INTEGER'
    else if(type == 2)
      typeName = 'DECIMAL'

    return typeName;
  }

   saveReturnRules() {
     if(this.returnTypeRules.operatorValue == undefined){
      this.returnTypeRules.operatorValue = "-" ;
    }
    if(this.returnTypeRules.operation== 'EXTRACT_SUBPART'){
       this.returnTypeRules.operatorValue = this.returnTypeRules.lb + "-" + this.returnTypeRules.rb ;
    }
    if(!this.isNew){

      /*****************for EDIT form  ********************/

      /*  In edit form,
       *    for edit functionality
       */
      if(this.editReturnRules){
        this.editReturnRules = false

        if(this.returnTypeRules.operation =='CAPTURE'||this.returnTypeRules.operation =='EXCEPTION'||this.returnTypeRules.operation =='EXTRACT_SUBPART'){
            this.returnTypeRules.operatorValue = '-';
        }
        let that = this
        this.returnTypeData.map(function(val){
          if(val.id == that.returnTypeRules.id){
            val.headerName = that.returnTypeRules.headerName;
            val.operation = that.returnTypeRules.operation;
            val.operatorValue = that.returnTypeRules.operatorValue;
            val.typeName = that.getTypeName(that.returnTypeRules.type);
            val.indexVal = that.returnTypeRules.indexVal;
            val.type = that.returnTypeRules.type;
            val.mode = that.returnTypeRules.mode;
            val.headerVal = that.returnTypeRules.headerVal;
            val.lb = that.returnTypeRules.lb;
            val.rb = that.returnTypeRules.rb;
          }
        })
        this.selectedReturnRules = [];
      }
      else{
      
      this.returnTypeRules["id"] = this.returnCounterEdit ;
      this.returnTypeRules["typeName"] = this.getTypeName(this.returnTypeRules.type) ;
      // this.returnTypeData.push(this.returnTypeRules)
      this.returnTypeData=ImmutableArray.push(this.returnTypeData,this.returnTypeRules);      
      this.returnCounterEdit  = this.returnCounterEdit  + 1;
      }
    }

    else{

      /*********** for ADD form *******************/

       /*  In add form,
        *  for edit functionality
        */
     
      if(this.editReturnRules){
        this.editReturnRules = false

        if(this.returnTypeRules.operation =='CAPTURE'||this.returnTypeRules.operation =='EXCEPTION'||this.returnTypeRules.operation =='EXTRACT_SUBPART'){
            this.returnTypeRules.operatorValue = '-';
        }
        let that = this
        this.returnTypeData.map(function(val){
          if(val.id == that.returnTypeRules.id){
            val.headerName = that.returnTypeRules.headerName;
            val.operation = that.returnTypeRules.operation;
            val.operatorValue = that.returnTypeRules.operatorValue;
            val.typeName = that.getTypeName(that.returnTypeRules.type);
            val.indexVal = that.returnTypeRules.indexVal;
            val.type = that.returnTypeRules.type;
            val.mode = that.returnTypeRules.mode;
            val.headerVal = that.returnTypeRules.headerVal;
            val.lb = that.returnTypeRules.lb;
            val.rb = that.returnTypeRules.rb;
          }
        })
        this.selectedReturnRules = [];
      }
      else{

        /* In add form,
        *    for add functinality
        */
      this.returnTypeRules["id"] = this.returnCounter ;
      this.returnTypeRules["typeName"] = this.getTypeName(this.returnTypeRules.type) ;
      // this.returnTypeData.push(this.returnTypeRules);
      this.returnTypeData=ImmutableArray.push(this.returnTypeData,this.returnTypeRules);
      // this.configUtilityService.successMessage(Messages);

      this.returnCounter = this.returnCounter + 1;
      }
    }
     this.addReturnRulesDialog = false;
  }


  saveArgumentRules() {
    if(this.argumentTypeRules.operatorValue == undefined){
      this.argumentTypeRules.operatorValue = "-" ;
    }
     if(this.argumentTypeRules.operationName == 'EXTRACT_SUBPART'){
       this.argumentTypeRules.operatorValue = this.argumentTypeRules.lb + "-" + this.argumentTypeRules.rb ;
    }


    if(!this.isNew){

      /************* For Edit form *************** */
       /* In edit form,
       * edit functionality for argument rules
       */
      if(this.editArgumentRules){
        this.editArgumentRules  = false
        let that = this
        this.argumentTypeData.map(function(val){
          if(val.id == that.argumentTypeRules.id){
            val.headerName = that.argumentTypeRules.headerName
            val.indexVal = that.argumentTypeRules.indexVal
            val.mode  = that.argumentTypeRules.mode
            val.operationName = that.argumentTypeRules.operationName
            val.operatorValue = that.argumentTypeRules.operatorValue
            val.type = that.argumentTypeRules.type
            val.typeName = that.getTypeName(that.argumentTypeRules.type)
            val.headerVal = that.argumentTypeRules.headerVal;
            val.lb = that.argumentTypeRules.lb;
            val.rb = that.argumentTypeRules.rb;
          }
        })
        this.selectedArgumentRules = [];
      }
      else{

       this.argumentTypeRules["id"] = this.argumentCounterEdit ;
       this.argumentTypeRules["typeName"] = this.getTypeName(this.argumentTypeRules.type) ;
       this.argumentTypeData=ImmutableArray.push(this.argumentTypeData,this.argumentTypeRules);
       this.argumentCounterEdit = this.argumentCounterEdit + 1;
      }
      //  this.argumentTypeData.push(this.argumentTypeRules)
    }
    else{

      /**************** for Add form *****************/
      /* In add form,
       * edit functionality for argument rules
       */
      if(this.editArgumentRules){
        this.editArgumentRules  = false
        let that = this
        this.argumentTypeData.map(function(val){
          if(val.id == that.argumentTypeRules.id){
            val.headerName = that.argumentTypeRules.headerName
            val.indexVal = that.argumentTypeRules.indexVal
            val.mode  = that.argumentTypeRules.mode
            val.operationName = that.argumentTypeRules.operationName
            val.operatorValue = that.argumentTypeRules.operatorValue
            val.type = that.argumentTypeRules.type
            val.typeName = that.getTypeName(that.argumentTypeRules.type)
            val.headerVal = that.argumentTypeRules.headerVal;
            val.lb = that.argumentTypeRules.lb;
            val.rb = that.argumentTypeRules.rb;
          }
        })
        this.selectedArgumentRules = [];
      }
      else{
      /* In add form,
       * add functionality for argument rules
       */
        this.argumentTypeRules["id"] = this.argumentCounter ;
        this.argumentTypeRules["typeName"] = this.getTypeName(this.argumentTypeRules.type) ;
        // this.argumentTypeData.push(this.argumentTypeRules)
        this.argumentTypeData=ImmutableArray.push(this.argumentTypeData,this.argumentTypeRules);
        this.argumentCounter = this.argumentCounter + 1;
       }
      }
    this.addArgumentRulesDialog = false;
  }

  openAddArgumentRulesDialog() {
    this.validateArgAndGetArgumentsNumberList();
    this.addArgumentRulesDialog = true;
    this.editArgumentRules = false;
    this.argumentTypeRules = new ArgumentTypeData();
    this.argumentTypeRules.mode = 0;

  }

  operationListArgumentType() {
    let type = this.getTypeArgumentType(this.methodBasedCustomData.fqm, this.argumentTypeRules.indexVal)
    this.opValList(type)
  }

  //for creating list for index i.e arguments number list
    validateArgAndGetArgumentsNumberList() {
    if (this.methodBasedCustomData.fqm == null || this.methodBasedCustomData.fqm == "") {
      this.configUtilityService.errorMessage("Fill out fully qualified method name first");
      this.indexList = [];
      return;
    }
    else {
      let argStart = this.methodBasedCustomData.fqm.indexOf("(");
      let argEnd = this.methodBasedCustomData.fqm.indexOf(")");
      let args = this.methodBasedCustomData.fqm.substring(argStart + 1, argEnd);
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
      this.indexList = [];
      // this.indexList.push({ value: -1, label: '--Select Index--' });
      for (let i = 1; i <= length; i++) {
        this.indexList.push({ 'value': i, 'label': i + '' });
      }
    }
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
              while (charArr[i++] != ';'){
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


  /**This method is used to delete  */
  deleteJavaMethod(): void {
    if (!this.selectedJavaMethod || this.selectedJavaMethod.length < 1) {
      this.configUtilityService.errorMessage("Select row(s) to delete");
      return;
    }
    this.confirmationService.confirm({
      message: 'Do you want to delete the selected row?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        //Get Selected row's id
        let selectedRow = this.selectedJavaMethod;
        let arrIndex = [];
        for (let index in selectedRow) {
          arrIndex.push(selectedRow[index].methodBasedId);
        }
        this.configCustomDataService.deleteJavaMethodData(arrIndex)
          .subscribe(data => {
            this.deleteJavaMethodData(arrIndex);
          })
        this.configUtilityService.infoMessage("Deleted Successfully");
      },
      reject: () => {

      }
    });
  }

  /**This method is used to delete/update data at ui side i.e at real time updation of data */
  deleteJavaMethodData(arrIndex: number[]): void {
    //For stores table row index
    let rowIndex: number[] = [];
    for (let index in arrIndex) {
      rowIndex.push(this.getIndex(arrIndex[index]));
    }
    this.tableData = deleteMany(this.tableData, rowIndex);
    this.selectedJavaMethod = [];
  }

  /**This method returns selected  row on the basis of AppId */
  getIndex(appId: number): number {
    for (let i = 0; i < this.tableData.length; i++) {
      if (this.tableData[i].methodBasedId == appId) {
        return i;
      }
    }
    return -1;
  }

  closeArgumentDialog(): void {
    this.addArgumentRulesDialog = false;
    this.selectedArgumentRules = [];
  }

  closeReturnDialog(): void {
    this.addReturnRulesDialog = false;
    this.selectedReturnRules = [];
  }

  openEditReturnRulesDialog(){

    if (!this.selectedReturnRules || this.selectedReturnRules.length < 1) {
      this.configUtilityService.errorMessage("Select row(s) to edit");
    }
    else if(this.selectedReturnRules.length > 1){
      this.configUtilityService.errorMessage("Select only single row to edit")
    }
    else{
     this.addReturnRulesDialog = true;
     this.editReturnRules = true;
     let selectedRules = this.selectedReturnRules;
    //  this.returnTypeRules= this.selectedReturnRules[0];
    this.returnTypeRules =Object.assign({}, this.selectedReturnRules[0]);

     /*Check to handle list only be created when it is needed i.e 
     * in case of editing parent form ,when user directs go to edit the rules,
     * at that time oplist is not created as that of in add form(parent),
     * so it needs to created.
     *
     */
     if(!this.isNew){
       let type = this.getTypeReturnType(this.methodBasedCustomData.fqm)
       this.opValList(type)
     }   
    }
  }

  openEditArgumentRulesDialog(){
    if (!this.selectedArgumentRules || this.selectedArgumentRules.length < 1) {
      this.configUtilityService.errorMessage("Select row(s) to edit");
    }
    else if(this.selectedArgumentRules.length > 1){
      this.configUtilityService.errorMessage("Select only single row to edit")
    }
    else{
      this.addArgumentRulesDialog = true;
      this.editArgumentRules = true;
      let selectedRules = this.selectedArgumentRules;
      // this.argumentTypeRules = this.selectedArgumentRules[0];
      this.argumentTypeRules =Object.assign({},this.selectedArgumentRules[0]);

      if(!this.isNew){
          this.validateArgAndGetArgumentsNumberList();
      }

      if(!this.isNew){
        this.operationListArgumentType();
      }
    }
  
  }

}
