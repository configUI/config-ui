import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { MenuItem } from 'primeng/primeng';

import * as BREADCRUMB from '../../constants/config-breadcrumb-constant';
import { ConfigHomeService } from '../../services/config-home.service';
import { TRData } from '../../interfaces/main-info';

@Component({
  selector: 'app-config-breadcrumb',
  templateUrl: './config-breadcrumb.component.html',
  styleUrls: ['./config-breadcrumb.component.css']
})
export class ConfigBreadcrumbComponent implements OnInit, OnDestroy {

  constructor(private router: Router, private configHomeService: ConfigHomeService) { }

  items: MenuItem[];
  trData: TRData;
  subscription: Subscription;
  breadcrumbSubscription: Subscription;

  ngOnInit() {

    this.subscription = this.configHomeService.trData$.subscribe(data => {
      this.trData = data;
    });
    this.items = [];

    this.breadcrumbSubscription = this.router.events.filter(event => event instanceof NavigationEnd).subscribe(event => {
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
            this.items.push({ routerLink: [`${BREADCRUMB.URL.CONFIGURATION}/${profileId}`], label: BREADCRUMB.LABEL.CONFIGURATION });

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

      else if (url == BREADCRUMB.URL.TOPOLOGY_DETAIL) {
        this.items.push({ label: BREADCRUMB.LABEL.TOPOLOGY_DETAIL })
      }

      else if (url == BREADCRUMB.URL.ND_AGENT) {
        this.items.push({ label: BREADCRUMB.LABEL.ND_AGENT })
      }

      else if(url.startsWith(BREADCRUMB.URL.TREE_MAIN_TOPOLOGY)){
        this.items.push({label: BREADCRUMB.LABEL.TREE_MAIN})
      }

      else if (url.startsWith(BREADCRUMB.URL.TREE_MAIN)) {
        this.items.push({ label: BREADCRUMB.LABEL.APPLICATION_LIST, routerLink: [BREADCRUMB.URL.APPLICATION_LIST] })

        this.items.push({ label: BREADCRUMB.LABEL.TREE_MAIN })
      }
      console.log("this.items", this.items);
    });
  }

  enabledRTC(){
    //this.trData.status
    var that = this;
    setTimeout(function(this){
      that.configHomeService.trData.switch = that.trData.switch      
    },100)
  }

  ngOnDestroy(){
    if(this.subscription)
      this.subscription.unsubscribe();

    if(this.breadcrumbSubscription)
      this.breadcrumbSubscription.unsubscribe();
  }
}
