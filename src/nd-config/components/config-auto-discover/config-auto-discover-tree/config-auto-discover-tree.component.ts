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

    selectedFiles: any[];
    profileXMLFileList: any[];
    selectedXMLFile: string;
    leftSideTreeData: any[] = [];
    rightSideTreeData: any[] = [];
    selectedNodes: AutoDiscoverTreeData[];
    instrfileName: string;
    /**Getting application list data */

    //Auto discover data details
    autoDiscoverDetail: AutoDiscoverData;

    adrFile: any;
    instanceFileName: string;

    pckName: string = '';
    saveCheck: boolean = false;

    instrFromLeftSideTree: string;
    instrFromRightSideTree: string;
    reqId: string;
    constructor(private configNdAgentService: ConfigNdAgentService, private http: Http, private _configKeywordsService: ConfigKeywordsService, private configUtilityService: ConfigUtilityService) {
        this.leftSideTreeData = [];
        this.adrFile = sessionStorage.getItem("adrFile");
        let temp = this.adrFile.split(".adr")
        this.instanceFileName = temp[0];

        this.reqId = sessionStorage.getItem("configRequestID");
       var userName = sessionStorage.getItem("sesLoginName") == null ? "netstorm" : sessionStorage.getItem("sesLoginName"); 

        if (this.reqId == undefined) {
            console.log("reqiD ==  ")
            let timestamp = new Date().getTime();
            let configRequestId = `${userName}-${Math.random()}-${timestamp}`;
            sessionStorage.setItem('configRequestID', configRequestId);
        }

        this._configKeywordsService.getAutoDiscoverTreeData(this.adrFile, this.reqId, this.instanceFileName).subscribe(data => {
            if(data.node[0].children.length != 0)
            {
             this.leftSideTreeData = data.node;
            }
             else
            {
                this.configUtilityService.errorMessage("Auto discover method file is empty.");
                return;
            }           
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
        if(this.rightSideTreeData.length == 0)
        {
            this.configUtilityService.errorMessage("At least Select a package, class or method for instrumentation");
            return;
        }
        this._configKeywordsService.saveInsrumentationFileInXMLFormat(this.instrfileName, this.reqId, this.instanceFileName).subscribe(data =>
            console.log(data));
        this.configUtilityService.successMessage("Saved successfully");
    }
    ngOnInit() {

    }

    nodeExpand(event) {
        if (event.node.children.length == 0) {
            let nodeInfo = [event.node.type, event.node.label, event.node.parentPackageNode, event.node.parentClassNode];
            this._configKeywordsService.getClassDiscoverTreeData(nodeInfo, this.reqId, this.instanceFileName).subscribe(data => event.node.children = data.node);
        }
    }

    getValuesForSelectedList() {
        this.selectedNodes = [];
        this.getSelectedUnselectedNodeInfo(this.instrFromLeftSideTree, true);
        if (this.selectedNodes.length == 0) {
            this.configUtilityService.errorMessage("At least Select a package, class or method for instrumentation");
            return;
        }

        this._configKeywordsService.getSelectedNodeInfo(this.selectedNodes, this.reqId, this.instanceFileName).subscribe(data => {
            this.rightSideTreeData = data.backendDetailList;
            this.configUtilityService.successMessage("Instrumentation data Successfully");
        });
    }

    removeValuesFromSelectedList() {

        this.selectedNodes = [];
        this.getSelectedUnselectedNodeInfo(this.instrFromRightSideTree, true);
        if (this.selectedNodes.length == 0) {
            this.configUtilityService.errorMessage("At least Select a package, class or method for unInstrumentation");
            return;
        }
        this._configKeywordsService.getUninstrumentaionTreeData(this.selectedNodes, this.reqId, this.instanceFileName ).subscribe(data => {

            this.rightSideTreeData = data.backendDetailList;
            this.instrFromRightSideTree = '';
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
                this.selectedNodes = ImmutableArray.push(this.selectedNodes, nodeInfo);
            }
            if (selectedNode[i]["type"] == "method") {
                nodeInfo = new AutoDiscoverTreeData();
                nodeInfo.packageName = selectedNode[i]["parentPackageNode"];
                nodeInfo.className = selectedNode[i]["parentClassNode"];
                nodeInfo.methodName = selectedNode[i]["label"];
                this.selectedNodes = ImmutableArray.push(this.selectedNodes, nodeInfo);
            }
        }
    }
}