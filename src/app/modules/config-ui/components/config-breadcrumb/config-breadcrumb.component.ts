import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/primeng';

@Component({
  selector: 'app-config-breadcrumb',
  templateUrl: './config-breadcrumb.component.html',
  styleUrls: ['./config-breadcrumb.component.css']
})
export class ConfigBreadcrumbComponent implements OnInit {

  constructor() { }

  private items: MenuItem[];

  ngOnInit() {
    this.items = [{label: 'Home'}];
  }

}
