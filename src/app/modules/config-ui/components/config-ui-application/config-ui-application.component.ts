import { Component, OnInit } from '@angular/core';

import { ConfigUiDataService } from '../../services/config-ui-data.service';

import { ApplicationData } from '../../containers/application-data';

import { TableField } from '../../interfaces/table-field';

@Component({
  selector: 'app-config-ui-application',
  templateUrl: './config-ui-application.component.html',
  styleUrls: ['./config-ui-application.component.css']
})
export class ConfigUiApplicationComponent implements OnInit {

  applicationData: ApplicationData[];
  cols: TableField[];

  constructor(private configUiDataService: ConfigUiDataService) { }

  ngOnInit() {
    this.getApplicationColName();
    this.configUiDataService.getApplicationData().then(data => {
      this.applicationData = data;
      console.log("this.applicationData ", this.applicationData);
    });
  }

  getApplicationColName() {
    this.cols = [
      { field: 'appName', header: 'Name' },
      { field: 'topoName', header: 'Topology' },
      { field: 'userName', header: 'User Name' },
      { field: 'appDesc', header: 'Description' },
      
      // {field: 'appId', header: 'Year'},
      // {field: 'dcId', header: 'Color'},
      // {field: 'dcTopoAssocId', header: 'Brand'},
      // {field: 'topoId', header: 'Brand'},
    ];
  }

}
