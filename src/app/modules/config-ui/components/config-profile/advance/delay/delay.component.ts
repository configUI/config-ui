import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { SelectItem } from 'primeng/primeng';
import { Keywords } from '../../../../interfaces/keywords';
import { KeywordsInfo } from '../../../../interfaces/keywords-info';
import { KeywordData, KeywordList } from '../../../../containers/keyword-data';
import { ConfigKeywordsService } from '../../../../services/config-keywords.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-delay',
  templateUrl: './delay.component.html',
  styleUrls: ['./delay.component.css']
})
export class DelayComponent implements OnInit {
  @Output()
  keywordData = new EventEmitter();

  className: string = "DelayComponent";
  keywordsData: Keywords;
  /**These are those keyword which are used in current screen. */
  keywordList: string[] = ['putDelayInMethod'];
  /**It stores keyword data for showing in GUI */
  delay: Object;
  delayData: DelayData;

  subscription: Subscription;
  constructor(private configKeywordsService: ConfigKeywordsService,private store: Store<KeywordList>) { 
     this.subscription = this.store.select("keywordData").subscribe(data => {
      this.delay = data;
      console.log(this.className, "constructor", "this.delay", this.delay);
    });
  }
  ngOnInit() {
    //Calling splitDelayKeywordData method
    this.splitDelayKeywordData();
  }

  //Method to split the values of Keyword 
  splitDelayKeywordData()
  {
    console.log("this.delay", this.delay);
    if ((this.delay["putDelayInMethod"].value).includes("%20")) {
      let arr = (this.delay["putDelayInMethod"].value).split("%20")
      this.delayData = new DelayData();
      let fqm=  arr[1].split("%3B").join(";");
      this.delayData.fullyQaulifiedName = fqm;
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
        this.delayData.fullyQaulifiedName = "";
        this.delayData.from = "0";
        this.delayData.to = "1";
        this.delayData.cpuHoggChk = false;
        this.delayData.autoInstrumentChk = false;
      }
      else if (this.delay["putDelayInMethod"].value == 1) {
        this.delayData.fullyQaulifiedName = "";
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
  // Method used to construct the value of putDelayInMethod keyword.
  delayMethodValue() {
    let fqm=this.delayData.fullyQaulifiedName.split(";").join("%3B");
    let delayKeywordVaule = `${this.delayData.from}:${this.delayData.to}:${this.delayData.cpuHoggChk == true ? 1 : 0}:${this.delayData.autoInstrumentChk == true ? 1 : 0 }%20${fqm}`;
    return delayKeywordVaule;
  }

  ngOnDestroy() {

  }
}
class DelayData {
  fullyQaulifiedName: string;
  from: string;
  to: string;
  cpuHoggChk: boolean;
  autoInstrumentChk: boolean;
}
