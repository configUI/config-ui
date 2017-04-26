import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { KeywordData } from '../../../../containers/keyword-data';
import { ConfigKeywordsService } from '../../../../services/config-keywords.service';
import { ConfigUtilityService } from '../../../../services/config-utility.service';
import { ExceptionData } from '../../../../containers/exception-capture-data';
import { cloneObject } from '../../../../utils/config-utility';

@Component({
  selector: 'app-exception',
  templateUrl: './exception.component.html',
  styleUrls: ['./exception.component.css']
})
export class ExceptionComponent implements OnInit {

  @Input()
  saveDisable: boolean;

  /**This is to send data to parent component(General Screen Component) for save keyword data */
  @Output()
  keywordData = new EventEmitter();

  /**These are those keyword which are used in current screen. */
  keywordList: string[] = ['instrExceptions'];

  selectedValue: string = 'unhandled';

  exception: Object;
  enableGroupKeyword: boolean

  constructor(private configKeywordsService: ConfigKeywordsService, private configUtilityService: ConfigUtilityService) {
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

      if (arr[0] === "1")
        this.exceptionData.instrumentException = true;
      else
        this.exceptionData.instrumentException = false;

      if (arr[1] === "1")
        this.exceptionData.exceptionTrace = true;
      else
        this.exceptionData.exceptionTrace = false;

      this.exceptionData.exceptionType = arr[2] == 0 ? false : true;
      if (arr.length > 3)
        this.exceptionData.exceptionTraceDepth = arr[3];
      else
        this.exceptionData.exceptionTraceDepth = 999;
    }
    else {
      this.exceptionData = new ExceptionData();
      if (this.exception["instrExceptions"].value == 0) {
        this.exceptionData.instrumentException = false;
        this.exceptionData.exceptionTrace = false;
        this.exceptionData.exceptionType = false;
        this.exceptionData.exceptionTraceDepth = 999;
      }
      else if (this.exception["instrExceptions"].value == 1) {
        this.exceptionData.instrumentException = false;
        this.exceptionData.exceptionTrace = false;
        this.exceptionData.exceptionType = false;
        this.exceptionData.exceptionTraceDepth = 999;
      }
    }
  }

  saveKeywordData(data) {
    let instrValue = this.instrExceptionValue(data);
    // if(this.exceptionData.exceptionTrace == false)
    //   this.exceptionData.exceptionTraceDepth = 999;
    for (let key in this.exception) {
      if (key == 'instrExceptions')
        this.exception[key]["value"] = instrValue;
    }
    this.keywordData.emit(this.exception);

  }

  resetKeywordData() {
    this.exception = cloneObject(this.configKeywordsService.keywordData);
    this.getKeywordData();
  }

  /**Value for this keyword is
   * 1%201%200%2012
   * 1-  Enable instrumentException
   * 1- enable exceptionTrace
   * 0- false 3- true //for capture Exception type
   * 12- Trace limit for frames //dependent on 2nd value
   */

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

      if (data.form._value.exceptionType === false || data.form._value.exceptionType === "false")
        instrVal = instrVal + "%200";
      else
        instrVal = instrVal + "%203"

      if (data.form._value.exceptionTrace === "true" || data.form._value.exceptionTrace === true)
        instrVal = instrVal + "%20" + data.form._value.exceptionTraceDepth;
    }
    return instrVal;
  }
}