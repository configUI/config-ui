import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { KeywordData, KeywordList } from '../../../../../containers/keyword-data';
import { ConfigKeywordsService } from '../../../../../services/config-keywords.service';
import { ConfigUtilityService } from '../../../../../services/config-utility.service';
import { ExceptionData } from '../../../../../containers/exception-capture-data';
import { cloneObject } from '../../../../../utils/config-utility';
import { ConfigurationComponent } from '../../../configuration/configuration.component';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-exception-setting',
  templateUrl: './exception-setting.component.html',
  styleUrls: ['./exception-setting.component.css']
})
export class ExceptionSettingComponent implements OnInit {

  @Input()
  data;
  profileId: number;
  index: number = 0;
  saveDisable: boolean;

  /**This is to send data to parent component(General Screen Component) for save keyword data */
  @Output()
  keywordData = new EventEmitter();
  exception: Object;
  /**These are those keyword which are used in current screen. */
  keywordList: string[] = ['instrExceptions', 'enableExceptionsWithSourceAndVars'];
  subscriptionEG: Subscription;
  // selectedValue: string = 'unhandled';
  enableGroupKeyword: boolean;
  keywordValue: Object;

  constructor(private configKeywordsService: ConfigKeywordsService, private route: ActivatedRoute, private configUtilityService: ConfigUtilityService, private store: Store<KeywordList>) {
    this.getKeywordData();
    configKeywordsService.toggleKeywordData();
  }

  exceptionData: ExceptionData;
  subscription: Subscription;
  exceptionForm: boolean = true;

  ngOnInit() {
<<<<<<< HEAD

    if(this.exception["enableExceptionInSeqBlob"].value == "0")
      {
        this.exception["enableExceptionInSeqBlob"].value = false;
      }
=======
>>>>>>> beb3066794cdbb18e111544b129c9dee5ec6eabc
    this.route.params.subscribe((params: Params) => {
      this.profileId = params['profileId'];
      this.saveDisable = this.profileId == 1 ? true : false;
      this.index = params['tabId'];
    });

  }

  /*This method is used to save the keyword data in backend */
  saveKeywordData(data) {
    let instrValue = this.instrExceptionValue(data);
    for (let key in this.exception) {
      if (key == 'instrExceptions')
        this.exception[key]["value"] = instrValue;
    }
    this.keywordData.emit(this.exception);
    sessionStorage.setItem("exceptionCapturing", String(this.exceptionData.instrumentException));
    sessionStorage.setItem("exceptionCapturingAdvanceSetting", String(this.exception["enableExceptionsWithSourceAndVars"].value));

  }
  /* This method is used to reset the keyword data */
  resetKeywordData() {
    this.getKeywordData();
    this.exception = cloneObject(this.configKeywordsService.keywordData);
  }

  /* This method is used to get the existing keyword data from the backend */
  getKeywordData() {
    // let keywordData = this.configKeywordsService.keywordData;
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
    this.exception = {};

    this.keywordList.forEach((key) => {
      if (this.keywordValue.hasOwnProperty(key)) {
        this.exception[key] = this.keywordValue[key];
      }
    });

    if ((this.exception["instrExceptions"].value).includes("%20")) {
      let arr = (this.exception["instrExceptions"].value).split("%20")
      this.exceptionData = new ExceptionData();
      if (arr[0] === "1" && arr[2] === "0") {
        this.exceptionData.instrumentException = true;
        this.exceptionData.exceptionCapturing = false;
        this.exceptionData.exceptionType = false;
      }
      else if (arr[0] === "1" && arr[2] === "3") {
        this.exceptionData.instrumentException = true;
        this.exceptionData.exceptionCapturing = false;
        this.exceptionData.exceptionType = true;
      }
      else if (arr[0] === "2" && arr[2] === "0" ) {
        this.exceptionData.instrumentException = true;
        this.exceptionData.exceptionCapturing = true;
        this.exceptionData.exceptionType = false;
      }
      else if (arr[0] === "2" && arr[2] === "3" ) {
        this.exceptionData.instrumentException = true;
        this.exceptionData.exceptionCapturing = true;
        this.exceptionData.exceptionType = true;
      }
      else
        this.exceptionData.instrumentException = false;

      if (arr.length > 3)
        this.exceptionData.exceptionTraceDepth = arr[3];
      else
        this.exceptionData.exceptionTraceDepth = 9999;
    }
    else {
      this.exceptionData = new ExceptionData();
<<<<<<< HEAD
=======
      if (this.exception["instrExceptions"].value == 0) {
        this.exceptionData.instrumentException = false;
        this.exceptionData.exceptionCapturing = false;
        this.exceptionData.exceptionTrace = false;
        this.exceptionData.exceptionType = false;
        this.exceptionData.exceptionTraceDepth = 9999;
      }
      else if (this.exception["instrExceptions"].value == 1) {
>>>>>>> beb3066794cdbb18e111544b129c9dee5ec6eabc
        this.exceptionData.instrumentException = false;
        this.exceptionData.exceptionCapturing = false;
        this.exceptionData.exceptionTrace = false;
        this.exceptionData.exceptionType = false;
        this.exceptionData.exceptionTraceDepth = 9999;
<<<<<<< HEAD
=======
      }
>>>>>>> beb3066794cdbb18e111544b129c9dee5ec6eabc
    }
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
      if (this.exceptionData.exceptionCapturing == false)
        instrVal = "1";

      if (this.exceptionData.exceptionCapturing == true)
        instrVal = "2";

      if (data.form._value.exceptionTraceDepth != null || data.form._value.exceptionTraceDepth != undefined)
        instrVal = instrVal + "%201";
      else
        instrVal = instrVal + "%200";


      if (this.exceptionData.exceptionType == false)
        instrVal = instrVal + "%200";
      else
        instrVal = instrVal + "%203"

      // if (data.form._value.exceptionTrace === "true" || data.form._value.exceptionTrace === true)
      instrVal = instrVal + "%20" + data.form._value.exceptionTraceDepth;
    }
    return instrVal;
  }

  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();
    if (this.subscriptionEG)
      this.subscriptionEG.unsubscribe();
  }

}
