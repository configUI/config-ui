import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { ConfigProfileService } from '../../services/config-profile.service'
import * as BREADCRUMB from '../../constants/config-breadcrumb-constant';

@Component({
  selector: 'app-config-meta-data',
  templateUrl: './config-meta-data.component.html',
  styleUrls: ['./config-meta-data.component.css']
})
export class ConfigMetaDataComponent implements OnInit, OnDestroy {

  constructor(private configProfileService: ConfigProfileService, private router: Router) { }

  isMetaDataDisplay: boolean = false;
  profileName: string;
  subscription: Subscription;


  ngOnInit() {
    this.subscription = this.configProfileService.profileNameProvider$.subscribe(data => this.profileName = data);

    this.router.events.filter(event => event instanceof NavigationEnd).subscribe(event => {
      let url = event["url"];

      if (url.startsWith(BREADCRUMB.URL.PROFILE)) {
        if (!url.startsWith(BREADCRUMB.URL.PROFILE_LIST)) {
          this.isMetaDataDisplay = true;
        }
        else {
          this.isMetaDataDisplay = false;
        }
      }
      else {
        this.isMetaDataDisplay = false;
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();
  }
}
