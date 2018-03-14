import { Component, OnInit } from '@angular/core';
import { MenuItem,ConfirmationService } from 'primeng/primeng';
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
    showSessionName: string;
    txtFile: any;
    pckName: string = '';
    saveCheck: boolean = false;
    sessionFileName: string;
    instrFromLeftSideTree: TreeNode[];
    instrFromRightSideTree: string;
    reqId: string;
    isAutoPerm: boolean;
    selectedArr:any[];
    isNodeSelected: boolean;
    sessionFileNameWithAgentType : string;
    agentType: string;
    instrfileNameWithExtension :string;
    instrfileNameWithAgentType :string;
    constructor( private confirmationService: ConfirmationService, private router: Router, private route: ActivatedRoute,private configNdAgentService: ConfigNdAgentService, private http: Http, private _configKeywordsService: ConfigKeywordsService, private configUtilityService: ConfigUtilityService) {
         this.leftSideTreeData = [];
         this.selectedArr = [];
         this.isNodeSelected =false;
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
                   var arr = this.sessionFileName.split("#");
                   this.sessionFileName = arr[0];
                   this.agentType = arr[1];
           });
        
        this.showSessionName = this.sessionFileName.split(".txt")[0];
    

     /**
     * this service get instrumented data and put in Right side tree
     */
    this.sessionFileName = this.sessionFileName + "#" + this.agentType;
        this._configKeywordsService.getAutoInstrumentatedData(this.sessionFileName, this.reqId).subscribe(data => {
         
            this.rightSideTreeData = data.backendDetailList;
             /**
         * this service get Removed package and put in left side tree
         */
        this._configKeywordsService.getRemovedPackageData(this.sessionFileName, this.reqId).subscribe(data => {
           this.leftSideTreeData = data.node;
    
           if(data.node == undefined)
           {
             this.configUtilityService.errorMessage("Instrumented and Removed method are not present in session file.");
           }
            for(let i = 0 ; i < data.node[0].children.length; i++)
            {
                if(data.node[0].children[i].selected == true)
                  this.selectedArr.push(data.node[0].children[i]);
            }
            this.instrFromLeftSideTree = this.selectedArr;
          
         this.configUtilityService.progressBarEmit({ flag: false, color: 'primary' });
        });
            this.configUtilityService.progressBarEmit({ flag: false, color: 'primary' });
        });
    }

    // Save Instrumentation File 
    saveInstrumentationFile() {
        if (this.instrfileName == "" || this.instrfileName == null) {
            this.configUtilityService.errorMessage("Provide a file name to save it");
            return;
        }
        if(this.agentType == "Java"){
            this.instrfileNameWithExtension = this.instrfileName +".xml";
         }
         else{
            this.instrfileNameWithExtension = this.instrfileName +".txt";
         }
        if (this.rightSideTreeData.length == 0) {
            this.configUtilityService.errorMessage("At least Select a package, class or method for instrumentation");
            return;
        }
        this._configKeywordsService.checkInsrumentationXMLFileExist((this.instrfileNameWithExtension), this.reqId).subscribe(data =>
        {
            this.instrfileNameWithExtension= "";   
            if(data.Status == "true")
             {
                this.confirmationService.confirm({
                    message: 'Do you want to replace the existed file?',
                    header: 'Save Confirmation',
                    icon: 'fa fa-trash',
                    accept: () => {
                      //Get Selected Applications's AppId
                      this.instrfileNameWithAgentType = this.instrfileName + "#" + this.agentType;
                      this._configKeywordsService.saveInsrumentationFileXMLFormat(this.instrfileNameWithAgentType, this.reqId).subscribe(data =>
                        {
                            this.instrfileName = "";
                            this.instrfileNameWithAgentType = "";
                            this.configUtilityService.successMessage("Saved successfully");
                        });
                    },
                    reject: () => {
                    }
                  });
             }
             else
             {
                this.instrfileNameWithAgentType = this.instrfileName + "#" + this.agentType;
                  //Get Selected Applications's AppId
                  this._configKeywordsService.saveInsrumentationFileXMLFormat(this.instrfileNameWithAgentType, this.reqId).subscribe(data =>
                    {
                        this.instrfileName = "";
                        this.instrfileNameWithAgentType = "";
                        this.configUtilityService.successMessage("Saved successfully");
                    });
             }
        });
    }
    ngOnInit() {
	this.isAutoPerm=+sessionStorage.getItem("AutoDiscoverAccess") == 4 ? true : false;
}
    nodeExpand(event) {
        if (event.node.children.length == 0) {
            let nodeInfo = [event.node.type, event.node.label, event.node.parentPackageNode, event.node.parentClassNode];
            this._configKeywordsService.getClassMethodTreeData(nodeInfo, this.reqId).subscribe(data => {
            
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
                      //  this.instrFromLeftSideTree = this.selectedArr;
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
       
        if(this.isNodeSelected == false)
        {
            this.configUtilityService.errorMessage("Same Package,Class and Method name already instrumented");
            return;  
        }
        if (this.selectedNodes.length == 0) {
            this.configUtilityService.errorMessage("At least Select a package, class or method for instrumentation");
            return;
        }

        this._configKeywordsService.getSelectedInstrumentaionInfo(this.selectedNodes, this.reqId).subscribe(data => {
            this.rightSideTreeData = data.backendDetailList;
         /**
         * this service get Removed package and put in left side tree
         */
        this._configKeywordsService.getRemovedPackageData(this.sessionFileName, this.reqId).subscribe(data => {
            this.leftSideTreeData = data.node;
            this.isNodeSelected = false;
            
            for(let i = 0 ; i < data.node[0].children.length; i++)
            {
                if(data.node[0].children[i].selected == true)
                this.selectedArr.push(data.node[0].children[i]);
            }
            this.instrFromLeftSideTree = this.selectedArr;
         this.configUtilityService.progressBarEmit({ flag: false, color: 'primary' });
        });
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
        /**
         * this service get Removed package and put in left side tree
         */
        this._configKeywordsService.getRemovedPackageData(this.sessionFileName, this.reqId).subscribe(data => {
            this.leftSideTreeData = data.node;
            this.selectedArr = [];
            for(let i = 0 ; i < data.node[0].children.length; i++)
            {
                if(data.node[0].children[i].selected == true)
                this.selectedArr.push(data.node[0].children[i]);
            }
            this.instrFromLeftSideTree = this.selectedArr;
           
         this.configUtilityService.progressBarEmit({ flag: false, color: 'primary' });
        
        });
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

    onNodeSelect()
    {
        this.isNodeSelected = true;
    }
}

export interface TreeNode {
    label?: string;
    data?: any;
    icon?: any;
    expandedIcon?: any;
    collapsedIcon?: any;
    children?: TreeNode[];
    leaf?: boolean;
    expanded?: boolean;
    type?: string;
    parent?: TreeNode;
    partialSelected?: boolean;
    styleClass?: string;
    draggable?: boolean;
    droppable?: boolean;
    selectable?: boolean;
    selected?: boolean;
}
