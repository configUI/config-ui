import { Component, OnInit } from '@angular/core';
import { ConfigCustomDataService } from '../../../../../../services/config-customdata.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { SelectItem, ConfirmationService } from 'primeng/primeng';
import { ConfigUiUtility } from '../../../../../../utils/config-utility';
import { ConfigUtilityService } from '../../../../../../services/config-utility.service';
import {MethodBasedCustomData,ReturnTypeData,ArgumentTypeData} from '../../../../../../containers/method-based-custom-data';


@Component({
  selector: 'app-java-method',
  templateUrl: './java-method.component.html',
  styleUrls: ['./java-method.component.css']
})
export class JavaMethodComponent implements OnInit {


  subscription: Subscription;

/* hold the data that needs to be displayed in table */
  tableData:MethodBasedCustomData[];

  /**For add/edit form flag */
  isNew: boolean = false;

  /**For open/close add/edit dialog */
  addEditDialog: boolean = false;


   /**It stores selected data for edit or add functionality */
  methodBasedCustomData: MethodBasedCustomData;

  /** for holding form fields */
  returnTypeRules: ReturnTypeData;
  argumentTypeRules:ArgumentTypeData;

  addReturnRulesDialog:boolean=false;

  addArgumentRulesDialog:boolean= false;

  customValTypeList:SelectItem[];


  /* store operation list */
  operationList:SelectItem[];

  /* to hold data to display in table of return type and argument type in table */
  returnTypeData:ReturnTypeData[];
  argumentTypeData:ArgumentTypeData[];

  arrStringLabel:any[]= ['CAPTURE','EXTRACT_SUBPART','INVOCATION','EQUALS','NOT_EQUALS','CONTAINS','STARTS_WITH','ENDS_WITH','EXCEPTION'];
  arrStringValue:any[] = ['CAPTURE','EXTRACT_SUBPART','INVOCATION','EQUALS','NOT_EQUALS','CONTAINS','STARTS_WITH','ENDS_WITH','EXCEPTION'];


  arrNumericLabel:any[] = ['CAPTURE','INVOCATION','EXCEPTION','EQ','NE','LT','GT','LE','GE'];
  arrNumericValue:any[] = ['CAPTURE','INVOCATION','EXCEPTION','EQ','NE','LT','GT','LE','GE'];

  arrCharLabel:any[] = ['CAPTURE','INVOCATION','EXCEPTION','EQ','NE'];
  arrCharValue :any[] =  ['CAPTURE','INVOCATION','EXCEPTION','EQ','NE'];

  arrBooleanLabel:any[] = ['CAPTURE','INVOCATION','EXCEPTION'];
  arrBooleanValue:any[] = ['CAPTURE','INVOCATION','EXCEPTION'];

  //receiving data from store
  constructor(private route: ActivatedRoute,private configUtilityService: ConfigUtilityService, private configCustomDataService: ConfigCustomDataService,private store: Store<Object>) { 
      this.subscription = this.store.select("customData").subscribe(data=>{
     // this.tableData = data;
    })

      this.returnTypeData = [];
      this.argumentTypeData = [];
   
  }
   profileId: number;


  ngOnInit() {
    this.loadJavaMethodBasedCustomData()
  }

  loadJavaMethodBasedCustomData(){
    this.route.params.subscribe((params: Params) => this.profileId = params['profileId'] );
    this.configCustomDataService.getMethodBasedCustomData(this.profileId).subscribe(data =>{this.modifyData(data)
  })
    let arrLabel = ['STRING', 'INTEGER', 'DECIMAL'];
    let arrValue = ['0', '1', '2'];
    this.customValTypeList =ConfigUiUtility.createListWithKeyValue(arrLabel, arrValue);
  }


  /* these functions are used in order to form the data as per requiremet of data to be
  *  is table screen i,e.
  * adding an extra key -value pair in each object.
  *  returnTypeValue = "aa,bb",
  *  argumentTypeValue = "bb,cc"
  *
  *
  */

  modifyData(data){
    let that = this;
    data.map(function(val){

      if(val.returnTypeData != null && val.returnTypeData.length != 0){
          let hdrNames = that.getHdrNames(val.returnTypeData);
          val.returnTypeValue = hdrNames
      }
      else{
         val.returnTypeValue = "NA"
      } 
      
      if(val.argumentTypeData != null && val.argumentTypeData.length != 0){
          let hdrNames = that.getHdrNames(val.argumentTypeData);
          val.argumentTypeValue = hdrNames
      }
      else{
         val.argumentTypeValue = "NA"
      } 
    })
      this.tableData = data
  }


   getHdrNames(data){
     let hdrNamesHref ='';
     data.map(function(val,index){
      if(index != (data.length -1)){
          hdrNamesHref = hdrNamesHref + val.headerName +"," ;
      }
      else {
        hdrNamesHref = hdrNamesHref + val.headerName
      }
    })
    return hdrNamesHref ;
  }


  openAddDialog(){
    this.methodBasedCustomData = new MethodBasedCustomData();
    this.isNew = true;
    this.addEditDialog = true;
  }

  saveEditData(){
    this.methodBasedCustomData.argumentTypeData = this.argumentTypeData;
    this.methodBasedCustomData.returnTypeData = this.returnTypeData;
    console.log("data---",this.methodBasedCustomData)
    this.addEditDialog = false;
    this.configCustomDataService.addMethodBasedCustomData(this.methodBasedCustomData,this.profileId).subscribe(data =>{
        this.tableData.push(data);
        this.modifyData(this.tableData)
    })
    this.configUtilityService.successMessage("Saved Successfully !!!");

  }

   /**For close add/edit dialog box */
  closeDialog(): void {
    this.addEditDialog = false;
  }

  openAddReturnRulesDialog(){
    this.addReturnRulesDialog = true;
    this.returnTypeRules = new ReturnTypeData()
    console.log("openAddReturnRulesDialog method called--",this.methodBasedCustomData.fqm)
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

  opValList(type){

  let arrStringLabel = ['CAPTURE','EXTRACT_SUBPART','INVOCATION','EQUALS','NOT_EQUALS','CONTAINS','STARTS_WITH','ENDS_WITH','EXCEPTION'];
  let arrStringValue = ['CAPTURE','EXTRACT_SUBPART','INVOCATION','EQUALS','NOT_EQUALS','CONTAINS','STARTS_WITH','ENDS_WITH','EXCEPTION']
    let opList =[];
    if(type == "object/string")
       this.operationList = ConfigUiUtility.createListWithKeyValue(this.arrStringLabel,this.arrStringValue) ;

    else if(type == "int" || type == "short"|| type == "float"|| type == "long"|| type == "double" )
       this.operationList = ConfigUiUtility.createListWithKeyValue(this.arrNumericLabel,this.arrNumericValue) 

     else if(type == "byte" || type == "char")
        this.operationList = ConfigUiUtility.createListWithKeyValue(this.arrCharLabel,this.arrCharValue) 

    else if(type == "boolean" )
         this.operationList = ConfigUiUtility.createListWithKeyValue(this.arrBooleanLabel,this.arrBooleanValue) 

}


  deleteReturnRules(){

  }

  saveReturnRules(){
    console.log("saveReturnRules method caleld--",this.returnTypeRules)
    this.returnTypeData.push(this.returnTypeRules);
    this.addReturnRulesDialog=false;
    this.configUtilityService.successMessage("Saved Successfully !!!");

  }

  saveArgumentRules(){
    console.log("saveReturnRules method caleld--",this.argumentTypeRules)
    this.argumentTypeData.push(this.argumentTypeRules)
    this.addArgumentRulesDialog = false;
    this.configUtilityService.successMessage("Saved Successfully !!!");

  }

  openAddArgumentRulesDialog(){
    this.addArgumentRulesDialog = true;
    this.argumentTypeRules = new ArgumentTypeData();
  }

  operationListArgumentType(){
    console.log("evt",this.argumentTypeRules.indexVal)
    let type = this.getTypeArgumentType(this.methodBasedCustomData.fqm,this.argumentTypeRules.indexVal)
    this.opValList(type)
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

}
