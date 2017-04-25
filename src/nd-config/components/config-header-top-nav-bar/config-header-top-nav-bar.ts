import { Component, OnInit } from '@angular/core';

import {Message, ConfirmationService} from 'primeng/primeng';

import {ConfigUtilityService} from '../../services/config-utility.service';

@Component({
  selector: 'app-config-header-top-nav-bar',
  templateUrl: './config-header-top-nav-bar.html',
  styleUrls: ['./config-header-top-nav-bar.scss']
})
export class ConfigTopHeaderNavBarComponent implements OnInit {

  constructor(private configUtilityService: ConfigUtilityService, private confirmationService: ConfirmationService) { }



  ngOnInit() {
   
  }

}
