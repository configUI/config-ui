import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';
import { TreeNode } from 'primeng/primeng';
import { ConfigTopologyService } from '../../services/config-topology.service';
import { TopologyInfo } from '../../interfaces/topology-info';
import * as CONS from '../../constants/config-constant';
import { Subscription } from 'rxjs/Subscription';
import { ConfigHomeService } from '../../services/config-home.service';

@Component({
  selector: 'app-config-tree',
  templateUrl: './config-tree.component.html',
  styleUrls: ['./config-tree.component.css']
})
export class ConfigTreeComponent implements OnInit {


  @Output()
  getTableData = new EventEmitter();

  constructor(private configTopologyService: ConfigTopologyService,
    private route: ActivatedRoute,
    private configHomeService: ConfigHomeService,
    private router: Router
  ) { 
    this.loadTopologyTreeData();
  }

  topologyTreeData: TopologyInfo[];
  files: TreeNode[];
  nodeId;
  nodeLabel;

  selectedFiles: TreeNode[];

  dcId: number;
  topoId: number;

  subscription: Subscription;
  enableAutoScaling: boolean = false;

  ngOnInit() {
    this.loadTopologyTreeData();
    // this.loadEnableAutoScaling();
  }

 /*  loadEnableAutoScaling() {
    this.configHomeService.getMainData()
      .subscribe(data => {
        this.enableAutoScaling = data.enableAutoScaling;
      }
     );
  } */

  /*
  * Here request for tree where topology acts as root node gives response 
  * topology as root node and tiers as children
  * so when user clicks on topo node no need to request to sever to get all  tier childrens,
  * they are already present in tree but not visible tills its parent node topo is collapsed state.
  */

  loadTopologyTreeData(): void {

    this.route.params.subscribe((params: Params) => {
    this.dcId = params['dcId']
      this.topoId = params['topoId']
    });
    let url;

    /**below route function is always called whenever routing changes
     * SO handling the case that required service is hit only when url contains 'tree-main' in the url.
     * 
     */
    this.subscription = this.router.events.filter(event => event instanceof NavigationEnd).subscribe(event => {
      url = event["url"];
      let arr = url.split("/");
      if (arr.indexOf("tree-main") != -1) {

        if (arr.indexOf("topology") != -1) {
          this.configTopologyService.getTopologyStructure(this.topoId).subscribe(data => {
            this.createTreeData(data);
          })
        }
        else {
          this.configTopologyService.getTopologyTreeDetail(this.dcId).subscribe(data => {
            this.createTreeData(data);
          })
        }
      }
    })
  }

  /*
   * This function is called when user expands any node
   */

  loadNode(event) {
    console.log("ConfigTreeComponent", "constructor", "event.node", event.node);
    if (event.node.data == "Topology") {
      let data = { 'currentEntity': CONS.TOPOLOGY.TOPOLOGY, 'nodeId': event.node.id, nodeLabel: event.node.label }
      this.nodeId = event.node.id;
      this.nodeLabel = event.node.label;
      this.getTableData.emit({ data })
    }
    else if (this.enableAutoScaling && event.node.data == "Tier") {
      if (event.node.leaf != true) {
        this.configTopologyService.getTierTreeDetail(event.node.id, event.node.profileId).subscribe(nodes => this.createChildTreeData(nodes, event));
        let data = { 'currentEntity': CONS.TOPOLOGY.TIER, 'nodeId': event.node.id, nodeLabel: event.node.label }
        this.getTableData.emit({ data })
      }
    }
    else if (this.enableAutoScaling && event.node.data == "Server") {
      this.configTopologyService.getServerTreeDetail(event.node.id, event.node.profileId).subscribe(nodes => this.createChildTreeData(nodes, event));
      let data = { 'currentEntity': CONS.TOPOLOGY.SERVER, 'nodeId': event.node.id, nodeLabel: event.node.label }
      this.getTableData.emit({ data })
    }
  }

  /**This method is using for Add Image on Parent like Topology/Tier */
  createTreeData(data) {
    for (let i in data) {
      let node: TreeNode = data[i];
      this.addNodeInImage(node);
      node.styleClass = "node-class";

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
      TOPOLOGY: 'ndegui-topology-1',
      TIER: 'ndegui-tier',
      SERVER: 'ndegui-server',
      INSTANCE: 'ndegui-instance'
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

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /** To show and hide server(s) and instance(s) */
  showServerInstance() {
    for (let i = 0; i < this.files.length; i++) {
      if (!this.enableAutoScaling && this.files[i].children) {
        for (let j = 0; j < this.files[i].children.length; j++) {
          if(this.files[i].children[j].children)
          this.files[i].children[j].children = [];
        }
      }
    }
    if(this.nodeId != undefined){
    let data = { 'currentEntity': CONS.TOPOLOGY.TOPOLOGY, 'nodeId': this.nodeId, nodeLabel: this.nodeLabel}
      this.getTableData.emit({ data })
    }
  }


}
