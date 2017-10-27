import { Component, OnInit } from '@angular/core';
import { ROUTING_PATH } from '../../constants/config-url-constant';

@Component({
  selector: 'app-config-left-side-bar',
  templateUrl: './config-left-side-bar.component.html',
  styleUrls: ['./config-left-side-bar.component.css']
})
export class ConfigLeftSideBarComponent implements OnInit {

  navMenuArray = [];
  ROUTING_PATH = ROUTING_PATH;

  constructor() { }

  ngOnInit() {
    /* Main Menu Array.  */
    this.navMenuArray = [
      { label: "Home", route: `${ROUTING_PATH}/home`, icon: "ndeicon ndegui-home1", tooltip: "Home" },
      { label: "Application", route: `${ROUTING_PATH}/application-list`, icon: "icon ndegui-application", tooltip: "Application" },
      { label: "Profile", route: `${ROUTING_PATH}/profile/profile-list`, icon: "icon ndegui-profile", tooltip: "Profile" },
      { label: "Topology", route: `${ROUTING_PATH}/topology-list`, icon: "icon ndegui-topology", tooltip: "Topology" },
      { label: "Instrumentation Profile Maker" , route: `${ROUTING_PATH}/instrumentation-profile-maker`, icon: "icon ndegui-instrmentation-profile", tooltip: "Instrumentation Profile Maker"},
      { label: "Auto Discover", route: `${ROUTING_PATH}/auto-discover-main`, icon: "icon ndegui-auto-discover", tooltip: "Auto Discover" },
      { label: "Audit Log", route: `${ROUTING_PATH}/audit-log-view`, icon: "icon ndegui-audit-logs", tooltip: "Audit Log" },
      // { label: "ND Agent", route: `${ROUTING_PATH}/nd-agent`, icon: "icon ndegui-nd-agent", tooltip: "ND Agent" },
     // { label: "Discover Instrumentation Profile", route: `${ROUTING_PATH}/nd-agent`, icon: "fa fa-tint", tooltip: "Discover Instrumentation Profile" }
    ];
  }

}
