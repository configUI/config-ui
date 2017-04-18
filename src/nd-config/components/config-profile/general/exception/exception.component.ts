import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { KeywordData } from '../../../../containers/keyword-data';
import { ConfigKeywordsService } from '../../../../services/config-keywords.service';
import { ConfigUtilityService } from '../../../../services/config-utility.service';
import { ExceptionData } from '../../../../containers/exception-capture-data';

@Component({
  selector: 'app-exception',
  templateUrl: './exception.component.html',
  styleUrls: ['./exception.component.css']
})
export class ExceptionComponent implements OnInit {

  /**This is to send data to parent component(General Screen Component) for save keyword data */
  @Output()
  keywordData = new EventEmitter();

  /**These are those keyword which are used in current screen. */
  keywordList: string[] = ['instrExceptions'];

  selectedValue: string = 'unhandled';

  exception: Object;
  enableGroupKeyword:boolean

  constructor(private configKeywordsService: ConfigKeywordsService,private configUtilityService: ConfigUtilityService) { 
    this.enableGroupKeyword = this.configKeywordsService.keywordGroup.general.exception.enable;
  }

  exceptionData: ExceptionData;

  exceptionForm: boolean = true;

  ngOnInit() {
    this.getKeywordData();
  }


  getKeywordData() {
    let keywordData = this.configKeywordsService.keywordData;
    this.exception = {};

    this.keywordList.forEach((key) => {
      if (keywordData.hasOwnProperty(key)) {
        this.exception[key] = keywordData[key];
      }
    });

    if ((this.exception["instrExceptions"].value).includes("%20")) {
      let arr = (this.exception["instrExceptions"].value).split("%20")
      this.exceptionData = new ExceptionData();

      if(arr[0] === "1")
        this.exceptionData.instrumentException = true;
      else
        this.exceptionData.instrumentException = false;

      if(arr[1] == "1")
        this.exceptionData.exceptionTrace = true;
      else
        this.exceptionData.exceptionTrace = false;
        
      this.exceptionData.exceptionType = arr[2];
      
      if(arr.length > 2)
        this.exceptionData.exceptionTraceDepth = arr[3];
    }
    else
    {
         this.exceptionData = new ExceptionData();
      if(this.exception["instrExceptions"].value == 0)
      {
      this.exceptionData.instrumentException = false;
      this.exceptionData.exceptionTrace = false;
      this.exceptionData.exceptionType = "unhandled"
      }
      else if(this.exception["instrExceptions"].value == 1)
      {
      this.exceptionData.instrumentException = true;
      this.exceptionData.exceptionTrace = false;
      this.exceptionData.exceptionType = "unhandled"
      }

    }
  }
 
  saveKeywordData(data) {
    let instrValue = this.instrExceptionValue(data);
    for(let key in this.exception){
          if(key == 'instrExceptions')
            this.exception[key]["value"] = instrValue;
      }
    this.keywordData.emit(this.exception);
    this.configUtilityService.successMessage("Saved Successfully !!!");

  }

  // Method used to construct the value of instrException keyword.
  instrExceptionValue(data) {
    var instrVal = {};
    if (data.form._value.instrumentException === "false" || data.form._value.instrumentException === false) {
      instrVal = "0";
    }
    else {
      instrVal = "1";

      if (data.form._value.exceptionTrace === "true" || data.form._value.exceptionTrace === true)
        instrVal = instrVal + "%201";
      else
        instrVal = instrVal + "%200";

      if (data.form._value.exceptionType === 'unhandled')
        instrVal = instrVal + "%200";
      else
        instrVal = instrVal + "%201"

      if (data.form._value.exceptionTrace === "true" || data.form._value.exceptionTrace === true)
        instrVal = instrVal + "%20" + data.form._value.exceptionTraceDepth;
    }
    return instrVal;
  }
}
