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

  className: string = "DebugComponent";
  keywordsData: Keywords;
  /**These are those keyword which are used in current screen. */
  // keywordList: string[] = ['enableBciDebug', 'enableBciError', 'InstrTraceLevel', 'ndMethodMonTraceLevel'];

  /**It stores keyword data for showing in GUI */
  delay: Object;

  subscription: Subscription;
 constructor(private configKeywordsService: ConfigKeywordsService, private store: Store<KeywordList>) {

    this.subscription = this.store.select("keywordData").subscribe(data => {
      this.delay = data;
      console.log(this.className, "constructor", "this.delay", this.delay);
    });
  }

  ngOnInit() {
  }
 saveKeywordData() {
    this.keywordData.emit(this.delay);
  }
  
  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();
  }
}
