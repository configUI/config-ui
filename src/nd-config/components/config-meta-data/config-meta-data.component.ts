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
    //below line gets called as soon as link of profile is clicked which routes to its configuration screen
    this.subscriptionProfile = this.configProfileService.profileNameProvider$.subscribe(data => {
      this.profileName = data;
      //storing profile name in a session
      sessionStorage.setItem("proName", data);
    });
    
    /*below code handles the case of refreshing the page due to which profileName gets undefined 
     * thus retrieving profile name stored in sessionStorage with key "proName"
     */
    if (this.profileName == undefined)
      this.profileName = sessionStorage.getItem("proName");

    this.subscriptionApplication = this.configApplicationService.applicationNameProvider$.subscribe(data => {this.applicationName = data;
      sessionStorage.setItem("selectedApplicationName", this.applicationName)
    });
    this.router.events.filter(event => event instanceof NavigationEnd).subscribe(event => {
      let url = event["url"];
      if (url.startsWith(BREADCRUMB.URL.PROFILE)) {
        if (!url.startsWith(BREADCRUMB.URL.PROFILE_LIST)) {
          this.isMetaDataDisplay = true;
          
          this.label = `Profile Name: ${this.profileName}`;
        }
        else {
          this.isMetaDataDisplay = false;
        }
      }
      else if (url.startsWith(BREADCRUMB.URL.TREE_MAIN_TOPOLOGY)) {
        this.isMetaDataDisplay = false;
      }
      else if (url.startsWith(BREADCRUMB.URL.TREE_MAIN)) {
        this.isMetaDataDisplay = true;
    
        if (this.applicationName == undefined)
          this.applicationName = sessionStorage.getItem("selectedApplicationName");

        this.label = `Application Name: ` + this.applicationName

        if(url.startsWith(BREADCRUMB.URL.TREE_PROFILE)){
          if(this.applicationName != "undefined")
            this.label = `Application Name: ` + this.applicationName + ", " + `Profile Name: ${this.profileName}`;
          else
            this.label = `Profile Name: ${this.profileName}`;
        }
        
        if (!this.applicationName) {
          let appId = url.substring(url.lastIndexOf("/") + 1, url.length);
          this.getAppName(appId);
        }
      }
      else {
        this.isMetaDataDisplay = false;
      }
    });
  }

  /*
  *  Here url can be of following types:
  *  url1 = "/profile/advance/1024/3",
  *  url2 = "/profile/congiguration/7999"
  *  where aftr 3rd "/" number represents profileId
  * 
  */


  // getProfileId(url) {
  //   let arr = url.split('');
  //   let startIndex = this.getStartIndexProfileId(arr);
  //   let endIndex = this.getEndIndex(startIndex, arr);
  //   let profileId = url.substring(startIndex + 1, endIndex)
  //   return profileId;
  // }

  getEndIndex(startIndex, arr) {
    let endIndex = arr.length;
    for (let i = startIndex + 1; i <= arr.length; i++) {
      if (arr[i] == "/") {
        endIndex = i;
      }
    }
    return endIndex;
  }

  getStartIndexProfileId(arr) {
    let counter = 0;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] == "/") {
        counter++;
        if (counter == 3)
          return i;
      }
    }
  }
  
  // getProfileName(profileId: number) {
  //   this.configProfileService.getProfileName(profileId).
  //     subscribe(data => {
  //       sessionStorage.setItem("proName", data["profileName"]);
  //       this.profileName = data["profileName"]
  //       this.label = `Profile Name: ${this.profileName}`;
  //       console.log("this.label", this.label);
  //     });
  // }

  getAppName(appId: number) {

  }

  ngOnDestroy() {
    if (this.subscriptionProfile)
      this.subscriptionProfile.unsubscribe();

    if (this.subscriptionApplication)
      this.subscriptionApplication.unsubscribe();
  }
}