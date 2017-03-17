import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';

import { ConfigTopologyService } from '../../services/config-topology.service';
import { TopologyInfo } from '../../interfaces/topology-info';

@Component({
  selector: 'app-config-tree-detail',
  templateUrl: './config-tree-detail.component.html',
  styleUrls: ['./config-tree-detail.component.css']
})
export class ConfigTreeDetailComponent implements OnInit {

  constructor(private configTopologyService: ConfigTopologyService, private route: ActivatedRoute) { }

  topologyData: TopologyInfo[];

  ngOnInit() {
    this.loadTopologyData();
  }

  loadTopologyData(): void{
    this.route.params.switchMap((params: Params)=> this.configTopologyService.getTopologyDetail(+params['dcId'])).subscribe(data=> this.topologyData = data);
  }
}
