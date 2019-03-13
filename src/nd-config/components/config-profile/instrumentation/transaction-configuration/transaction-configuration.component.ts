import { Component, OnInit, Input } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import { Keywords } from '../../../../interfaces/keywords';
import { KeywordsInfo } from '../../../../interfaces/keywords-info';
import { ConfigKeywordsDataService } from '../../../../services/config-keywords-data.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ConfigUtilityService } from '../../../../services/config-utility.service';
import { Messages ,customKeywordMessage } from '../../../../constants/config-constant'
import { ConfigKeywordsService } from '../../../../services/config-keywords.service';
import { Subscription } from 'rxjs/Subscription';
import { ConfigProfileService } from '../../../../services/config-profile.service';
import { NodeData } from '../../../../containers/node-data';
import { ConfigHomeService } from '../../../../services/config-home.service';
import { TRData } from '../../../../interfaces/main-info';
import * as URL from '../../../../constants/config-url-constant';

@Component({
  selector: 'app-transaction-configuration',
  templateUrl: './transaction-configuration.component.html',
  styleUrls: ['./transaction-configuration.component.css']
})
export class TransactionConfigurationComponent implements OnInit {
  
  @Input()
  profileId: number;
  
  index: number = 0;
  subscriptionNodeData: Subscription;
  subscriptionTRData: Subscription;

  nodeData: NodeData;
  trData: TRData;
  saveDisable: boolean = false;
  className: string = "Transaction configuration Component";

  agentType: string = "";
  errDialog: boolean = false;
  msg = [];
  errMsg = [];
  checkboxenable:boolean=true;
  isProfilePerm: boolean;
  
  keywordData: Object;

  /** To open content in dialog with topology levels information */
  showLevels: boolean = false
  info: string = "";

  constructor(private configKeywordsService: ConfigKeywordsService,
    private configUtilityService: ConfigUtilityService,
    private route: ActivatedRoute,
    private router: Router,
    private configProfileService: ConfigProfileService,
    private configHomeService: ConfigHomeService
  ) {
	this.agentType = sessionStorage.getItem("agentType");
 }

  ngOnInit() {
    this.isProfilePerm=+sessionStorage.getItem("ProfileAccess") == 4 ? true : false;
    this.route.params.subscribe((params: Params) => {
      this.profileId = params['profileId'];
      if(this.profileId == 1 || this.profileId == 777777 || this.profileId == 888888)
       this.saveDisable =  true;
      this.index = params['tabId']
    });

    this.loadKeywordData();
  }

  /**This method is used to when keyword data object doesn't exists any key value then we will get keyword data from server */
  loadKeywordData() {
    if (!this.configKeywordsService.keywordData){
      this.configKeywordsService.getProfileKeywords(this.profileId);
      // this.configKeywordsService.toggleKeywordData();
    }
  }



  saveKeywordData(keywordData) {
    this.keywordData = keywordData

    //If selected profile is applied at any level of topology
    if(sessionStorage.getItem("isAppliedProfile") == "true"){
      this.configProfileService.getAppliedProfileDetails(this.profileId).subscribe(data => {
        console.log("data  " , data)
        this.info = data["_body"].substring(0, data["_body"].length - 1).split(";");

        //Removing last semi colon
        this.info.slice(0,-1)
        this.showLevels = true;
        this.errDialog = true;
      })

    }
    //Offline case or independent profile case
    else{
      this.saveSettings();
    }
  }

  //To save setting after clicking on confirmation
  saveSettings(){
    this.errDialog = false;
    for (let key in this.keywordData) {
      this.configKeywordsService.keywordData[key] = this.keywordData[key];
      this.configKeywordsService.keywordData[key].enable = true
    }
    
    this.triggerRunTimeChanges(this.keywordData);
  }

  handleChange(e) {
    this.index = e.index;
    // this.router.navigate(['/profile/general', this.profileId, this.index]);
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
    
        if(sessionStorage.getItem("isAppliedProfile") == "true"){
          let trNo = sessionStorage.getItem("isTrNumber");
    
          //If test is not running then send -1 to the backend
          if(trNo == null){
            trNo = "-1";
          }
          const url = `${URL.RUNTIME_CHANGE_PROFILE_LEVEL}/${trNo}`;
          let that = this;
          this.configKeywordsService.sendRunTimeChange(url, keyWordDataList, this.profileId, function (rtcMsg, rtcErrMsg) {
            console.log("profile level rtc")
            that.msg = rtcMsg;
            that.errMsg = rtcErrMsg;
    
            //Showing partialError messages in dialog
            if (that.msg.length > 0 || that.errMsg.length > 0) {
              
              that.errDialog = true;
            }
          })
        }
        //if test is offline mode, return (no run time changes)
        else if (this.configHomeService.trData.switch == false || this.configHomeService.trData.status == null || this.configProfileService.nodeData.nodeType == null) {
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
          else if (this.configProfileService.nodeData.nodeType == 'tierGroup') {
            const url = `${URL.RUNTIME_CHANGE_TIER_GROUP}/${this.configProfileService.nodeData.nodeName}/${this.configProfileService.nodeData.nodeId}`;
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
          else if (this.configProfileService.nodeData.nodeType == 'tier') {
            const url = `${URL.RUNTIME_CHANGE_TIER}/${this.configProfileService.nodeData.nodeId}/${this.configProfileService.nodeData.nodeName}`;
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
            const url = `${URL.RUNTIME_CHANGE_SERVER}/${this.configProfileService.nodeData.nodeId}/${this.configProfileService.nodeData.nodeName}/${this.configProfileService.nodeData.topologyName}`;
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
            const url = `${URL.RUNTIME_CHANGE_INSTANCE}/${this.configProfileService.nodeData.nodeId}/${this.configProfileService.nodeData.nodeName}/${this.configProfileService.nodeData.topologyName}`;
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
      saveBTTransactionOnFile() {
      this.configKeywordsService.saveBusinessTransMethodData(this.profileId)
      .subscribe(data => {
        console.log("return type",data)
    })
    this.configHomeService.callTosetSelectedValueOfBT(true,this.profileId);
    }
    }
    
