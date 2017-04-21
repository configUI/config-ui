import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { ConfigProfileService } from '../../services/config-profile.service';
import { ConfigApplicationService } from '../../services/config-application.service';
import * as BREADCRUMB from '../../constants/config-breadcrumb-constant';

@Component({
  selector: 'app-config-meta-data',
  templateUrl: './config-meta-data.component.html',
  styleUrls: ['./config-meta-data.component.css']
})
export class ConfigMetaDataComponent implements OnInit, OnDestroy {

  constructor(private configProfileService: ConfigProfileService, private configApplicationService: ConfigApplicationService, private router: Router) { }

  isMetaDataDisplay: boolean = false;
  label: string;

  profileName: string;
  applicationName: string;

  subscriptionProfile: Subscription;
  subscriptionApplication: Subscription;


  ngOnInit() {
    this.subscriptionProfile = this.configProfileService.profileNameProvider$.subscribe(data => this.profileName = data);
    this.subscriptionApplication = this.configApplicationService.applicationNameProvider$.subscribe(data => this.applicationName = data);

    this.router.events.filter(event => event instanceof NavigationEnd).subscribe(event => {
      let url = event["url"];

      if (url.startsWith(BREADCRUMB.URL.PROFILE)) {
        if (!url.startsWith(BREADCRUMB.URL.PROFILE_LIST)) {
          this.isMetaDataDisplay = true;
          this.label = `Profile Name: ${this.profileName}`;
          if(!this.profileName){
            let profileId = url.substring(url.lastIndexOf("/") + 1, url.length);
            this.getProfileName(profileId);
          }
        }
        else {
          this.isMetaDataDisplay = false;
        }
      }
      else if (url.startsWith(BREADCRUMB.URL.TREE_MAIN)) {
        this.isMetaDataDisplay = true;
        this.label = `Application Name: ${this.applicationName}`;
        if(!this.applicationName){
            let appId = url.substring(url.lastIndexOf("/") + 1, url.length);
            this.getAppName(appId);
          }
      }
      else {
        this.isMetaDataDisplay = false;
      }
    });
  }

  getProfileName(profileId: number){
    return;
    // this.configProfileService.getProfileName(profileId).
    // subscribe(profileName => {
    //   this.profileName = profileName;
    //   this.label = `Profile Name: ${this.profileName}`;
    //   console.log("this.label", this.label);
    // });
  }
  getAppName(appId: number){

  }

  ngOnDestroy() {
    if (this.subscriptionProfile)
      this.subscriptionProfile.unsubscribe();

    if (this.subscriptionApplication)
      this.subscriptionApplication.unsubscribe();
  }
}
