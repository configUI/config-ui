import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { SelectItem } from 'primeng/primeng';
import { Keywords } from '../../../../interfaces/keywords';
import { KeywordsInfo } from '../../../../interfaces/keywords-info';
import { KeywordData, KeywordList } from '../../../../containers/keyword-data';
import { ConfigKeywordsService } from '../../../../services/config-keywords.service';
import { ConfigUtilityService } from '../../../../services/config-utility.service';
import { ActivatedRoute, Params } from '@angular/router';
import { cloneObject } from '../../../../utils/config-utility';

@Component({
  selector: 'app-monitors',
  templateUrl: './monitors.component.html',
  styleUrls: ['./monitors.component.css']
})
export class MonitorsComponent implements OnInit {
  @Output()
  keywordData = new EventEmitter();

  @Input()
  saveDisable:boolean;

  className: string = "MonitorsComponent";
  keywordsData: Keywords;
  /**These are those keyword which are used in current screen. */
  keywordList = ['enableBTMonitor'];

  /**It stores keyword data for showing in GUI */
  monitor: Object;
  enableBTMonitorChk: boolean;
  subscription: Subscription;
  subscriptionEG: Subscription;
  enableGroupKeyword: boolean;
  constructor(private configKeywordsService: ConfigKeywordsService, private configUtilityService: ConfigUtilityService, private store: Store<KeywordList>) {

    this.subscription = this.store.select("keywordData").subscribe(data => {
       var keywordDataVal = {}
      this.keywordList.map(function (key) {
        keywordDataVal[key] = data[key];
      })
      this.monitor = keywordDataVal;
      this.enableBTMonitorChk = this.monitor["enableBTMonitor"].value == 0 ? false : true;
      console.log(this.className, "constructor", "this.debug", this.monitor);
      this.subscriptionEG = this.configKeywordsService.keywordGroupProvider$.subscribe(data => this.enableGroupKeyword = data.advance.monitors.enable);
    });
  }
  saveKeywordData() {
    if (this.enableBTMonitorChk) {
      this.monitor["enableBTMonitor"].value = 1;
    }
    else {
      this.monitor["enableBTMonitor"].value = 0;
    }
    this.keywordData.emit(this.monitor);
  }

  resetKeywordData() {
    this.monitor = cloneObject(this.configKeywordsService.keywordData);
    this.enableBTMonitorChk = this.monitor["enableBTMonitor"].value == 0 ? false : true;

  }

  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();
      if (this.subscriptionEG)
      this.subscriptionEG.unsubscribe();
  }
  ngOnInit() {
  }

}
