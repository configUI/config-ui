import { Component, OnInit ,Output, EventEmitter} from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import { Keywords } from '../../../interfaces/keywords';
import { KeywordsInfo } from '../../../interfaces/keywords-info';
import { ConfigKeywordsDataService } from '../../../services/config-keywords-data.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ConfigUtilityService } from '../../../services/config-utility.service';
import { Messages ,customKeywordMessage} from '../../../constants/config-constant'
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
  
  adminMode:boolean;

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
      this.index = params['tabId'];
    });
    this.loadKeywordData();
    this.loadAdminInfo();
  }

  /**This method is used to when keyword data object doesn't exists any key value then we will get keyword data from server */
  loadKeywordData(){
    if(!this.configKeywordsService.keywordData){
      this.configKeywordsService.getProfileKeywords(this.profileId);
      this.configKeywordsService.toggleKeywordData();
    }
  }

//This method is used to see whether it is admin mode or not
  loadAdminInfo(): void {
    this.configHomeService.getMainData()
      .subscribe(data => {this.adminMode = data.adminMode;
      }
      );
  }

  saveKeywordData(keywordData){
     for(let key in keywordData){
      this.configKeywordsService.keywordData[key] = keywordData[key];
       this.configKeywordsService.keywordData[key].enable = true
    }
    this.configUtilityService.successMessage(Messages);
    this.configKeywordsService.saveProfileKeywords(this.profileId);
    this.triggerRunTimeChanges(keywordData);
  }

  handleChange(e){
    this.index = e.index;
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
