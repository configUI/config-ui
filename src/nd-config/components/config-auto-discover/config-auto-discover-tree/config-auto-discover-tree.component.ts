import { Component, OnInit } from '@angular/core';
import { TreeNode, MenuItem } from 'primeng/primeng';
import { Http, Response } from '@angular/http';

import { ImmutableArray } from '../../../utils/immutable-array';
import { ConfigKeywordsService } from '../../../services/config-keywords.service';
import { ConfigUiUtility } from '../../../utils/config-utility';
import { AutoDiscoverTreeData, AutoDiscoverData } from '../../../containers/auto-discover-data';
import { ConfigUtilityService } from '../../../services/config-utility.service';
import { ConfigNdAgentService } from '../../../services/config-nd-agent.service';

@Component({
    selector: 'app-config-auto-discover-tree',
    templateUrl: './config-auto-discover-tree.component.html',
    styleUrls: ['./config-auto-discover-tree.component.css']
})
export class ConfigAutoDiscoverTreeComponent implements OnInit {

    profileXMLFileList: any[];
    selectedXMLFile: string;
    leftSideTreeData: any[] = [];
    rightSideTreeData: any[] = [];
    selectedNodes: AutoDiscoverTreeData[];
    instrfileName: string;

    //Auto discover data details
    autoDiscoverDetail: AutoDiscoverData;

    adrFile: any;
    instanceFileName: string;

    saveCheck: boolean = false;

    instrFromLeftSideTree: string;
    instrFromRightSideTree: string;
    constructor(private configNdAgentService: ConfigNdAgentService, private http: Http, private _configKeywordsService: ConfigKeywordsService, private configUtilityService: ConfigUtilityService) {
        this.leftSideTreeData = [];
        this.adrFile = sessionStorage.getItem("adrFile");
        let temp = this.adrFile.split(".adr")
        this.instanceFileName = temp[0];
        this._configKeywordsService.getAutoDiscoverTreeData(this.adrFile).subscribe(data => {
            this.leftSideTreeData = data.node;
            this.configUtilityService.progressBarEmit({ flag: false, color: 'primary' });
        });
        this.autoDiscoverDetail = new AutoDiscoverData();
        this.autoDiscoverDetail.agents = this.adrFile;

    }

    createDropDown() {
        this._configKeywordsService.getInstrumentationProfileXMLFileList().subscribe(data => {
            this.profileXMLFileList = ConfigUiUtility.createDropdown(data);
        });
    }

    // Save Instrumentation File 
    saveInstrumentationFile() {
        if (this.instrfileName == "" || this.instrfileName == null) {
            this.configUtilityService.errorMessage("Provide a file name to save it");
            return;
        }
        this._configKeywordsService.saveInsrumentationFileInXMLFormat(this.instrfileName).subscribe(data =>
            console.log(data));
        this.configUtilityService.successMessage("Saved successfully");
    }
    ngOnInit() {

    }


    nodeExpand(event) {
        if (event.node) {
            let nodeInfo = [event.node.type, event.node.label, event.node.parentPackageNode, event.node.parentClassNode];
            this._configKeywordsService.getClassDiscoverTreeData(nodeInfo).subscribe(data => event.node.children = data.node);
        }
    }


    getValuesForSelectedList() {
        this.selectedNodes = [];
        this.getSelectedUnselectedNodeInfo(this.instrFromLeftSideTree, true);
        if (this.selectedNodes.length == 0) {
            this.configUtilityService.errorMessage("At least Select a package, class or method for instrumentation");
            return;
        }

        this._configKeywordsService.getSelectedNodeInfo(this.selectedNodes).subscribe(data => {
            this.rightSideTreeData = data.backendDetailList;
            this.configUtilityService.successMessage("Instrumentation data Successfully");
        });
    }

    removeValuesFromSelectedList() {
        this.selectedNodes = [];
        // this.rightSideTreeData = [];
        this.getUnselectedNodeInfo(this.rightSideTreeData, true);
        if (this.selectedNodes.length == 0) {
            this.configUtilityService.errorMessage("At least Select a package, class or method for unInstrumentation");
            return;
        }
        this._configKeywordsService.getUninstrumentaionTreeData(this.selectedNodes).subscribe(data => {

            this.rightSideTreeData = data.backendDetailList;
            this.configUtilityService.successMessage("UnInstrumentation data Successfully");
        });
    }

    getSelectedUnselectedNodeInfo(selectedNode, isTrue) {
        let nodeInfo = new AutoDiscoverTreeData();
        this.selectedNodes = [];
        for (let i = 0; i < selectedNode.length; i++) {
            if (selectedNode[i]["type"] == "package") {
                nodeInfo = new AutoDiscoverTreeData();
                nodeInfo.packageName = selectedNode[i]["label"];
                this.selectedNodes = ImmutableArray.push(this.selectedNodes, nodeInfo)
            }
            if (selectedNode[i]["type"] == "class") {
                nodeInfo = new AutoDiscoverTreeData();
                nodeInfo.packageName = selectedNode[i]["parentPackageNode"];
                nodeInfo.className = selectedNode[i]["label"];
                this.selectedNodes = ImmutableArray.push(this.selectedNodes, nodeInfo)
            }
            if (selectedNode[i]["type"] == "method") {
                nodeInfo = new AutoDiscoverTreeData();
                nodeInfo.packageName = selectedNode[i]["parentPackageNode"];
                nodeInfo.className = selectedNode[i]["parentClassNode"];
                nodeInfo.methodName = selectedNode[i]["label"];
                this.selectedNodes = ImmutableArray.push(this.selectedNodes, nodeInfo)
            }
        }
    }

      onNodeSelect(event) {
        event.node["selected"] = true;
        event.node["partialSelected"] = false;
    }

    onNodeUnSelect(event) {
        event.node["selected"] = false;
        event.node["partialSelected"] = false;
    }

    getUnselectedNodeInfo(tree, isTrue) {
        let nodeInfo = new AutoDiscoverTreeData();
        this.selectedNodes = [];
        for (let i = 0; i < tree.length; i++) {
            if (tree[i].selected == isTrue) {
                nodeInfo = new AutoDiscoverTreeData();
                nodeInfo.packageName = tree[i].label;
                this.selectedNodes = ImmutableArray.push(this.selectedNodes, nodeInfo)
            }
            if (tree[i].children.length > 0) {
                for (let j = 0; j < tree[i].children.length; j++) {
                    if (tree[i].children[j].selected == isTrue) {
                        nodeInfo = new AutoDiscoverTreeData();
                        // nodeInfo = {"packageName": tree[i].children[j].parentPackageNode, "className": tree[i].children[j].parentClassNode };
                        nodeInfo.packageName = tree[i].children[j].parentPackageNode;
                        nodeInfo.className = tree[i].children[j].parentClassNode;
                        this.selectedNodes = ImmutableArray.push(this.selectedNodes, nodeInfo)
                    }
                    if (tree[i].children[j].children.length > 0) {
                        for (let k = 0; k < tree[i].children[j].children.length; k++) {

                            if (tree[i].children[j].children[k].selected == isTrue) {
                                nodeInfo = new AutoDiscoverTreeData();
                                // nodeInfo = {"packageName": tree[i].children[j].children[k].parentPackageNode, "className": tree[i].children[j].children[k].parentClassNode, "mathodName": tree[i].children[j].children[k].label };
                                nodeInfo.packageName = tree[i].children[j].children[k].parentPackageNode;
                                nodeInfo.className = tree[i].children[j].children[k].parentClassNode;
                                nodeInfo.methodName = tree[i].children[j].children[k].label;
                                this.selectedNodes = ImmutableArray.push(this.selectedNodes, nodeInfo)
                            }
                        }
                    }
                }
            }
        }
    }
}