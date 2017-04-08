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
  // keywordList: string[] = ['enableBciDebug', 'enableBciError', 'InstrTraceLevel', 'ndMethodMonTraceLevel'];

  /**It stores keyword data for showing in GUI */
  monitor: Object;

  subscription: Subscription;
  constructor(private configKeywordsService: ConfigKeywordsService, private store: Store<KeywordList>) {

    this.subscription = this.store.select("keywordData").subscribe(data => {
      this.monitor = data;
      console.log(this.className, "constructor", "this.debug", this.monitor);
    });
  }
saveKeywordData() {
    this.keywordData.emit(this.monitor);
  }
  
  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();
  }
  ngOnInit() {
  }

}
