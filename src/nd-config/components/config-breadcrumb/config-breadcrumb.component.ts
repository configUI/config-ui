import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MenuItem } from 'primeng/primeng';

import * as BREADCRUMB from '../../constants/config-breadcrumb-constant';

@Component({
  selector: 'app-config-breadcrumb',
  templateUrl: './config-breadcrumb.component.html',
  styleUrls: ['./config-breadcrumb.component.css']
})
export class ConfigBreadcrumbComponent implements OnInit {

  constructor(private router: Router) { }

  private items: MenuItem[];

  ngOnInit() {

    this.items = [];

    this.router.events.filter(event => event instanceof NavigationEnd).subscribe(event => {
      this.items = [{ routerLink: [BREADCRUMB.URL.HOME], label: BREADCRUMB.LABEL.HOME }];

      let url = event["url"];
      console.log("ConfigBreadcrumbComponent", "ngOnInit", "url ", url);
      if (url == BREADCRUMB.URL.APPLICATION_LIST) {
        this.items.push({ label: BREADCRUMB.LABEL.APPLICATION_LIST });
      }
      else if (url.startsWith(BREADCRUMB.URL.PROFILE)) {

        if (url.startsWith(BREADCRUMB.URL.PROFILE_LIST))
          this.items.push({ label: BREADCRUMB.LABEL.PROFILE_LIST });
        else {
          this.items.push({ routerLink: [BREADCRUMB.URL.PROFILE_LIST], label: BREADCRUMB.LABEL.PROFILE_LIST });

          if (url.startsWith(BREADCRUMB.URL.CONFIGURATION))
            this.items.push({ label: BREADCRUMB.LABEL.CONFIGURATION });

          else {
            let arrURL = url.split("/");
            
            let tabId = arrURL[arrURL.length - 1];
            let profileId = arrURL[arrURL.length - 2];

            console.log("profileId", `${BREADCRUMB.URL.CONFIGURATION}/${profileId}`);
            this.items.push({routerLink: [`${BREADCRUMB.URL.CONFIGURATION}/${profileId}`], label: BREADCRUMB.LABEL.CONFIGURATION});
            
            if (url.startsWith(BREADCRUMB.URL.GENERAL))
              this.items.push({ label: BREADCRUMB.LABEL.GENERAL });
            else if (url.startsWith(BREADCRUMB.URL.INSTRUMENTATION))
              this.items.push({ label: BREADCRUMB.LABEL.INSTRUMENTATION });
            else if (url.startsWith(BREADCRUMB.URL.ADVANCE))
              this.items.push({ label: BREADCRUMB.LABEL.ADVANCE });
            else if (url.startsWith(BREADCRUMB.URL.INTEGRATION))
              this.items.push({ label: BREADCRUMB.LABEL.INTEGRATION });
          }
        }
      }

      else if (url == BREADCRUMB.URL.TOPOLOGY_LIST) {
        this.items.push({ routerLink: [url], label: BREADCRUMB.LABEL.TOPOLOGY_LIST });
      }

      console.log("this.items", this.items);
    });
  }  
}
