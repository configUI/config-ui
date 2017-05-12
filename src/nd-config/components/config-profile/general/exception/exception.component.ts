import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
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
  keywordList: string[] = ['instrExceptions', 'enableExceptionInSeqBlob'];
  subscriptionEG: Subscription;
  // selectedValue: string = 'unhandled';

  exception: Object;
  enableGroupKeyword: boolean;

  constructor(private configKeywordsService: ConfigKeywordsService, private configUtilityService: ConfigUtilityService) {
    this.getKeywordData();
    this.exception["enableExceptionInSeqBlob"].value = this.exception["enableExceptionInSeqBlob"].value == 0 ? false : true;
    this.subscriptionEG = this.configKeywordsService.keywordGroupProvider$.subscribe(data => this.enableGroupKeyword = data.general.exception.enable);
    this.configKeywordsService.toggleKeywordData();
  }

  exceptionData: ExceptionData;

  exceptionForm: boolean = true;

  ngOnInit() {

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

      if (arr[0] === "1") {
        this.exceptionData.instrumentException = true;
        this.exceptionData.exceptionCapturing = "1";
      }
      else if (arr[0] === "2") {
        this.exceptionData.instrumentException = true;
        this.exceptionData.exceptionCapturing = "2";
      }
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
        this.exceptionData.exceptionCapturing = "1";
        this.exceptionData.exceptionTrace = false;
        this.exceptionData.exceptionType = false;
        this.exceptionData.exceptionTraceDepth = 999;
      }
      else if (this.exception["instrExceptions"].value == 1) {
        this.exceptionData.instrumentException = false;
        this.exceptionData.exceptionCapturing = "1";
        this.exceptionData.exceptionTrace = false;
        this.exceptionData.exceptionType = false;
        this.exceptionData.exceptionTraceDepth = 999;
      }
    }
  }

  saveKeywordData(data) {
    let instrValue = this.instrExceptionValue(data);
    for (let key in this.exception) {
      if (key == 'instrExceptions')
        this.exception[key]["value"] = instrValue;
    }
    this.exception["enableExceptionInSeqBlob"].value = this.exception["enableExceptionInSeqBlob"].value == true ? 1 : 0;
    this.keywordData.emit(this.exception);

  }

  resetKeywordData() {
    this.exception = cloneObject(this.configKeywordsService.keywordData);
    this.getKeywordData();
  }

  /**Value for this keyword is
   * 1%201%200%2012
   * 1-  Enable instrumentException // It can be 1 or 2 [1- complete exceotion 2-L1 fp capturing]
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
      if (this.exceptionData.exceptionCapturing == "1")
        instrVal = "1";

      if (this.exceptionData.exceptionCapturing == "2")
        instrVal = "2";

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
