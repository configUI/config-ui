import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ConfigUtilityService } from '../../../../services/config-utility.service';
import { ConfigKeywordsService } from '../../../../services/config-keywords.service';

@Component({
  selector: 'app-integration-pt-detection',
  templateUrl: './integration-pt-detection.component.html',
  styleUrls: ['./integration-pt-detection.component.css']
})
export class IntegrationPtDetectionComponent implements OnInit {

  @Input()
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
}



