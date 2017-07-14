import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { KeywordData, KeywordList } from '../../../../containers/keyword-data';
import { ConfigKeywordsService } from '../../../../services/config-keywords.service';
import { ConfigUtilityService } from '../../../../services/config-utility.service';
import { ExceptionData } from '../../../../containers/exception-capture-data';
import { cloneObject } from '../../../../utils/config-utility';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-exception',
  templateUrl: './exception.component.html',
  styleUrls: ['./exception.component.css']
})
export class ExceptionComponent implements OnInit {

  @Input()
  profileId: number;
  saveDisable: boolean;
  index: number = 1;

  /**This is to send data to parent component(General Screen Component) for save keyword data */
  @Output()
  keywordData = new EventEmitter();

  /**These are those keyword which are used in current screen. */
  keywordList: string[] = ['instrExceptions', 'enableExceptionInSeqBlob', 'enableExceptionsWithSourceAndVars'];
  subscriptionEG: Subscription;
  // selectedValue: string = 'unhandled';

  exception: Object;
  enableGroupKeyword: boolean;
  keywordValue: Object;

  constructor(private configKeywordsService: ConfigKeywordsService,private route: ActivatedRoute, private configUtilityService: ConfigUtilityService, private store: Store<KeywordList>) {
    this.subscriptionEG = this.configKeywordsService.keywordGroupProvider$.subscribe(data => this.enableGroupKeyword = data.general.exception.enable);
    this.configKeywordsService.toggleKeywordData();
  }

  exceptionData: ExceptionData;
  subscription: Subscription;
  exceptionForm: boolean = true;

  ngOnInit() {

       this.route.params.subscribe((params: Params) => {
      this.profileId = params['profileId'];
      this.saveDisable = this.profileId == 1 ? true : false;
      this.index = params['tabId']
    });

    this.loadKeywordData();

  }
  handleChange(e) {
    this.index = e.index;
  }

    /**This method is used to when keyword data object doesn't exists any key value then we will get keyword data from server */
  loadKeywordData() {
    if (!this.configKeywordsService.keywordData){
      this.configKeywordsService.getProfileKeywords(this.profileId);
      // this.configKeywordsService.toggleKeywordData();
    }
  }


    saveKeywordData(keywordData) {
    for(let key in keywordData){
      this.configKeywordsService.keywordData[key] = keywordData[key];
      this.configKeywordsService.keywordData[key].enable = true
    }

    this.configKeywordsService.saveProfileKeywords(this.profileId);
    // this.triggerRunTimeChanges(keywordData);
  }
}
