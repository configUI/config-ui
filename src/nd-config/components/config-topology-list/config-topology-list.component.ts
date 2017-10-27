import { Component, OnInit } from '@angular/core';
import {TopologyInfo} from '../../interfaces/topology-info';
import {ConfigTopologyService} from '../../services/config-topology.service';
import { ConfigApplicationService } from '../../services/config-application.service';
import { Router } from '@angular/router';
import { ROUTING_PATH } from '../../constants/config-url-constant';
@Component({
  selector: 'app-config-topology-list',
  templateUrl: './config-topology-list.component.html',
  styleUrls: ['./config-topology-list.component.css']
})
export class ConfigTopologyListComponent implements OnInit {

  constructor(private configTopologyService: ConfigTopologyService,private configApplicationService: ConfigApplicationService, private router: Router) { }

  topologyData: TopologyInfo[];
  ROUTING_PATH = ROUTING_PATH;

  ngOnInit() {
    this.loadTopologyList();
  }

  loadTopologyList(){
    this.configTopologyService.getTopologyList().subscribe(data=> {
      for(let i=0;i<data.length;i++){
        if(data[i]["timeStamp"]==null){
          data[i]["timeStamp"]="-";
        }
      }
         this.topologyData = data// For temporary basis we are getting data from these keys
    });
  }
   routeToTreemain(selectedTypeId, selectedName,type) {
    //Observable application name
    if(type == 'topology'){
      //it routes to (independent) topology screen
      this.configApplicationService.applicationNameObserver(selectedName);
      this.router.navigate([this.ROUTING_PATH + '/tree-main/topology', selectedTypeId]);
    }
    else{
      this.configApplicationService.applicationNameObserver(selectedName);
      this.router.navigate([this.ROUTING_PATH + '/tree-main', selectedTypeId]);
    }
  }

}
