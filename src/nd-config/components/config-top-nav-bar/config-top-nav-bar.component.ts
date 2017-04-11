import { Component, OnInit } from '@angular/core';

import {Message, ConfirmationService} from 'primeng/primeng';

import {ConfigUtilityService} from '../../services/config-utility.service';

@Component({
  selector: 'app-config-top-nav-bar',
  templateUrl: './config-top-nav-bar.component.html',
  styleUrls: ['./config-top-nav-bar.component.css']
})
export class ConfigTopNavBarComponent implements OnInit {

  constructor(private configUtilityService: ConfigUtilityService, private confirmationService: ConfirmationService) { }

  message: Message[] = [];

  ngOnInit() {
    this.configUtilityService.messageProvider$.subscribe(data=> this.message = data);
  }

}
