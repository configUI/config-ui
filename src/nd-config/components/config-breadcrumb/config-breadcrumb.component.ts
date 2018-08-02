import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { MenuItem } from 'primeng/primeng';
import { ConfigTopologyService } from '../../services/config-topology.service';
import { ROUTING_PATH } from '../../constants/config-url-constant';
import * as BREADCRUMB from '../../constants/config-breadcrumb-constant';
import { ConfigHomeService } from '../../services/config-home.service';
import { TRData } from '../../interfaces/main-info';
import { Observable, } from 'rxjs/Rx';

@Component({
  selector: 'app-config-breadcrumb',
  templateUrl: './config-breadcrumb.component.html',
  styleUrls: ['./config-breadcrumb.component.css']
})
export class ConfigBreadcrumbComponent implements OnInit, OnDestroy {
  constructor(private router: Router, private configHomeService: ConfigHomeService,
    private configTopologyService: ConfigTopologyService) { }

  items: MenuItem[];
  trData: TRData;
  displaySessionLabel: boolean;
  subscription: Subscription;
  breadcrumbSubscription: Subscription;
  dcId: any;

  countAI: number = 0;
  ROUTING_PATH = ROUTING_PATH;
  refreshIntervalTime:number = 30000;

  ngOnInit() {
    this.getTestInfoDetails();
    //Load AI in progress sessions
    this.configTopologyService.updateAIDetails().subscribe(data => {
      this.countAI = 0;
      for (let i = 0; i < data.length; i++) {
        if (data[i].status != "complete")
          this.countAI++;
      }
      this.configHomeService._AIStartStopOpertation$.subscribe(data =>
        {
          this.countAI = 0;
          if(data == true)
            this.countAI++;
          else
             this.countAI--;
        })
        this.configHomeService._AIStartStopOpertationList$.subscribe(data =>
        { this.countAI = 0;
            if(data == true)
              this.countAI++;
            else if(data == false)
               this.countAI--;
               else{
               this.countAI = +sessionStorage.getItem("countAI");
                
               }
          })
        sessionStorage.setItem("countAI", this.countAI.toString());
    })

    this.trData = new TRData();
    this.subscription = this.configHomeService.trData$.subscribe(data => {
      this.trData = data;
      sessionStorage.setItem("isTrNumber", data.trNo);
      sessionStorage.setItem("isSwitch", "" + data.switch);
      sessionStorage.setItem("isStatus", "" + data.status);
      this.getRunningTestRunInfo();
    });

    if(sessionStorage.getItem("BreadCrumbUrl") != null)
      this.getBreadCrumbURL(sessionStorage.getItem("BreadCrumbUrl"));
    else
      this.items = [{ routerLink: [BREADCRUMB.URL.HOME], label: BREADCRUMB.LABEL.HOME }];

    this.breadcrumbSubscription = this.router.events.filter(event => event instanceof NavigationEnd).subscribe(event => {
      let url = event["url"];
      this.getBreadCrumbURL(url);
      sessionStorage.setItem("BreadCrumbUrl" , url)
    });

    let timer = Observable.timer(30000, this.refreshIntervalTime);
    this.subscription = timer.subscribe(t => this.getTestInfoDetails());
  }

  getBreadCrumbURL(url)
  {
    this.items = [{ routerLink: [BREADCRUMB.URL.HOME], label: BREADCRUMB.LABEL.HOME }];

    if (url == BREADCRUMB.URL.APPLICATION_LIST) {
      this.items.push({ label: BREADCRUMB.LABEL.APPLICATION_LIST });
    }
    else if (url.startsWith(BREADCRUMB.URL.NDC_KEYWORDS)) {
      this.items.push({ label: BREADCRUMB.LABEL.APPLICATION_LIST, routerLink: [BREADCRUMB.URL.APPLICATION_LIST] });
      this.items.push({ label: BREADCRUMB.LABEL.NDC_KEYWORDS });
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

    else if (url.startsWith(BREADCRUMB.URL.TREE_MAIN_TOPOLOGY)) {
      if (!url.includes("tree-main/topology/profile")) {
        let topoId = url.substring(url.lastIndexOf("/") + 1)
        sessionStorage.setItem("topoId", topoId)
        // this.items.push({ label: BREADCRUMB.LABEL.TOPOLOGY_DETAIL, routerLink: [BREADCRUMB.URL.TOPOLOGY_DETAIL] })
      }
      this.items.push({ label: BREADCRUMB.LABEL.TOPOLOGY_DETAIL, routerLink: [BREADCRUMB.URL.TOPOLOGY_DETAIL] })

      if (url.startsWith(BREADCRUMB.URL.TREE_TOPO_PROFILE)) {
        this.items.push({ label: BREADCRUMB.LABEL.TREE_MAIN, routerLink: [`${BREADCRUMB.URL.TREE_MAIN_TOPOLOGY}/${sessionStorage.getItem("topoId")}`] })
        if (url.startsWith(BREADCRUMB.URL.TREE_TOPOLOGY))
          this.items.push({ label: BREADCRUMB.LABEL.CONFIGURATION });
        else {
          let arrURL = url.split("/");

          let tabId = arrURL[arrURL.length - 1];
          let profileId = arrURL[arrURL.length - 2];

          this.items.push({ routerLink: [`${BREADCRUMB.URL.TREE_TOPOLOGY}/${profileId}`], label: BREADCRUMB.LABEL.CONFIGURATION });

          if (url.startsWith(BREADCRUMB.URL.TOPO_TREE_GENERAL))
            this.items.push({ label: BREADCRUMB.LABEL.GENERAL });
          else if (url.startsWith(BREADCRUMB.URL.TOPO_TREE_INSTRUMENTATION))
            this.items.push({ label: BREADCRUMB.LABEL.INSTRUMENTATION });
          else if (url.startsWith(BREADCRUMB.URL.TOPO_TREE_ADVANCE))
            this.items.push({ label: BREADCRUMB.LABEL.ADVANCE });
          else if (url.startsWith(BREADCRUMB.URL.TOPO_TREE_INTEGRATION))
            this.items.push({ label: BREADCRUMB.LABEL.INTEGRATION });
        }
      }
      else {
        this.items.push({ label: BREADCRUMB.LABEL.TREE_MAIN })
      }
    }
    else if (url.startsWith(BREADCRUMB.URL.TREE_MAIN)) {
      //Getting dcId from the URL
      if (!url.includes("tree-main/profile")) {
        let arrURL = url.split("/");
        this.dcId = arrURL[arrURL.length - 1];
        sessionStorage.setItem("dcId", this.dcId);
      }

      this.items.push({ label: BREADCRUMB.LABEL.APPLICATION_LIST, routerLink: [BREADCRUMB.URL.APPLICATION_LIST] })

      if (url.startsWith(BREADCRUMB.URL.TREE_PROFILE)) {
        this.items.push({ label: BREADCRUMB.LABEL.TREE_MAIN, routerLink: [`${BREADCRUMB.URL.TREE_MAIN}/${sessionStorage.getItem("dcId")}`] })
        if (url.startsWith(BREADCRUMB.URL.TOPOLOGY_PROFILE))
          this.items.push({ label: BREADCRUMB.LABEL.CONFIGURATION });
        else {
          let arrURL = url.split("/");

          let tabId = arrURL[arrURL.length - 1];
          let profileId = arrURL[arrURL.length - 2];

          this.items.push({ routerLink: [`${BREADCRUMB.URL.TOPOLOGY_PROFILE}/${profileId}`], label: BREADCRUMB.LABEL.CONFIGURATION });

          if (url.startsWith(BREADCRUMB.URL.TREE_GENERAL))
            this.items.push({ label: BREADCRUMB.LABEL.GENERAL });
          else if (url.startsWith(BREADCRUMB.URL.TREE_INSTRUMENTATION))
            this.items.push({ label: BREADCRUMB.LABEL.INSTRUMENTATION });
          else if (url.startsWith(BREADCRUMB.URL.TREE_ADVANCE))
            this.items.push({ label: BREADCRUMB.LABEL.ADVANCE });
          else if (url.startsWith(BREADCRUMB.URL.TREE_INTEGRATION))
            this.items.push({ label: BREADCRUMB.LABEL.INTEGRATION });
        }

      }
      else {
        this.items.push({ label: BREADCRUMB.LABEL.TREE_MAIN })
  sessionStorage.setItem("agentType", "");
      }
    }

    else if (url == BREADCRUMB.URL.INSTRUMENTATION_PROFILE_MAKER) {
      this.items.push({ label: BREADCRUMB.LABEL.INSTRUMENTATION_PROFILE_MAKER })
    }
    else if (url == BREADCRUMB.URL.INSTRUMENTATION_PROFILE_MAKER) {
      this.items.push({ label: BREADCRUMB.LABEL.INSTRUMENTATION_PROFILE_MAKER })
    }
    else if (url.startsWith(BREADCRUMB.URL.AUTO_DISCOVER_TREE)) {
      this.items.push({ routerLink: [`${BREADCRUMB.URL.AUTO_INSTRUMENTATION}`], label: BREADCRUMB.LABEL.AUTO_INSTRUMENTATION });
      this.items.push({ label: BREADCRUMB.LABEL.AUTO_DISCOVER })
    }
    else if(url.includes(".txt")){
      this.items.push({ routerLink: [`${BREADCRUMB.URL.AUTO_INSTRUMENTATION}`], label: BREADCRUMB.LABEL.AUTO_INSTRUMENTATION });
      this.items.push({ label: BREADCRUMB.LABEL.AI })
    }
    else if (url.startsWith(BREADCRUMB.URL.AUTO_INSTRUMENTATION)) {
      this.items.push({ label: BREADCRUMB.LABEL.AUTO_INSTRUMENTATION });
    }
    else if (url.startsWith(BREADCRUMB.URL.VIEW_AUDIT_LOG)) {
      this.items.push({ label: BREADCRUMB.LABEL.VIEW_AUDIT_LOG });
    }
    else if (url.startsWith(BREADCRUMB.URL.NDE_CLUSTER_CONFIG)) {
      this.items.push({ label: BREADCRUMB.LABEL.NDE_CLUSTER });
    }
    else if (url.startsWith(BREADCRUMB.URL.USER_CONFIGURED_KEYWORD)) {
      this.items.push({ label: BREADCRUMB.LABEL.USER_CONFIG_KEYWORDS });
    }

    console.log("this.items", this.items);
  }

 // this method is used for get running test run status after 30 sec
  getTestInfoDetails()
  {
    this.configHomeService.getTestRunStatus().subscribe(data => 
    {
      data.trData.switch = true;
      if(sessionStorage.getItem("isSwitch") === 'false')
        data.trData.switch = false;
      this.configHomeService.setTrData(data.trData);
      this.configHomeService.trData = data.trData;
      }
    );
  }

  getRunningTestRunInfo() {
    if (sessionStorage.getItem("isTrNumber") != "null") {
      if (sessionStorage.getItem("isTrNumber") != null) {
        this.trData.trNo = sessionStorage.getItem("isTrNumber");
        this.trData.switch = (sessionStorage.getItem("isSwitch")) === 'true';
        this.trData.status = sessionStorage.getItem("isStatus")
        this.displaySessionLabel = true;
      }
    }
    else {
      this.displaySessionLabel = false;
    }
  }

  enabledRTC() {
    var that = this;
    setTimeout(function (this) {

      sessionStorage.setItem("isSwitch", "" + that.trData.switch);
      that.configHomeService.trData.switch = that.trData.switch
    }, 100)
  }

  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();

    if (this.breadcrumbSubscription)
      this.breadcrumbSubscription.unsubscribe();
  }
}
