import { Component, OnInit } from '@angular/core';

import { ConfigUiDataService } from '../../services/config-ui-data.service';

import { ApplicationData } from '../../containers/application-data';

import { APPLICATION_DATA } from '../../constants/cofig-ui-field-header-mapping'

@Component({
  selector: 'app-config-ui-application',
  templateUrl: './config-ui-application.component.html',
  styleUrls: ['./config-ui-application.component.css']
})
export class ConfigUiApplicationComponent implements OnInit {

  applicationData: ApplicationData[];
  cols = APPLICATION_DATA();

  constructor(private configUiDataService: ConfigUiDataService) { }

  ngOnInit() {
    this.configUiDataService.getApplicationData().then(data => {
      this.applicationData = data;
      console.log("this.applicationData ", this.applicationData);
    });
  }

}
