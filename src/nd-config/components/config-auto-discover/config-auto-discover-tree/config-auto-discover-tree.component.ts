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
import { ConfigHomeService } from '../../../services/config-home.service';

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
    methodMonitorMap: any;
    calledFor: any;
    fqm: any;
    profileIdList: number[];
    constructor(private configNdAgentService: ConfigNdAgentService, private http: Http, private _configKeywordsService: ConfigKeywordsService, 
        private configUtilityService: ConfigUtilityService, private configProfileService: ConfigProfileService, 
        private configHomeService: ConfigHomeService) {
        this.loadAutoDiscoverData();
    }

    loadAutoDiscoverData(){
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
        this.configHomeService.getBTMethodDataFromAD(false);
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

    // This method is used to select the profile to add method monitors
    selectProfile(){
        if(this.instrFromLeftSideTree.length == 0){
            this.configUtilityService.errorMessage("Please select at least one method to monitor");
            return;
        }
        this.getSelectedUnselectedNodeInfo(this.instrFromLeftSideTree, true);
        this.selectProfileDialog = true;
        this.loadProfileList();
    }

    // This function is used to load the profile list
    loadProfileList() {
        this.configProfileService.getProfileList().subscribe(data => {
            this.profileData = data;
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
                if (agentType == "Java" && this.profileData[j].agent == "Java" && this.profileData[j].profileId != 1) {
                    if (this.profileData[j].profileName == arr[i]) {
                        this.profileListItem.push({ label: arr[i], value: this.profileData[j].profileId });
                    }
                }
                else if (agentType == "DotNet" && this.profileData[j].agent == "Dot Net" && this.profileData[j].profileId != 888888) {
                    if (this.profileData[j].profileName == arr[i]) {
                        this.profileListItem.push({ label: arr[i], value: this.profileData[j].profileId });
                    }
                }
                else if (agentType == "NodeJS" && this.profileData[j].agent == "NodeJS" && this.profileData[j].profileId != 777777) {
                    if (this.profileData[j].profileName == arr[i]) {
                        this.profileListItem.push({ label: arr[i], value: this.profileData[j].profileId });
                    }
                }
            }
        }
    }
    //This method is used to get message of FQM valid or not and a map containing the data selected from AD
    createMethodAndValidateFQM() {
        this.calledFor = "methodMonitor";
        this.getSelectedUnselectedNodeInfo(this.instrFromLeftSideTree, true);
        this._configKeywordsService.createMethodMonitorAndValidateFQMFromAD(this.selectedNodes, this.reqId, this.instanceFileName)
            .subscribe(data => {
                var msg = data.message.status;
                var datacontent = data.content;
                if (msg == 'NO') {
                    this.configUtilityService.errorMessage("FQM(s) are not valid");
                    return;
                }
                else {
                    if (msg == 'Partial') {
                        this.configUtilityService.infoMessage("Some FQM(s) are corrupted");
                    }
                    else if (msg == 'OK') {
                        this.configUtilityService.infoMessage("Selected FQM(s) are valid");
                    }
                    this.methodMonitorMap = datacontent;
                    this.selectProfile();
                }
            });
    }

    // This method will save the selected methods for method monitoring
    saveMethodMonitorForSelectedProfile(calledFrom) {
        this.selectProfileDialog = false;
        if (calledFrom == "methodMonitor") {
            let methodMonitorFrom = 'AD';
            this._configKeywordsService.addMethodMonitorFromAutoDiscover(this.methodMonitorMap, this.profileIdList, methodMonitorFrom)
                .subscribe(data => {
                    if (data._body == "OK") {
                        this.configUtilityService.successMessage("FQM(s) are added successfully");
                    }
                    else {
                        this.configUtilityService.errorMessage("Operation failed");
                    }
                });

            this.methodMonitorMap = null;
        }
        else if (calledFrom == "methodBT") {
            this.configHomeService.loadBT(this.profileId + "#" + this.fqm);   
        }
        this.profileId = null;
        this.profileIdList = null;
    }

    reset(){
        this.loadAutoDiscoverData();
        this.rightSideTreeData = [];
    }

    createMethodBTRule() {
        this.calledFor = "methodBT";
        let fqmarr: string[] = [];
        if(this.instrFromRightSideTree != null){
            this.configUtilityService.errorMessage("Please select FQM only from the left side tree");
            return;
        }
        if (this.instrFromLeftSideTree.length == 0) {
            this.configUtilityService.errorMessage("Please select a FQM");
            return;
        }
        else if (this.instrFromLeftSideTree.length > 2) {
            this.configUtilityService.errorMessage("Please select only single FQM");
            return;
        }
        else if (this.instrFromLeftSideTree.length == 2) {
            for (let i = 0; i < this.instrFromLeftSideTree.length; i++) {
                if (this.instrFromLeftSideTree[i].type == "method") {
                    this.fqm = this.instrFromLeftSideTree[i]["parentPackageNode"] + "." + this.instrFromLeftSideTree[i]["parentClassNode"] + "." + this.instrFromLeftSideTree[i].label;
                    fqmarr.push(this.fqm);
                }
            }

            if (fqmarr.length == 2) {
                this.configUtilityService.errorMessage("Please select only single FQM");
                return;
            }
        }
        else if (this.instrFromLeftSideTree.length == 1) {
            if (this.instrFromLeftSideTree[0].type == "method") {
                this.fqm = this.instrFromLeftSideTree[0]["parentPackageNode"] + "." + this.instrFromLeftSideTree[0]["parentClassNode"] + "." + this.instrFromLeftSideTree[0].label;
            }
            else {
                this.configUtilityService.errorMessage("Please select a valid FQM");
                return;
            }
        }

        if (this.fqm) {
            var regex = /[a-zA-Z]+[a-zA-Z0-9_$\|.]+(\(([;_$\/\[a-zA-Z0-9]*)\))+[;_$\/\[a-zA-Z0-9]*/g;
            if(!regex.test(this.fqm)){
                this.configUtilityService.errorMessage("Please select a valid FQM");
                return;
            }
            this.selectProfileDialog = true;
            this.loadProfileList();
            this.instrFromLeftSideTree = [];
        }
    }
}
