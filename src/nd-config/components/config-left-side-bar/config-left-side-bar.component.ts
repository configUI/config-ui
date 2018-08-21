import { Component, OnInit } from '@angular/core';
import { ROUTING_PATH } from '../../constants/config-url-constant';
import{ Http} from '@angular/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-config-left-side-bar',
  templateUrl: './config-left-side-bar.component.html',
  styleUrls: ['./config-left-side-bar.component.css']
})
export class ConfigLeftSideBarComponent implements OnInit {

  navMenuArray = [];
  ROUTING_PATH = ROUTING_PATH;

  noProfilePerm: boolean;
  noAppPerm: boolean;
  noTopoPerm: boolean;
  noAutodisPerm: boolean;
  noInstrProfPerm: boolean;
  noPerm  = [];
  constructor(private http: Http,private router: Router) { }

  ngOnInit() {
  var userName = sessionStorage.getItem('sesLoginName');
    var passWord =  sessionStorage.getItem('sesLoginPass');
    // let URL=sessionStorage.getItem('host');
    // var url =  URL + 'DashboardServer/acl/user/authenticateNDConfigUI?userName=' + userName + '&passWord=' + passWord
    // this.http.get(url).map(res => res.json()).subscribe(data => {
      // sessionStorage.setItem("ProfileAccess",data["Profile"]);
      // sessionStorage.setItem("ApplicationAccess",data["Application"]);
      // sessionStorage.setItem("TopologyAccess",data["Topology"]);
      // sessionStorage.setItem("InstrProfAccess",data["InstrumentationProfileMaker"]);
      // sessionStorage.setItem("AutoDiscoverAccess",data["AutoDiscover"]);
      
      //     if(+data["Profile"] == 0)
      //       this.noPerm.push("Profile");

      //     if(+data["Application"] == 0)
      //       this.noPerm.push("Application");

      //     if(+data["Topology"] == 0)
      //       this.noPerm.push("Topology");

      //       if(+data["AutoDiscover"] == 0)
      //       this.noPerm.push("Auto Discover");

      //     if(+data["InstrumentationProfileMaker"] == 0)
      //       this.noPerm.push("Instrumentation Profile Maker");

          /* Main Menu Array.  */
          this.navMenuArray = [
            { label: "Home", route: `${ROUTING_PATH}/home`, icon: "ndeicon ndegui-home1", tooltip: "Home" },
            { label: "Application", route: `${ROUTING_PATH}/application-list`, icon: "ndeicon ndegui-application", tooltip: "Application" },
            { label: "Profile", route: `${ROUTING_PATH}/profile/profile-list`, icon: "ndeicon ndegui-profile", tooltip: "Profile" },
            { label: "Topology", route: `${ROUTING_PATH}/topology-list`, icon: "ndeicon ndegui-topology", tooltip: "Topology" },
            { label: "Instrumentation Profile Maker" , route: `${ROUTING_PATH}/instrumentation-profile-maker`, icon: "ndeicon ndegui-instrmentation-profile", tooltip: "Instrumentation Profile Maker"},
	          { label: "Auto Discover", route: `${ROUTING_PATH}/auto-discover`, icon: "ndeicon ndegui-auto-discover", tooltip: "Instrumentation Finder" },
            { label: "NDE Cluster Configuration", route: `${ROUTING_PATH}/nde-cluster-config`, icon: "ndeicon ndegui-cluster", tooltip: "NDE Cluster Configuration" },
            { label: "User Configured Settings", route: `${ROUTING_PATH}/user-configured-keywords`, icon: "ndeicon ndegui-custom-keyword", tooltip: "User Configured Keywords" },
            { label: "Audit Log", route: `${ROUTING_PATH}/audit-log-view`, icon: "ndeicon ndegui-audit-logs", tooltip: "Audit Log" },
          ];
        
        //   for(let i=0;i<this.navMenuArray.length;i++){
        //     for(let j=0;j<this.noPerm.length;j++){
        //       if (this.navMenuArray[i]['label'] == this.noPerm[j]) {
        //         this.navMenuArray.splice(i,1);
        //         i--;
        //       }
        //     }
        //   }
        //   if(this.navMenuArray.length == 3){
        //     for(let m=0;m<this.navMenuArray.length;m++){
        //     if(this.navMenuArray[m]['label'] == "Auto Discover")
        //       this.router.navigate(['/home/config/auto-discover']);
        //     else if(this.navMenuArray[m]['label'] == "Instrumentation Profile Maker")
        //       this.router.navigate(['/home/config/instrumentation-profile-maker']);
        //     }
        // }
        //   if(+data["Profile"] == 0 && +data["Application"] == 0 && +data["Topology"] == 0){
        //   if(this.navMenuArray.length == 4){
        //     this.router.navigate(['/home/config/auto-discover']);
        //   }
        // }
      //   });
  }

}
