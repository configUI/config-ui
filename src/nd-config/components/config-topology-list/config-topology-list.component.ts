import { Component, OnInit } from '@angular/core';
import { TopologyInfo } from '../../interfaces/topology-info';
import { ConfigTopologyService } from '../../services/config-topology.service';
import { ConfigApplicationService } from '../../services/config-application.service';
import { ConfigUtilityService } from '../../services/config-utility.service';
import { Router } from '@angular/router';
import { ROUTING_PATH } from '../../constants/config-url-constant';
import { ConfirmationService } from 'primeng/components/common/confirmationservice';
import { ConfigHomeService } from '../../services/config-home.service'
@Component({
  selector: 'app-config-topology-list',
  templateUrl: './config-topology-list.component.html',
  styleUrls: ['./config-topology-list.component.css']
})
export class ConfigTopologyListComponent implements OnInit {

  constructor(private configTopologyService: ConfigTopologyService, private configHomeService: ConfigHomeService, private configApplicationService: ConfigApplicationService, private router: Router, private configUtilityService: ConfigUtilityService, private confirmationService: ConfirmationService) { }

  topologyData: TopologyInfo[];
  selectedTopology: TopologyInfo[];

  ROUTING_PATH = ROUTING_PATH;
  topoPerm: boolean;
  topologyNameList = []

  ngOnInit() {
    this.topoPerm=+sessionStorage.getItem("TopologyAccess") == 4 ? true: false;
    this.configHomeService.getTopologyList().subscribe(data => {
      data = data.sort();
      this.topologyNameList = data;
      this.configApplicationService.addTopoDetails(this.topologyNameList).subscribe(data => {
        this.loadTopologyList();
      })
    })
  }

  loadTopologyList() {
    this.configTopologyService.getTopologyList().subscribe(data => {
      for (let i = 0; i < data.length; i++) {
        if (data[i]["timeStamp"] == null) {
          data[i]["timeStamp"] = "-";
        }
      }
      this.topologyData = data// For temporary basis we are getting data from these keys
    });
  }
  routeToTreemain(selectedTypeId, selectedName, type) {
    //Observable application name
    if (type == 'topology') {
      //it routes to (independent) topology screen
      this.configApplicationService.applicationNameObserver(selectedName);
      this.router.navigate([this.ROUTING_PATH + '/tree-main/topology', selectedTypeId]);
    }
    else {
      this.configApplicationService.applicationNameObserver(selectedName);
      this.router.navigate([this.ROUTING_PATH + '/tree-main', selectedTypeId]);
    }
  }

  /** To delete topology */
  deleteTopology() {
    if (!this.selectedTopology || this.selectedTopology.length < 1) {
      this.configUtilityService.errorMessage("Select topology(s) to delete")
      return;
    }
    this.confirmationService.confirm({
      message: 'Do you want to delete selected topology?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        let arrId = [];
        for (let i = 0; i < this.selectedTopology.length; i++) {
          arrId.push(this.selectedTopology[i].topoId);
        }
        let that = this;
        this.configTopologyService.deleteTopology(arrId).subscribe(data => {
          if (data.length == that.topologyData.length) {
            this.configUtilityService.errorMessage("Could not delete: Selected topology(s) may be applied to an application(s)")
          }
          else {
            this.topologyData = data;
            this.configUtilityService.infoMessage("Deleted successfully")
          }
          this.selectedTopology = [];
        })
      },
      reject: () => {

      }
    });
  }

}
