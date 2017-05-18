import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ConfigKeywordsDataService } from '../../../services/config-keywords-data.service';
import { ConfigKeywordsService } from '../../../services/config-keywords.service';
import { ConfigUtilityService } from '../../../services/config-utility.service';
import { Messages } from '../../../constants/config-constant'

@Component({
  selector: 'app-instrumentation',
  templateUrl: './instrumentation.component.html',
  styleUrls: ['./instrumentation.component.css']
})
export class InstrumentationComponent implements OnInit {

  profileId: number;
  index: number = 0;
  saveDisable: boolean = false;

  constructor(private configKeywordsService: ConfigKeywordsService,
    private configUtilityService: ConfigUtilityService,
    private route: ActivatedRoute,
  ) { }


  ngOnInit() {
    this.route.params.subscribe((params: Params) =>{
      this.profileId = params['profileId'];
      this.saveDisable=this.profileId==1? true:false;
      this.index = params['tabId'];


    });
  }

  saveKeywordData(keywordData) {
    for (let key in keywordData) {
      this.configKeywordsService.keywordData[key] = keywordData[key];
      this.configKeywordsService.keywordData[key].enable = true
    }
   // this.configUtilityService.successMessage(Messages);

    this.configKeywordsService.saveProfileKeywords(this.profileId);

  }


  handleChange(e){
    this.index = e.index;
  }
}
