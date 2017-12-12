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
      { label: "Application", route: `${ROUTING_PATH}/application-list`, icon: "ndeicon ndegui-application", tooltip: "Application" },
      { label: "Profile", route: `${ROUTING_PATH}/profile/profile-list`, icon: "ndeicon ndegui-profile", tooltip: "Profile" },
      { label: "Topology", route: `${ROUTING_PATH}/topology-list`, icon: "ndeicon ndegui-topology", tooltip: "Topology" },
      { label: "Instrumentation Profile Maker" , route: `${ROUTING_PATH}/instrumentation-profile-maker`, icon: "ndeicon ndegui-instrmentation-profile", tooltip: "Instrumentation Profile Maker"},
      { label: "Auto Discover", route: `${ROUTING_PATH}/auto-discover`, icon: "ndeicon ndegui-auto-discover", tooltip: "Instrumentation Finder" },
      { label: "Audit Log", route: `${ROUTING_PATH}/audit-log-view`, icon: "ndeicon ndegui-audit-logs", tooltip: "Audit Log" },
    ];
  }

}
