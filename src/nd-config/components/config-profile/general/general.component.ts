import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import { Keywords } from '../../../interfaces/keywords';
import { KeywordsInfo } from '../../../interfaces/keywords-info';
import { ConfigKeywordsDataService } from '../../../services/config-keywords-data.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ConfigUtilityService } from '../../../services/config-utility.service';
import { Messages } from '../../../constants/config-constant'
import { ConfigKeywordsService } from '../../../services/config-keywords.service';
import { Subscription } from 'rxjs/Subscription';
import { ConfigProfileService } from '../../../services/config-profile.service';
import { NodeData } from '../../../containers/node-data';
import { ConfigHomeService } from '../../../services/config-home.service';
import { TRData } from '../../../interfaces/main-info';
import * as URL from '../../../constants/config-url-constant';


@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css']
})

export class GeneralComponent implements OnInit {

  profileId: number;
  index: number = 0;
  subscriptionNodeData: Subscription;
  subscriptionTRData: Subscription;

  nodeData: NodeData;
  trData: TRData;
  saveDisable: boolean = false;
  className: string = "General Component";

  constructor(private configKeywordsService: ConfigKeywordsService,
    private configUtilityService: ConfigUtilityService,
    private route: ActivatedRoute,
    private router: Router,
    private configProfileService: ConfigProfileService,
    private configHomeService: ConfigHomeService
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.profileId = params['profileId'];
      this.saveDisable = this.profileId == 1 ? true : false;
      this.index = params['tabId']
    });

    this.loadKeywordData();
  }

  /**This method is used to when keyword data object doesn't exists any key value then we will get keyword data from server */
  loadKeywordData() {
    if (!this.configKeywordsService.keywordData)
      this.configKeywordsService.getProfileKeywords(this.profileId);
  }

  saveKeywordData(keywordData) {
    for (let key in keywordData) {
      this.configKeywordsService.keywordData[key] = keywordData[key];
    }
    this.configUtilityService.successMessage(Messages);

    this.configKeywordsService.saveProfileKeywords(this.profileId);
    this.triggerRunTimeChanges(keywordData);

  }

  handleChange(e) {
    this.index = e.index;
    // this.router.navigate(['/profile/general', this.profileId, this.index]);
  }

  triggerRunTimeChanges(data) {

    let keyWordDataList = [];
    for (let key in data) {
      keyWordDataList.push(key + "=" + data[key].value);
    }

    //if test is offline mode, return (no run time changes)
    if (this.configHomeService.trData.switch == false || this.configHomeService.trData.status == null || this.configProfileService.nodeData.nodeType == null) {
      console.log(this.className, "constructor", "No NO RUN TIme Changes");
      return;
    }
    else {
      console.log(this.className, "constructor", "MAKING RUNTIME CHANGES this.nodeData", this.configProfileService.nodeData);

      if (this.configProfileService.nodeData.nodeType == 'topology') {
        const url = `${URL.RUNTIME_CHANGE_TOPOLOGY}/${this.configProfileService.nodeData.nodeId}`;
        this.configKeywordsService.sendRunTimeChange(url, keyWordDataList)
      }
      else if (this.configProfileService.nodeData.nodeType == 'tier') {
        const url = `${URL.RUNTIME_CHANGE_TIER}/${this.configProfileService.nodeData.nodeId}`;
        this.configKeywordsService.sendRunTimeChange(url, keyWordDataList)
      }
      else if (this.configProfileService.nodeData.nodeType == 'server') {
        const url = `${URL.RUNTIME_CHANGE_SERVER}/${this.configProfileService.nodeData.nodeId}`;
        this.configKeywordsService.sendRunTimeChange(url, keyWordDataList)
      }

      else if (this.configProfileService.nodeData.nodeType == 'instance') {
        const url = `${URL.RUNTIME_CHANGE_INSTANCE}/${this.configProfileService.nodeData.nodeId}`;
        this.configKeywordsService.sendRunTimeChange(url, keyWordDataList)
      }
    }
  }
}
