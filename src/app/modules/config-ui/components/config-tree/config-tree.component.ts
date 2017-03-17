import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';

import { TreeNode } from 'primeng/primeng';

import { ConfigTopologyService } from '../../services/config-topology.service';
import { TopologyInfo } from '../../interfaces/topology-info';

@Component({
  selector: 'app-config-tree',
  templateUrl: './config-tree.component.html',
  styleUrls: ['./config-tree.component.css']
})
export class ConfigTreeComponent implements OnInit {

  constructor(private configTopologyService: ConfigTopologyService, private route: ActivatedRoute) { }

  topologyTreeData:TopologyInfo[];
  files: TreeNode[];
    
  selectedFiles: TreeNode[];

  ngOnInit() {
    this.loadTopologyTreeData();
    this.files = this.configTopologyService.getFiles();//.then(files => this.files = files);
  }

  loadTopologyTreeData(): void{
    this.route.params.switchMap((params: Params)=> this.configTopologyService.getTopologyTreeDetail(+params['dcId'])).subscribe(data=> this.topologyTreeData = data);
  }

  loadNode(event) {
        if(event.node) {
            //in a real application, make a call to a remote url to load children of the current node and add the new nodes as children
            event.node.children = this.configTopologyService.getLazyFiles();//.then(nodes => event.node.children = nodes);
        }
    }
}
