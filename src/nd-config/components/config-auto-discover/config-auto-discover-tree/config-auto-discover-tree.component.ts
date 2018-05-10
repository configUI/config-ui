import { Component, OnInit } from '@angular/core';
import { TreeNode, MenuItem, SelectItem } from 'primeng/primeng';
import { Http, Response } from '@angular/http';

import { ImmutableArray } from '../../../utils/immutable-array';
import { ConfigKeywordsService } from '../../../services/config-keywords.service';
import { ConfigUiUtility } from '../../../utils/config-utility';
import { AutoDiscoverTreeData, AutoDiscoverData } from '../../../containers/auto-discover-data';
import { ConfigUtilityService } from '../../../services/config-utility.service';
import { ConfigNdAgentService } from '../../../services/config-nd-agent.service';
import { ProfileData } from '../../../containers/profile-data';
import { ConfigProfileService } from '../../../services/config-profile.service';
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
    selectProfileDialog: boolean = false;
    profileListItem: SelectItem[];
    profileData: ProfileData[];
    profileId: number;
    constructor(private configNdAgentService: ConfigNdAgentService, private http: Http, private _configKeywordsService: ConfigKeywordsService, private configUtilityService: ConfigUtilityService,private configProfileService: ConfigProfileService) {
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
    
        getleftSideTreeData(data)
        {  
            this.instrFromLeftSideTree = [];
            this.selectedArr = [];
            if(data.node[0].children.length != 0)
            {
             this.leftSideTreeData = data.node;
             for(let i = 0 ; i < data.node[0].children.length; i++)
             {
                 if(data.node[0].children[i].selected == true)
                   this.selectedArr.push(data.node[0].children[i]);
             }
             this.instrFromLeftSideTree = this.selectedArr;
            }
             else
            {
                this.configUtilityService.errorMessage("Auto discover method file is empty.");
                return;
            }           
            this.configUtilityService.progressBarEmit({ flag: false, color: 'primary' });
        }

    getValuesForSelectedList() {
        this.selectedNodes = [];
        this.getSelectedUnselectedNodeInfo(this.instrFromLeftSideTree, true);
        if (this.selectedNodes.length == 0) {
            this.configUtilityService.errorMessage("At least Select a package, class or method for instrumentation");
            return; 
        }
        if(this.isNodeSelected == false)
        {
            this.configUtilityService.errorMessage("Same Package,Class and Method name already instrumented");
            return;  
        }
        
	this._configKeywordsService.getSelectedNodeInfo(this.selectedNodes, this.reqId, this.instanceFileName).subscribe(data => {
            this.rightSideTreeData = data.backendDetailList;
            this.adrFile = this.adrFile + "@" + sessionStorage.getItem("agentType");
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
            this._configKeywordsService.getAutoDiscoverSelectedTreeData(this.adrFile, this.reqId, this.instanceFileName).subscribe(data => {
                this.getleftSideTreeData(data);
                this.configUtilityService.successMessage("UnInstrumentation data Successfully");
             });

            this.instrFromRightSideTree = '';
        });
    }

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

     // This method is used to select the profile to add method monitors
     selectProfile(){
        this.getSelectedUnselectedNodeInfo(this.instrFromLeftSideTree, true);
         if(this.instrFromLeftSideTree.length == 0){
             this.configUtilityService.errorMessage("Please select at least one method to monitor");
             return;
         }
         this.selectProfileDialog = true;
         this.loadProfileList();
     }
     
     // This function is used to load the profile list
     loadProfileList() {
        this.configProfileService.getProfileList().subscribe(data => {
          let tempArray = [];
          for (let i = 0; i < data.length; i++) {
            if (+data[i].profileId == 1 || +data[i].profileId == 777777 || +data[i].profileId == 888888) {
              tempArray.push(data[i]);
            }
          }
    
          this.profileData = data.reverse();
          this.profileData.splice(0, 3); 
          for (let i = 0; i < tempArray.length; i++) {
            this.profileData.push(tempArray[i]);
          }

          this.getAgentSpecificProfiles(sessionStorage.getItem("agentType"));
        });
      }

    /** This function is called to show specific agent profile in Copy profile dropDown*/
    getAgentSpecificProfiles(agentType) {
    this.profileListItem = [];
    let arr = []; //This variable is used to sort Profiles
    for (let i = 0; i < this.profileData.length; i++) {
      arr.push(this.profileData[i].profileName);
    }
    arr.sort();
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < this.profileData.length; j++) {
        if (agentType == "Java" && this.profileData[j].agent == "Java" || this.profileData[j].agent == "-") {
          if (this.profileData[j].profileName == arr[i]) {
            this.profileListItem.push({ label: arr[i], value: this.profileData[j].profileId });
          }
        }
        else if (agentType == "Dot Net" && this.profileData[j].agent == "Dot Net" || this.profileData[j].agent == "-") {
          if (this.profileData[j].profileName == arr[i]) {
            this.profileListItem.push({ label: arr[i], value: this.profileData[j].profileId });
          }
        }
        else if (agentType == "NodeJS" && this.profileData[j].agent == "NodeJS" || this.profileData[j].agent == "-") {
          if (this.profileData[j].profileName == arr[i]) {
            this.profileListItem.push({ label: arr[i], value: this.profileData[j].profileId });
          }
        }
      }
    }
  }

     // This method will save the selected methods for method monitoring
     saveMethodMonitorForSelectedProfile(){
        this.selectProfileDialog = false;
        this._configKeywordsService.getFqm(this.selectedNodes, this.reqId).subscribe(data => {console.log(" == " )});
     }
}
