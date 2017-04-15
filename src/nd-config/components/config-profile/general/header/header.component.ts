import { Component, OnInit } from '@angular/core';
import { ConfigUiUtility } from '../../../../utils/config-utility';
import { SelectItem } from 'primeng/primeng';
import { ConfigKeywordsService } from '../../../../services/config-keywords.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  HeaderForm:boolean = true;
   enableGroupKeyword:boolean;

  constructor(private configKeywordsService: ConfigKeywordsService) { 
    this.enableGroupKeyword = this.configKeywordsService.keywordGroup.general.header.enable;
  }
 

  ngOnInit() {
  }

}
