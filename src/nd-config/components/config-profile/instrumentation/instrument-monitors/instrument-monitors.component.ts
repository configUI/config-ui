import { Component, OnInit, Input } from '@angular/core';
import { ConfigUtilityService } from '../../../../services/config-utility.service';
import { Messages } from '../../../../constants/config-constant';
import { Keywords } from '../../../../interfaces/keywords';
import { KeywordsInfo } from '../../../../interfaces/keywords-info';
import { ConfigKeywordsService } from '../../../../services/config-keywords.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-instrument-monitors',
  templateUrl: './instrument-monitors.component.html',
  styleUrls: ['./instrument-monitors.component.css']
})
export class InstrumentMonitorsComponent implements OnInit {

  @Input()
  profileId: number;
  index: number = 1;
  
  constructor(private configKeywordsService: ConfigKeywordsService, private configUtilityService: ConfigUtilityService, private route: ActivatedRoute) { }

 saveKeywordData(keywordData) {
   for (let key in keywordData) {
      this.configKeywordsService.keywordData[key] = keywordData[key];
    }
    this.configUtilityService.successMessage(Messages);

    this.configKeywordsService.saveProfileKeywords(this.profileId);

  }

  ngOnInit() {
     this.route.params.subscribe((params: Params) => {
    });
    this.loadKeywordData();
  }

  /**This method is used to when keyword data object doesn't exists any key value then we will get keyword data from server */
  loadKeywordData() {
    if (!this.configKeywordsService.keywordData){
      this.configKeywordsService.getProfileKeywords(this.profileId);
      // this.configKeywordsService.toggleKeywordData();
      console.log("checkclkcckc",this.configKeywordsService.keywordData);
    }
  }

 handleChange(e) {
    this.index = e.index;
  }

}
