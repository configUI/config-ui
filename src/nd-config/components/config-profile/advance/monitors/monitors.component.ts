import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { SelectItem } from 'primeng/primeng';
import { Keywords } from '../../../../interfaces/keywords';
import { KeywordsInfo } from '../../../../interfaces/keywords-info';
import { KeywordData, KeywordList } from '../../../../containers/keyword-data';
import { ConfigKeywordsService } from '../../../../services/config-keywords.service';
import { ConfigUtilityService } from '../../../../services/config-utility.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-monitors',
  templateUrl: './monitors.component.html',
  styleUrls: ['./monitors.component.css']
})
export class MonitorsComponent implements OnInit {
  @Output()
  keywordData = new EventEmitter();

  className: string = "MonitorsComponent";
  keywordsData: Keywords;
  /**These are those keyword which are used in current screen. */
  // keywordList: string[] = ['enableBTMonitor'];

  /**It stores keyword data for showing in GUI */
  monitor: Object;
  enableBTMonitorChk: boolean;
  subscription: Subscription;
  enableGroupKeyword: boolean;
  constructor(private configKeywordsService: ConfigKeywordsService,private configUtilityService: ConfigUtilityService, private store: Store<KeywordList>) {

    this.subscription = this.store.select("keywordData").subscribe(data => {
      this.monitor = data;
      this.enableBTMonitorChk = this.monitor["enableBTMonitor"].value == 0 ? false : true;
      console.log(this.className, "constructor", "this.debug", this.monitor);
      this.enableGroupKeyword = this.configKeywordsService.keywordGroup.advance.monitors.enable;
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
    this.configUtilityService.successMessage("Saved Successfully !!!");
  }

  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();
  }
  ngOnInit() {
  }

}
