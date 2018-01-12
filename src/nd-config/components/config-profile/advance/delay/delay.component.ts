import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { SelectItem } from 'primeng/primeng';
import { Keywords } from '../../../../interfaces/keywords';
import { KeywordsInfo } from '../../../../interfaces/keywords-info';
import { KeywordData, KeywordList } from '../../../../containers/keyword-data';
import { ConfigKeywordsService } from '../../../../services/config-keywords.service';
import { ActivatedRoute, Params } from '@angular/router';
import { ConfigUtilityService } from '../../../../services/config-utility.service';
import { cloneObject } from '../../../../utils/config-utility';

@Component({
  selector: 'app-delay',
  templateUrl: './delay.component.html',
  styleUrls: ['./delay.component.css']
})
export class DelayComponent implements OnInit {
  @Output()
  keywordData = new EventEmitter();

  @Input()
  saveDisable: boolean;

  className: string = "DelayComponent";
  keywordsData: Keywords;
  /**These are those keyword which are used in current screen. */
  keywordList = ['putDelayInMethod'];
  /**It stores keyword data for showing in GUI */
  delay: Object;
  delayData: DelayData;
  // enableGroupKeyword: boolean;
  subscription: Subscription;
  // subscriptionEG: Subscription;

  isProfilePerm: boolean;

  constructor(private configKeywordsService: ConfigKeywordsService, private store: Store<KeywordList>, private configUtilityService: ConfigUtilityService, ) {

    this.subscription = this.store.select("keywordData").subscribe(data => {
      var keywordDataVal = {}
      this.keywordList.map(function (key) {
        keywordDataVal[key] = data[key];
      })
      this.delay = keywordDataVal;
      console.log(this.className, "constructor", "this.delay", this.delay);
    });
    // this.subscriptionEG = this.configKeywordsService.keywordGroupProvider$.subscribe(data => this.enableGroupKeyword = data.advance.delay.enable);
    this.configKeywordsService.toggleKeywordData();
  }
  ngOnInit() {
    this.isProfilePerm = +sessionStorage.getItem("ProfileAccess") == 4 ? true : false;
    if (this.saveDisable || this.isProfilePerm)
      this.configUtilityService.infoMessage("Reset and Save are disabled");
    //Calling splitDelayKeywordData method
    this.splitDelayKeywordData();
  }

  /**Value for the keyword putDelayInMethod is
   * 20:33:1:0:0%20system%3BObject
   * 20-from
   * 33-to
   * 1-cpuHoggChk 1-true, 0-false
   * 0-autoInstrumentChk 1-true, 0-false
   * 0-stackTraceChk 1- true, 0-false
   * system;object- fqm, ; is replaced by %3B
   */

  //Method to split the values of [putDelayInMethod] Keyword e.g. 20:33:1:0%20system%3BObject  will be splitted by :, %20 and %3B
  splitDelayKeywordData() {
    console.log("this.delay", this.delay);
    if ((this.delay["putDelayInMethod"].value).includes("%20")) {
      let arr = (this.delay["putDelayInMethod"].value).split("%20")
      this.delayData = new DelayData();
      let fqm = arr[1].split("%3B").join(";");
      this.delayData.fullyQualifiedName = fqm;
      if (arr[0].includes(":")) {
        let arrColon = arr[0].split(":");
        this.delayData.from = arrColon[0];
        this.delayData.to = arrColon[1];
        if (arrColon[2] == "1")
          this.delayData.cpuHoggChk = true;
        else
          this.delayData.cpuHoggChk = false;

        if (arrColon[3] == "1")
          this.delayData.autoInstrumentChk = true;
        else
          this.delayData.autoInstrumentChk = false;
        if(arrColon.length > 3){
          if (arrColon[4] == "1")
             this.delayData.stackTraceChk = true;
          else
            this.delayData.stackTraceChk = false;
        }
      }
    }
    else {
      this.delayData = new DelayData();
      if (this.delay["putDelayInMethod"].value == 0) {
        this.delayData.fullyQualifiedName = "";
        this.delayData.from = "0";
        this.delayData.to = "1";
        this.delayData.cpuHoggChk = false;
        this.delayData.autoInstrumentChk = false;
        this.delayData.stackTraceChk = false;
      }
      else if (this.delay["putDelayInMethod"].value == 1) {
        this.delayData.fullyQualifiedName = "";
        this.delayData.from = "0";
        this.delayData.to = "1";
        this.delayData.cpuHoggChk = false;
        this.delayData.autoInstrumentChk = false;
        this.delayData.stackTraceChk = false;
      }

    }
  }
  saveKeywordData(data) {
    let delayValue = this.delayMethodValue();
    for (let key in this.delay) {
      if (key == 'putDelayInMethod')
        this.delay[key]["value"] = delayValue;
    }
    this.keywordData.emit(this.delay);
  }

  resetKeywordData() {
    this.delay = cloneObject(this.configKeywordsService.keywordData);
    this.splitDelayKeywordData();
  }

  // Method used to construct the value of putDelayInMethod keyword in the form '20:33:1:0%20system%3BObject'.
  delayMethodValue() {
    let fqm = this.delayData.fullyQualifiedName.split(";").join("%3B");
    let delayKeywordVaule = `${this.delayData.from}:${this.delayData.to}:${this.delayData.cpuHoggChk == true ? 1 : 0}:${this.delayData.autoInstrumentChk == true ? 1 : 0}:${this.delayData.stackTraceChk == true ? 1 : 0}%20${fqm}`;
    return delayKeywordVaule;
  }

  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();
    // if (this.subscriptionEG)
    //   this.subscriptionEG.unsubscribe();
  }
  checkFrom(from, to) {
    if (this.delayData.from >= this.delayData.to) {
      from.setCustomValidity('From value must be less than To value.');
    }
    else {
      from.setCustomValidity('');
    }
    to.setCustomValidity('');

  }

  checkTo(from, to) {
    if (this.delayData.from >= this.delayData.to) {
      to.setCustomValidity('To value must be greater than from value.');
    }
    else {
      to.setCustomValidity('');
    }
    from.setCustomValidity('');
  }
}
//Contains putDelayInMethod Keyword variables
class DelayData {
  fullyQualifiedName: string;
  from: string;
  to: string;
  cpuHoggChk: boolean;
  autoInstrumentChk: boolean;
  stackTraceChk: boolean;
}
