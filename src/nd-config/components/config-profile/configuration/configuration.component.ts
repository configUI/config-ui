import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';

import { ConfigKeywordsService } from '../../../services/config-keywords.service';
import { KeywordData, KeywordList } from '../../../containers/keyword-data';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements OnInit, OnDestroy {
  keywordGroup: any;
  profileId: number;
  toggleDisable: boolean = false;

  subscription: Subscription;
  subscriptionKeywordGroup: Subscription;

  constructor(private route: ActivatedRoute, private configKeywordsService: ConfigKeywordsService, private store: Store<KeywordList>) {
      //Initialize groupkeyword values
      this.keywordGroup = this.configKeywordsService.keywordGroup;
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.profileId = params['profileId']
      this.toggleDisable = this.profileId == 1 ? true : false;
    });
    this.loadKeywordData();
  }

  loadKeywordData() {
    this.configKeywordsService.getProfileKeywords(this.profileId);

    //Getting whole keyword data values
    this.subscription = this.store.select<KeywordData>("keywordData")
      .subscribe(data => {
        if (data){
          this.configKeywordsService.toggleKeywordData();
          this.subscriptionKeywordGroup = this.configKeywordsService.keywordGroupProvider$.subscribe(data => this.keywordGroup = data );
        }

      });
  }

  /**This is used to enable/disable groupkeyword values. */
  change(selectedKeywordGroup) {
    for (let moduleName in this.keywordGroup) {
      let keywordGroupList = this.keywordGroup[moduleName];

      //keywordKey -> flowpath, hotspot...
      for (let keywordKey in keywordGroupList) {

        //Checking selected keywordGroup string with stored groupkeyword list key
        if (selectedKeywordGroup == keywordKey) {

          let keywordList = keywordGroupList[keywordKey].keywordList;

          for (let i = 0; i < keywordList.length; i++) {
            //When toggle moving for disable
            if (keywordGroupList[keywordKey].enable) {
              //Setting 0 value for disable keyword
              this.configKeywordsService.keywordData[keywordList[i]].value = "0";
            }
            else {
              //Setting Default value for enable keyword
              this.configKeywordsService.keywordData[keywordList[i]].value = this.configKeywordsService.keywordData[keywordList[i]].defaultValue;
            }
          }
        }
      }
    }
    //saving keyword values
    this.configKeywordsService.saveProfileKeywords(this.profileId);
  }

  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();
  }
}
