import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/primeng';
@Component({
  selector: 'app-config-ui-breadcrumb',
  templateUrl: './config-ui-breadcrumb.component.html',
  styleUrls: ['./config-ui-breadcrumb.component.css']
})
export class ConfigUiBreadcrumbComponent implements OnInit {

  private items: MenuItem[];

  constructor() { }

  ngOnInit() {
    this.items =  [{ label: 'Home', url: 'home'},
                   { label: 'Application', url: 'topology-detail'},
        ];
  }

}
