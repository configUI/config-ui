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
      { label: "Home", route: `${ROUTING_PATH}/home`, icon: "icon ndegui-home", tooltip: "Home" },
      { label: "Application", route: `${ROUTING_PATH}/application-list`, icon: "icon ndegui-application", tooltip: "Application" },
      { label: "Profile", route: `${ROUTING_PATH}/profile/profile-list`, icon: "icon ndegui-profile", tooltip: "Profile" },
      { label: "Topology", route: `${ROUTING_PATH}/topology-list`, icon: "icon ndegui-topology", tooltip: "Topology" },
      { label: "ND Agent", route: `${ROUTING_PATH}/nd-agent`, icon: "icon ndegui-nd-agent", tooltip: "ND Agent" },
     // { label: "Discover Instrumentation Profile", route: `${ROUTING_PATH}/nd-agent`, icon: "fa fa-tint", tooltip: "Discover Instrumentation Profile" }
    ];
  }

}
