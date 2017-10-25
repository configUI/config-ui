import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { ConfigKeywordsDataService } from '../../../../services/config-keywords-data.service';
import { ConfigKeywordsService } from '../../../../services/config-keywords.service';
import { ConfigUtilityService } from '../../../../services/config-utility.service';
import { ConfigProfileService } from '../../../../services/config-profile.service';
import { ConfigHomeService } from '../../../../services/config-home.service';
import { NodeData } from '../../../../containers/node-data';
import { ExceptionData } from '../../../../containers/exception-capture-data';
import { KeywordData, KeywordList } from '../../../../containers/keyword-data';
import * as URL from '../../../../constants/config-url-constant';
import { Messages } from '../../../../constants/config-constant';
import { TRData } from '../../../../interfaces/main-info';


@Component({
  selector: 'app-exception',
  templateUrl: './exception.component.html',
  styleUrls: ['./exception.component.css']
})
export class ExceptionComponent implements OnInit {

  @Input()
  profileId: number;
  index: number = 0;
  saveDisable: boolean = false;
   subscriptionTRData: Subscription;

  nodeData: NodeData;
  trData: TRData;
  className: string = "Exception Component";
  
  /**This is to send data to parent component(General Screen Component) for save keyword data */
  @Output()
  keywordData = new EventEmitter();

  /**These are those keyword which are used in current screen. */
  keywordList: string[] = ['instrExceptions', 'enableExceptionsWithSourceAndVars'];
  subscriptionEG: Subscription;
  // selectedValue: string = 'unhandled';

  exception: Object;
  enableGroupKeyword: boolean;
  keywordValue: Object;

  errDialog: boolean = false;
  msg = [];
  errMsg = [];
   constructor(private configKeywordsService: ConfigKeywordsService,
    private configUtilityService: ConfigUtilityService,
     private route: ActivatedRoute,
    private router: Router,
    private configProfileService: ConfigProfileService,
    private configHomeService: ConfigHomeService,
    private store: Store<KeywordList>
  ) {
    this.subscription = this.store.select("keywordData").subscribe(data => {
      var keywordDataVal = {}
      this.keywordList.map(function (key) {
        keywordDataVal[key] = data[key];
      })
      this.exception = keywordDataVal;
    });
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

    // this.configKeywordsService.saveProfileKeywords(this.profileId);
    this.triggerRunTimeChanges(keywordData);
  }


  triggerRunTimeChanges(data) {
    
        let keyWordDataList = [];
        for (let key in data) {
          if(data[key].path){
            keyWordDataList.push(key + "=" + data[key].path);
          }
          else{
          keyWordDataList.push(key + "=" + data[key].value);
        }
      }
        console.log(this.className, "constructor", "this.configHomeService.trData.switch", this.configHomeService.trData);
        console.log(this.className, "constructor", "this.configProfileService.nodeData", this.configProfileService.nodeData);
    
        //if test is offline mode, return (no run time changes)
        if (this.configHomeService.trData.switch == false || this.configHomeService.trData.status == null || this.configProfileService.nodeData.nodeType == null) {
          console.log(this.className, "constructor", "No NO RUN TIme Changes");
          this.configKeywordsService.saveProfileKeywords(this.profileId);
          return;
        }
        else {
          console.log(this.className, "constructor", "MAKING RUNTIME CHANGES this.nodeData", this.configProfileService.nodeData);
    
          if (this.configProfileService.nodeData.nodeType == 'topology') {
            const url = `${URL.RUNTIME_CHANGE_TOPOLOGY}/${this.configProfileService.nodeData.nodeId}`;
            let that = this;
            this.configKeywordsService.sendRunTimeChange(url, keyWordDataList, this.profileId, function (rtcMsg, rtcErrMsg) {
              that.msg = rtcMsg;
              that.errMsg = rtcErrMsg;
    
              //Showing partialError messages in dialog
              if (that.msg.length > 0 || that.errMsg.length > 0) {
                
                that.errDialog = true;
              }
            })
          }
          else if (this.configProfileService.nodeData.nodeType == 'tier') {
            const url = `${URL.RUNTIME_CHANGE_TIER}/${this.configProfileService.nodeData.nodeId}`;
            let that = this
            this.configKeywordsService.sendRunTimeChange(url, keyWordDataList, this.profileId, function (rtcMsg, rtcErrMsg) {
              that.msg = rtcMsg;
              that.errMsg = rtcErrMsg;
    
              //Showing partialError messages in dialog
              if (that.msg.length > 0 || that.errMsg.length > 0) {
                
                that.errDialog = true;
              }
            })
          }
          else if (this.configProfileService.nodeData.nodeType == 'server') {
            const url = `${URL.RUNTIME_CHANGE_SERVER}/${this.configProfileService.nodeData.nodeId}`;
            let that = this;
            this.configKeywordsService.sendRunTimeChange(url, keyWordDataList, this.profileId, function (rtcMsg, rtcErrMsg) {
              that.msg = rtcMsg;
              that.errMsg = rtcErrMsg;
    
              //Showing partialError messages in dialog
              if (that.msg.length > 0 || that.errMsg.length > 0) {
                
                that.errDialog = true;
              }
            })
          }
    
          else if (this.configProfileService.nodeData.nodeType == 'instance') {
            const url = `${URL.RUNTIME_CHANGE_INSTANCE}/${this.configProfileService.nodeData.nodeId}`;
            let that = this;
            this.configKeywordsService.sendRunTimeChange(url, keyWordDataList, this.profileId, function (rtcMsg, rtcErrMsg) {
              that.msg = rtcMsg;
              that.errMsg = rtcErrMsg;
    
              //Showing partialError messages in dialog
              if (that.msg.length > 0 || that.errMsg.length > 0) {
                
                that.errDialog = true;
              }
            })
          }
        }
      }
    }
    