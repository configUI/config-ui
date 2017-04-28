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
  selector: 'app-backend-monitors',
  templateUrl: './backend-monitors.component.html',
  styleUrls: ['./backend-monitors.component.css']
})
export class BackendMonitorsComponent implements OnInit {
  @Output()
  keywordData = new EventEmitter();
  @Input()
  saveDisable: boolean;

  className: string = "BackendMonitorsComponent";
  keywordsData: Keywords;
  /**These are those keyword which are used in current screen. */
  keywordList = ['enableBackendMonitor'];

  /**It stores keyword data for showing in GUI */
  backend: Object;
  enableBackendMonitorChk: boolean;
  subscription: Subscription;
  subscriptionEG: Subscription;

  enableGroupKeyword: boolean;
  constructor(private configKeywordsService: ConfigKeywordsService, private configUtilityService: ConfigUtilityService, private store: Store<KeywordList>) {

    this.subscription = this.store.select("keywordData").subscribe(data => {
      var keywordDataVal = {}
      this.keywordList.map(function (key) {
        keywordDataVal[key] = data[key];
      })
      this.backend = keywordDataVal;
      this.enableBackendMonitorChk = this.backend["enableBackendMonitor"].value == 0 ? false : true;
      console.log(this.className, "constructor", "this.backend", this.backend);
    });
    this.subscriptionEG = this.configKeywordsService.keywordGroupProvider$.subscribe(data => this.enableGroupKeyword = data.advance.backend_monitors.enable);
  }
  saveKeywordData() {
    if (this.enableBackendMonitorChk) {
      this.backend["enableBackendMonitor"].value = 1;
    }
    else {
      this.backend["enableBackendMonitor"].value = 0;
    }
    this.keywordData.emit(this.backend);
  }

  resetKeywordData() {
    this.backend = cloneObject(this.configKeywordsService.keywordData);
    this.enableBackendMonitorChk = this.backend["enableBackendMonitor"].value == 0 ? false : true;
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
