import { Component, OnInit } from '@angular/core';

import { ConfirmationService } from 'primeng/primeng';
import { ConfigKeywordsService } from '../../services/config-keywords.service';
import { ConfigUtilityService } from '../../services/config-utility.service';

@Component({
  selector: 'app-view-audit-log',
  templateUrl: './config-view-audit-log.component.html',
  styleUrls: ['./config-view-audit-log.component.css']
})
export class ConfigViewAuditLogComponent implements OnInit {

  auditLogData: any = [];
  gb: any;

  constructor(private _configUtilityService: ConfigUtilityService, private confirmationService: ConfirmationService, private _configKeywordsService: ConfigKeywordsService) { }

  ngOnInit() {

    //Getting data on Initial Load
    this.getAuditLogData();
  }

  getAuditLogData() {
    let fileName = '';
    // Getting Audit Log data from Server
    this._configKeywordsService.getActivityLogData().subscribe(data => {
      this.auditLogData = data;
    });
  }
}

