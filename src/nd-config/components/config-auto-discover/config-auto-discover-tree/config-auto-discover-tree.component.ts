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

    instrFromLeftSideTree: TreeNode[];
    instrFromRightSideTree: string;
    reqId: string;
    isAutoPerm: boolean;
    selectedArr: any[] = [];
    isNodeSelected:boolean;
    constructor(private configNdAgentService: ConfigNdAgentService, private http: Http, private _configKeywordsService: ConfigKeywordsService, private configUtilityService: ConfigUtilityService) {
        this.leftSideTreeData = [];
        this.isNodeSelected =false;
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
        let agentType = sessionStorage.getItem("agentType");
        this.adrFile = this.adrFile + "@" + agentType;
        this._configKeywordsService.getAutoDiscoverTreeData(this.adrFile, this.reqId, this.instanceFileName).subscribe(data => {
            this.getleftSideTreeData(data);
        });
        this.autoDiscoverDetail = new AutoDiscoverData();
        this.autoDiscoverDetail.agents = this.adrFile;

    }

    createDropDown() {
        this._configKeywordsService.getInstrumentationProfileXMLFileList("").subscribe(data => {
            this.profileXMLFileList = ConfigUiUtility.createDropdown(data);
        });
    }

    // Save Instrumentation File 
    saveInstrumentationFile() {
        let agentType = sessionStorage.getItem("agentType");
        if (this.instrfileName == "" || this.instrfileName == null) {
            this.configUtilityService.errorMessage("Provide a file name to save it");
            return;
        } 
        if(this.rightSideTreeData.length == 0)
        {
            this.configUtilityService.errorMessage("At least Select a package, class or method for instrumentation");
            return;
        }
        this.instrfileName = this.instrfileName + "@" + agentType;
        this._configKeywordsService.saveInsrumentationFileInXMLFormat(this.instrfileName, this.reqId, this.instanceFileName).subscribe(data =>
            console.log(data));
        this.configUtilityService.successMessage("Saved successfully");

	this.clearFields();
    }

    clearFields() {
        this.instrfileName = "";
    //    this.rightSideTreeData = [];
    }

    ngOnInit() {
	this.isAutoPerm=+sessionStorage.getItem("AutoDiscoverAccess") == 4 ? true : false;
    }

    // This method is called when user expand any particuler node
    nodeExpand(event) {
        if (event.node.children.length == 0) {
            let nodeInfo = [event.node.type, event.node.label, event.node.parentPackageNode, event.node.parentClassNode];
            this._configKeywordsService.getClassDiscoverTreeData(nodeInfo, this.reqId, this.instanceFileName).subscribe(data => 
            {
                if(data["selected"] == true)
                {
                   this.instrFromLeftSideTree.push(event.node);
                }
              
                if(!(data.node[0]["label"] == null))
                {
                    event.node.children = data.node
                    for(let i = 0 ; i < event.node.children.length; i++)
                    {
                        if(event.node.children[i].selected == true)
                        this.instrFromLeftSideTree.push(event.node.children[i]);
                    }
                 //    this.instrFromLeftSideTree = this.selectedArr;
                }
                else
                    event.node["leaf"] = true;
            });
          }
        }
    
        // This method is called for getting left side tree data
        getleftSideTreeData(data)
        {  
            this.instrFromLeftSideTree = [];
            this.selectedArr = [];
            // data.node[0] is for ALL(Root Node) node
            if(data.node[0].children.length != 0)
            {
             // assign value for showing in the left side tree                
             this.leftSideTreeData = data.node;
             for(let i = 0 ; i < data.node[0].children.length; i++)
             {
                 if(data.node[0].children[i].selected == true)
                   this.selectedArr.push(data.node[0].children[i]);
             }
             // assign selected node for showing in the left side tree
             this.instrFromLeftSideTree = this.selectedArr;
            }
             else
            {
                this.configUtilityService.errorMessage("Auto discover method file is empty.");
                return;
            }           
            this.configUtilityService.progressBarEmit({ flag: false, color: 'primary' });
        }

    // this method is calling for Instrumentation 
    getValuesForSelectedList() {
        this.selectedNodes = [];
        this.getSelectedUnselectedNodeInfo(this.instrFromLeftSideTree, true);
        if (this.selectedNodes.length == 0) {
            this.configUtilityService.errorMessage("At least Select a package, class or method for instrumentation");
            return; 
        }
        // the below condition check already has been instrumented or not
        if(this.isNodeSelected == false)
        {
            this.configUtilityService.errorMessage("Same Package,Class and Method name already instrumented");
            return;  
        }
        
	this._configKeywordsService.getSelectedNodeInfo(this.selectedNodes, this.reqId, this.instanceFileName).subscribe(data => {
            this.rightSideTreeData = data.backendDetailList;
            this.adrFile = this.adrFile + "@" + sessionStorage.getItem("agentType");
            // this service for getting selected node and showing left side tree
            this._configKeywordsService.getAutoDiscoverSelectedTreeData(this.adrFile, this.reqId, this.instanceFileName).subscribe(data => {
               this.getleftSideTreeData(data);
               this.isNodeSelected = false;
               this.configUtilityService.successMessage("Instrumentation data Successfully");
            });
           
        });
    }

    onNodeSelect()
    {
        this.isNodeSelected = true;
    }

    // this method is called for Un-instrumentation
    removeValuesFromSelectedList() {

        this.selectedNodes = [];
        if(this.rightSideTreeData.length == 0){
            this.configUtilityService.errorMessage("Instrumented data is not available to uninstrument");
            return;
        }
        this.getSelectedUnselectedNodeInfo(this.instrFromRightSideTree, true);
        if (this.selectedNodes.length == 0) {
            this.configUtilityService.errorMessage("At least Select a package, class or method for unInstrumentation");
            return;
        }
        this._configKeywordsService.getUninstrumentaionTreeData(this.selectedNodes, this.reqId, this.instanceFileName ).subscribe(data => {
           
            this.rightSideTreeData = data.backendDetailList;
            this.adrFile = this.adrFile + "@" + sessionStorage.getItem("agentType");
            // this service for getting unselected node and showing in left side tree
            this._configKeywordsService.getAutoDiscoverSelectedTreeData(this.adrFile, this.reqId, this.instanceFileName).subscribe(data => {
                this.getleftSideTreeData(data);
                this.configUtilityService.successMessage("UnInstrumentation data Successfully");
             });

            this.instrFromRightSideTree = '';
        });
    }

    // this method is used for set info about selected or unselected node
    getSelectedUnselectedNodeInfo(selectedNode, isTrue) {
        let nodeInfo = new AutoDiscoverTreeData();
        this.selectedNodes = [];
        if (selectedNode != undefined){
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
