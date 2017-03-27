import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, Params, PRIMARY_OUTLET } from '@angular/router';
import { MenuItem } from 'primeng/primeng';

import * as BREADCRUMB from '../../constants/config-breadcrumb-constant';
// import { BreadcrumbInfo } from '../../interfaces/breadcrumb-info';

export interface BreadcrumbInfo {
  label: string;
  params?: Params;
  url: string;
}
interface IBreadcrumb {
  label: string;
  params?: Params;
  url: string;
}

@Component({
  selector: 'app-config-breadcrumb',
  templateUrl: './config-breadcrumb.component.html',
  styleUrls: ['./config-breadcrumb.component.css']
})
export class ConfigBreadcrumbComponent implements OnInit {
  breadcrumbs: IBreadcrumb[] = [];
  breadcrumb: BreadcrumbInfo[] = [];

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  private items: MenuItem[];

  ngOnInit() {

    this.items = [];

    this.router.events.filter(event => event instanceof NavigationEnd).subscribe(event => {
      this.items = [{ routerLink: ['home'], label: BREADCRUMB.LABEL.HOME }];

      let url = event.url;
      
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
            let profileId = url.substring(url.lastIndexOf("/"), url.length);
            console.log("profileId", profileId);
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

  profileEmit(): void {
    console.log("profileEmit()");
  }
  private getBreadcrumbs(route: ActivatedRoute, url: string = "", breadcrumbs: IBreadcrumb[] = []): IBreadcrumb[] {

    const ROUTE_DATA_BREADCRUMB: string = "breadcrumb";

    let children: ActivatedRoute[] = route.children;

    console.log("children", children);
    if (children.length == 0) {
      return breadcrumbs;
    }

    //iterate over each children
    for (let child of children) {
      //verify primary route
      console.log("child.snapshot.url", child.snapshot.url, child);
      console.log("child.snapshot.url", child.snapshot.component);

      console.log("child.outlet", child.outlet, "PRIMARY_OUTLET", PRIMARY_OUTLET, child.snapshot.url);
      if (child.outlet !== PRIMARY_OUTLET) {
        continue;
      }
      console.log("child.snapshot.data", child.snapshot.data);
      //verify the custom data property "breadcrumb" is specified on the route
      if (!child.snapshot.data.hasOwnProperty(ROUTE_DATA_BREADCRUMB)) {
        continue;
      }

      //get the route's URL segment
      let routeURL: string = child.snapshot.url.map(segment => segment.path).join("/");
      console.log("routeURL", routeURL);
      //append route URL to URL
      url += `/${routeURL}`;

      //add breadcrumb
      let breadcrumb: IBreadcrumb = {
        label: child.snapshot.data[ROUTE_DATA_BREADCRUMB],
        params: child.snapshot.params,
        url: url
      };
      breadcrumbs.push(breadcrumb);

      //recursive
      return this.getBreadcrumbs(child, url, breadcrumbs);
    }

    //we should never get here, but just in case
    return breadcrumbs;



  }

}
