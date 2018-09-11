import { Component, OnInit } from '@angular/core';
import { MenuItem, ConfirmationService, SelectItem } from 'primeng/primeng';
import { Http, Response } from '@angular/http';
import { ImmutableArray } from '../../../utils/immutable-array';
import { ConfigKeywordsService } from '../../../services/config-keywords.service';
import { ConfigUiUtility } from '../../../utils/config-utility';
import { AutoDiscoverTreeData, AutoDiscoverData } from '../../../containers/auto-discover-data';
import { ConfigUtilityService } from '../../../services/config-utility.service';
import { ConfigNdAgentService } from '../../../services/config-nd-agent.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ProfileData } from '../../../containers/profile-data';
import { ConfigProfileService } from '../../../services/config-profile.service';
import { ConfigHomeService } from '../../../services/config-home.service';

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
    selectProfileDialog: boolean = false;
    profileListItem: SelectItem[];
    profileData: ProfileData[];
    profileId: number;
    methodMonitorMap: any;
    calledFor: any;
    fqm: any;
    profileIdList: number[];
    constructor(private confirmationService: ConfirmationService, private router: Router, private route: ActivatedRoute, private configNdAgentService: ConfigNdAgentService, private http: Http, private _configKeywordsService: ConfigKeywordsService, private configUtilityService: ConfigUtilityService, private configProfileService: ConfigProfileService, private configHomeService: ConfigHomeService) {
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
        this.configHomeService.getBTMethodDataFromAD(false);
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
        if(this.leftSideTreeData == undefined){
            this.configUtilityService.errorMessage("Data not available in Session file to instrument");
            return;
        }
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
        if(this.rightSideTreeData.length == 0){
            this.configUtilityService.errorMessage("Instrumented data is not available to uninstrument");
            return;
        }
        else if(this.rightSideTreeData[0].children.length == 0){
            this.configUtilityService.errorMessage("Instrumented data is not available to uninstrument");
            return;
        }
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

    // This method is used to select the profile to add method monitors
    selectProfile() {
        if (this.instrFromLeftSideTree.length == 0) {
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
            this.getAgentSpecificProfiles(this.agentType);
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
                else if ((agentType == "DotNet" || agentType == "Dot Net") && this.profileData[j].agent == "Dot Net" && this.profileData[j].profileId != 888888) {
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
        this._configKeywordsService.createMethodMonitorAndValidateFQMFromAI(this.selectedNodes, this.reqId)
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
                    // this.msgForFQM = msg;
                    this.selectProfile();
                }
            });
    }

    // This method will save the selected methods for method monitoring
    saveMethodMonitorForSelectedProfile(calledFrom) {
        this.selectProfileDialog = false;
        if (calledFrom == "methodMonitor") {
            let methodMonitorFrom = 'AI';
            this._configKeywordsService.addMethodMonitorFromAutoInstr(this.methodMonitorMap, this.profileIdList, methodMonitorFrom)
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

    createMethodBTRule() {
        this.calledFor = "methodBT";
        let fqmarr: string[] = [];
        if(this.instrFromRightSideTree != undefined && this.instrFromRightSideTree != ''){
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
