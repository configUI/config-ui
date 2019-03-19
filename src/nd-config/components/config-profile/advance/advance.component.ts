import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import { Keywords } from '../../../interfaces/keywords';
import { KeywordsInfo } from '../../../interfaces/keywords-info';
import { ConfigKeywordsDataService } from '../../../services/config-keywords-data.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ConfigUtilityService } from '../../../services/config-utility.service';
import { Messages, customKeywordMessage } from '../../../constants/config-constant'
import { ConfigKeywordsService } from '../../../services/config-keywords.service';
import { Subscription } from 'rxjs/Subscription';
import { ConfigProfileService } from '../../../services/config-profile.service';
import { NodeData } from '../../../containers/node-data';
import { ConfigHomeService } from '../../../services/config-home.service';
import { TRData } from '../../../interfaces/main-info';
import * as URL from '../../../constants/config-url-constant';

@Component({
  selector: 'app-advance',
  templateUrl: './advance.component.html',
  styleUrls: ['./advance.component.css']
})
export class AdvanceComponent implements OnInit {

  profileId: number;

  index: number = 0;

  subscriptionNodeData: Subscription;
  subscriptionTRData: Subscription;

  nodeData: NodeData;
  trData: TRData;
  saveDisable: boolean = false;
  className: string = "Advance Component";

  adminMode: boolean;
  isUserMode: boolean;

  errDialog: boolean = false;
  msg = [];
  errMsg = [];
  agentType: string = "";
  isAdminPerm: boolean;

  keywordData: Object;

  /** To open content in dialog with topology levels information */
  showLevels: boolean = false
  info: any
  dialogHeader = "";

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
    this.isAdminPerm = sessionStorage.getItem("ndconfigGroup") == "configUI_Admin" ? true : false
    this.route.params.subscribe((params: Params) => {
      this.profileId = params['profileId'];
      if (this.profileId == 1 || this.profileId == 777777 || this.profileId == 888888 || this.profileId == 666666 || this.profileId == 999999)
        this.saveDisable = true;
      this.index = params['tabId'];
    });
    this.loadKeywordData();
    this.loadAdminInfo();
  }

  /**This method is used to when keyword data object doesn't exists any key value then we will get keyword data from server */
  loadKeywordData() {
    if (!this.configKeywordsService.keywordData) {
      this.configKeywordsService.getProfileKeywords(this.profileId);
      this.configKeywordsService.toggleKeywordData();
    }
  }

  //This method is used to see whether it is admin mode or not
  loadAdminInfo(): void {
    this.configHomeService.getMainData()
      .subscribe(data => {
        this.adminMode = data.adminMode;
        this.isUserMode = true;
      }
      );
  }

  saveKeywordData(keywordData) {
    this.keywordData = keywordData

    //If selected profile is applied at any level of topology
    if (sessionStorage.getItem("isAppliedProfile") == "true" && this.configHomeService.trData.switch != false && this.configHomeService.trData.status != null) {
      this.configProfileService.getAppliedProfileDetails(this.profileId).subscribe(data => {
        this.info = data.substring(0, data.length - 1).split(";");
        this.dialogHeader = "Applied Profile Information"
        //Removing last semi colon
        this.info.slice(0, -1)
        this.showLevels = true;
        this.errDialog = true;
      })

    }
    //Offline case or independent profile case
    else {
      this.dialogHeader = "Runtime changes partially applied on instances";
      this.saveSettings();
    }
  }

  //To save setting after clicking on confirmation
  saveSettings() {
    this.errDialog = false;
    for (let key in this.keywordData) {
      this.configKeywordsService.keywordData[key] = this.keywordData[key];
      this.configKeywordsService.keywordData[key].enable = true
    }

    this.triggerRunTimeChanges(this.keywordData);
  }

  //This method is called only in case of custom keywords
  saveCustomKeywordData(keywordData) {
    for (let key in keywordData) {
      this.configKeywordsService.keywordData[key] = keywordData[key];
    }
    // this.configKeywordsService.saveProfileKeywords(this.profileId);
    this.triggerRunTimeChanges(keywordData);
  }

  handleChange(e) {
    this.index = e.index;
  }


  triggerRunTimeChanges(data) {

    let keyWordDataList = [];
    for (let key in data) {
      if (data[key].path) {
        keyWordDataList.push(key + "=" + data[key].path);
      }
      else {
        keyWordDataList.push(key + "=" + data[key].value);
      }
    }
    console.log(this.className, "constructor", "this.configHomeService.trData.switch", this.configHomeService.trData);
    console.log(this.className, "constructor", "this.configProfileService.nodeData", this.configProfileService.nodeData);
    if (sessionStorage.getItem("isAppliedProfile") == "true") {
      let trNo = sessionStorage.getItem("isTrNumber");

      //If test is not running then send -1 to the backend
      if (trNo == null) {
        trNo = "-1";
      }
      const url = `${URL.RUNTIME_CHANGE_PROFILE_LEVEL}/${trNo}`;
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
    //if test is offline mode, return (no run time changes)
    else if ((this.configProfileService.nodeData.nodeType == null && sessionStorage.getItem("isAppliedProfile") == "false")
      || (this.configHomeService.trData.switch == false || this.configHomeService.trData.status == null || this.configProfileService.nodeData.nodeType == null)) {
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
        const url = `${URL.RUNTIME_CHANGE_TIER}/${this.configProfileService.nodeData.nodeId}/${this.configProfileService.nodeData.nodeName}/${this.configProfileService.nodeData.topologyName}`;
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
}

