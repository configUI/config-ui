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
  enableGroupKeyword: boolean;
  subscription: Subscription;
  subscriptionEG: Subscription;

  constructor(private configKeywordsService: ConfigKeywordsService, private store: Store<KeywordList>, private configUtilityService: ConfigUtilityService, ) {

    this.subscription = this.store.select("keywordData").subscribe(data => {
      var keywordDataVal = {}
      this.keywordList.map(function (key) {
        keywordDataVal[key] = data[key];
      })
      this.delay = keywordDataVal;
      console.log(this.className, "constructor", "this.delay", this.delay);
    });
    this.subscriptionEG = this.configKeywordsService.keywordGroupProvider$.subscribe(data => this.enableGroupKeyword = data.advance.delay.enable);

  }
  ngOnInit() {
    //Calling splitDelayKeywordData method
    this.splitDelayKeywordData();
  }

  /**Value for the keyword putDelayInMethod is
   * 20:33:1:0%20system%3BObject
   * 20-from
   * 33-to
   * 1-cpuHoggChk 1-true, 0-false
   * 0-autoInstrumentChk 1-true, 0-false
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
      }
      else if (this.delay["putDelayInMethod"].value == 1) {
        this.delayData.fullyQualifiedName = "";
        this.delayData.from = "0";
        this.delayData.to = "1";
        this.delayData.cpuHoggChk = false;
        this.delayData.autoInstrumentChk = false;
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
    let delayKeywordVaule = `${this.delayData.from}:${this.delayData.to}:${this.delayData.cpuHoggChk == true ? 1 : 0}:${this.delayData.autoInstrumentChk == true ? 1 : 0}%20${fqm}`;
    return delayKeywordVaule;
  }

  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();
    if (this.subscriptionEG)
      this.subscriptionEG.unsubscribe();
  }
}
//Contains putDelayInMethod Keyword variables
class DelayData {
  fullyQualifiedName: string;
  from: string;
  to: string;
  cpuHoggChk: boolean;
  autoInstrumentChk: boolean;
}
