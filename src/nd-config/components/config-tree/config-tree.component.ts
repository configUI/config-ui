import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { TreeNode } from 'primeng/primeng';
import { ConfigTopologyService } from '../../services/config-topology.service';
import { TopologyInfo } from '../../interfaces/topology-info';
import * as CONS from '../../constants/config-constant';

@Component({
  selector: 'app-config-tree',
  templateUrl: './config-tree.component.html',
  styleUrls: ['./config-tree.component.css']
})
export class ConfigTreeComponent implements OnInit {


  @Output()
  getTableData = new EventEmitter();

  constructor(private configTopologyService: ConfigTopologyService, private route: ActivatedRoute) { }

  topologyTreeData: TopologyInfo[];
  files: TreeNode[];

  selectedFiles: TreeNode[];

  dcId: number;

  ngOnInit() {
    this.loadTopologyTreeData();
  }
  /*
  * Here request for tree where topology acts as root node gives response 
  * topology as root node and tiers as children
  * so when user clicks on topo node no nedd to request to sever to get all  tier childrens,
  * they are already present in tree but not visible tills its parent node topo is collapsed state.
  */

  loadTopologyTreeData(): void {

    this.route.params.subscribe((params: Params) => this.dcId = params['profileId']);
    this.route.params.subscribe((params: Params) => {
      this.configTopologyService.getTopologyTreeDetail(+params['dcId']).subscribe(data => {
        this.createTreeData(data);
      })
    });
  }

  /*
   * This function is called when user expands any node
   */

  loadNode(event) {
    if (event.node.data == "Topology") {
      let data = { 'currentEntity': CONS.TOPOLOGY.TOPOLOGY, 'nodeId': event.node.id }
      this.getTableData.emit({ data })
    }
    else if (event.node.data == "Tier") {
      this.configTopologyService.getTierTreeDetail(event.node.id, event.node.profileId).subscribe(nodes => this.createChildTreeData(nodes, event));
      let data = { 'currentEntity': CONS.TOPOLOGY.TIER, 'nodeId': event.node.id }
      this.getTableData.emit({ data })
    }
    else if (event.node.data == "Server") {
      this.configTopologyService.getServerTreeDetail(event.node.id, event.node.profileId).subscribe(nodes => this.createChildTreeData(nodes, event));
      let data = { 'currentEntity': CONS.TOPOLOGY.SERVER, 'nodeId': event.node.id }
      this.getTableData.emit({ data })
    }
  }

  /**This method is using for Add Image on Parent like Topology/Tier */
  createTreeData(data) {
    for (let i in data) {
      let node: TreeNode = data[i];
      this.addNodeInImage(node);

      for (let j = 0; j < node.children.length; j++) {
        let childNode: TreeNode = node.children[j];
        this.addNodeInImage(childNode);
      }
    }
    this.files = data;
  }

  /**This method is using for Add Image on Children like Server/Instance */
  createChildTreeData(data, event) {
    for (let i in data) {
      let node: TreeNode = data[i];
      this.addNodeInImage(node);
    }
    event.node.children = data;
  }

  /**
   * This method is used to set node icon 
   */
  addNodeInImage(node: TreeNode) {

    let NODE_NAME = {
      TOPOLOGY: 'Topology',
      TIER: 'Tier',
      SERVER: 'Server',
      INSTANCE: 'Instance'
    }

    let NODE_IMAGE = {
      TOPOLOGY: 'tree-icon ndegui-topology-1',
      TIER: 'tree-icon ndegui-tier',
      SERVER: 'tree-icon ndegui-server',
      INSTANCE: 'tree-icon ndegui-instance'
    }

    if (node.data == NODE_NAME.TOPOLOGY) {
      node.expandedIcon = NODE_IMAGE.TOPOLOGY;
      node.collapsedIcon = NODE_IMAGE.TOPOLOGY;
    }
    else if (node.data == NODE_NAME.TIER) {
      node.expandedIcon = NODE_IMAGE.TIER;
      node.collapsedIcon = NODE_IMAGE.TIER;
    }
    else if (node.data == NODE_NAME.SERVER) {
      node.expandedIcon = NODE_IMAGE.SERVER;
      node.collapsedIcon = NODE_IMAGE.SERVER;
    }
    else if (node.data == NODE_NAME.INSTANCE) {
      node.expandedIcon = NODE_IMAGE.INSTANCE;
      node.collapsedIcon = NODE_IMAGE.INSTANCE;
    }
    else {
      console.warn("No Node data found ", node.data);
    }
  }
}
