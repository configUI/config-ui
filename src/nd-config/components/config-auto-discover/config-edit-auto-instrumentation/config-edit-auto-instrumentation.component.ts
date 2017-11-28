import { Component, OnInit } from '@angular/core';
import { TreeNode, MenuItem } from 'primeng/primeng';
import { Http, Response } from '@angular/http';
import { ImmutableArray } from '../../../utils/immutable-array';
import { ConfigKeywordsService } from '../../../services/config-keywords.service';
import { ConfigUiUtility } from '../../../utils/config-utility';
import { AutoDiscoverTreeData, AutoDiscoverData } from '../../../containers/auto-discover-data';
import { ConfigUtilityService } from '../../../services/config-utility.service';
import { ConfigNdAgentService } from '../../../services/config-nd-agent.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
    selector: 'config-edit-auto-instrumentation',
    templateUrl: './config-edit-auto-instrumentation.component.html',
    styleUrls: ['./config-edit-auto-instrumentation.component.css']
})
export class ConfigEditAutoInstrumentationComponent implements OnInit {

    selectedFiles: any[];
    selectedXMLFile: string;
    leftSideTreeData: any[] = [];
    rightSideTreeData: any[] = [];
    selectedNodes: AutoDiscoverTreeData[];
    instrfileName: string;

    txtFile: any;
    pckName: string = '';
    saveCheck: boolean = false;
    sessionFileName: string;
    instrFromLeftSideTree: string;
    instrFromRightSideTree: string;
    reqId: string;
    constructor(  private router: Router, private route: ActivatedRoute,private configNdAgentService: ConfigNdAgentService, private http: Http, private _configKeywordsService: ConfigKeywordsService, private configUtilityService: ConfigUtilityService) {
        this.leftSideTreeData = [];
        this.reqId = sessionStorage.getItem("configRequestID");
        var userName = sessionStorage.getItem("sesLoginName") == null ? "netstorm" : sessionStorage.getItem("sesLoginName");

        if (this.reqId == undefined) {
            let timestamp = new Date().getTime();
            let configRequestId = `${userName}-${Math.random()}-${timestamp}`;
            sessionStorage.setItem('configRequestID', configRequestId);
        }
            //Getting aplication's Id from URL
            this.route.params.subscribe((params: Params) => {
                this.sessionFileName = params['sessionFileName'];
           });
        /**
         * this service get Removed package and put in left side tree
         */
        this._configKeywordsService.getRemovedPackageData(this.sessionFileName, this.reqId).subscribe(data => {
                this.leftSideTreeData = data.node;
             this.configUtilityService.progressBarEmit({ flag: false, color: 'primary' });
        });

     /**
     * this service get instrumented data and put in Right side tree
     */
        this._configKeywordsService.getAutoInstrumentatedData(this.sessionFileName, this.reqId).subscribe(data => {
         
            this.rightSideTreeData = data.backendDetailList;
            this.configUtilityService.progressBarEmit({ flag: false, color: 'primary' });
        });
    }

    // Save Instrumentation File 
    saveInstrumentationFile() {
        if (this.instrfileName == "" || this.instrfileName == null) {
            this.configUtilityService.errorMessage("Provide a file name to save it");
            return;
        }
        if (this.rightSideTreeData.length == 0) {
            this.configUtilityService.errorMessage("At least Select a package, class or method for instrumentation");
            return;
        }
        this._configKeywordsService.saveInsrumentationFileXMLFormat(this.instrfileName, this.reqId).subscribe(data =>
            console.log(data));
        this.configUtilityService.successMessage("Saved successfully");

        this.clearFields();
    }

    clearFields() {
        this.instrfileName = "";
        this.rightSideTreeData = [];
    }

    ngOnInit() {}

    nodeExpand(event) {
        if (event.node.children.length == 0) {
            let nodeInfo = [event.node.type, event.node.label, event.node.parentPackageNode, event.node.parentClassNode];
            this._configKeywordsService.getClassMethodTreeData(nodeInfo, this.reqId).subscribe(data => {
                    if(!(data.node[0]["label"] == null))
                    {
                        event.node.children = data.node
                    }
                    else
                    event.node["leaf"] = true;
                }
           
            );
        }
    }

    getValuesForSelectedList() {
        this.selectedNodes = [];
        this.getSelectedUnselectedNodeInfo(this.instrFromLeftSideTree, true);
        if (this.selectedNodes.length == 0) {
            this.configUtilityService.errorMessage("At least Select a package, class or method for instrumentation");
            return;
        }

        this._configKeywordsService.getSelectedInstrumentaionInfo(this.selectedNodes, this.reqId).subscribe(data => {
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
        this._configKeywordsService.getUninstrumentaionData(this.selectedNodes, this.reqId).subscribe(data => {
            this.rightSideTreeData = data.backendDetailList;
            this.instrFromRightSideTree = '';
            this.configUtilityService.successMessage("UnInstrumentation data Successfully");
        });
    }

    getSelectedUnselectedNodeInfo(selectedNode, isTrue) {
        let nodeInfo = new AutoDiscoverTreeData();
        this.selectedNodes = [];
        if (selectedNode != undefined) {
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
}
