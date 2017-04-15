import { Component, OnInit } from '@angular/core';
import {TopologyInfo} from '../../interfaces/topology-info';
import {ConfigTopologyService} from '../../services/config-topology.service';
@Component({
  selector: 'app-config-topology-list',
  templateUrl: './config-topology-list.component.html',
  styleUrls: ['./config-topology-list.component.css']
})
export class ConfigTopologyListComponent implements OnInit {

  constructor(private configTopologyService: ConfigTopologyService) { }

  topologyData: TopologyInfo[];

  ngOnInit() {
    this.loadTopologyList();
  }

  loadTopologyList(){
    this.configTopologyService.getTopologyList().subscribe(data=> {
         this.topologyData = data// For temporary basis we are getting data from these keys
    });
  }

}
