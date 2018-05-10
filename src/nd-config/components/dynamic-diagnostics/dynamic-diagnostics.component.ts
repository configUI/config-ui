
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { SelectItem } from 'primeng/primeng';

import { TopologyInfo, TierInfo, InstanceInfo, AutoInstrSettings, AutoIntrDTO, DDAIInfo } from '../../interfaces/topology-info';
import * as URL from '../../constants/config-url-constant';
import { ConfigUiUtility } from '../../utils/config-utility';
import { ConfigProfileService } from '../../services/config-profile.service';
import { ConfigHomeService } from '../../services/config-home.service';
import { ConfigTopologyService } from '../../services/config-topology.service';
import { ConfigUtilityService } from '../../services/config-utility.service';
import { ConfigKeywordsService } from '../../services/config-keywords.service';

@Component({
    selector: 'app-dynamic-diagnostics',
    templateUrl: './dynamic-diagnostics.component.html',
    styleUrls: ['./dynamic-diagnostics.component.css']
})
export class DynamicDiagnosticsComponent implements OnInit {
    @Output() topologyData: EventEmitter<Object> = new EventEmitter();
    @Output() closeAIDDGui: EventEmitter<any> = new EventEmitter();
    @Output() resultAfterStart: EventEmitter<String> = new EventEmitter<String>();
    @Input() passAIDDSettings: string;
    @Input() passAIDDserverEntity: ServerInfo;
    className: string = "Dynamic Diagnostics Component";
    //  AutoInstrument Object creation
    autoInstrObj: AutoInstrSettings;
    autoInstrDto: AutoIntrDTO;
    ddAIData: DDAIInfo;

    retainchanges: boolean = true

    currentInstanceName: string;
    currentInsId: number;
    currentInsType: string;
    other: string = "";

    t_s_i_name: string = "";
    insName: string = ""; //to store tier, server and instacne name with >
    sessionName: string = "";

    //Dialog for auto instrumenatation configuration
    showInstr: boolean = false;

    serverId: any;
    // topologyData: any[];
    topologyEntity: TopologyInfo;
    tierEntity: TierInfo;
    serverEntity: ServerInfo;
    instanceEntity: InstanceInfo;
    topologyName: string;
    tierName: string;
    serverName: string;
    profileId: number;
    saveChanges: boolean = true;
    deleteFromServer: boolean = true;

    AIDDGUI: number;
    btNameList: SelectItem[];

    DDOrAIGUI: string;
    accordionTab: number;
    agentTypes: string;
    trStatus:string;
    topoName: string;
    instanceFileId: string;
    testRunNo:string;
    constructor(private configKeywordsService: ConfigKeywordsService, private configTopologyService: ConfigTopologyService, private configProfileService: ConfigProfileService, private configHomeService: ConfigHomeService, private configUtilityService: ConfigUtilityService) {
    }
    ngOnInit() {
        this.AIDDGUI = 0;
        this.DDOrAIGUI = this.passAIDDSettings[8];

        this.serverEntity = this.passAIDDserverEntity;
        this.profileId = +this.passAIDDSettings[6];
        this.serverId = this.passAIDDSettings[5];
        this.serverName = this.passAIDDSettings[4];
        this.tierName = this.passAIDDSettings[3];
        this.trStatus = this.passAIDDSettings[9];
        this.testRunNo = this.passAIDDSettings[10];

        this.loadAIDDGUI(this.passAIDDSettings[0], this.passAIDDSettings[1], this.passAIDDSettings[2]);
    }
    // this method is for AI and GUI Setting 
    loadAIDDGUI(name, id, type) {
        this.agentTypes = type;
        this.autoInstrObj = new AutoInstrSettings();
        this.autoInstrDto = new AutoIntrDTO();
        this.ddAIData = new DDAIInfo();
        if (this.DDOrAIGUI != "ND ConfigUI") {
           // this.other = this.passAIDDSettings[7];
            this.ddAIData.bt = this.passAIDDSettings[7];
        }

        let key = ['ALL'];
        this.configKeywordsService.fetchBtNames(this.profileId).subscribe(data => {
            if (data.length > 0) {
                key = key.concat(data)
                
                //Remove duplicate bt names
                key = Array.from(new Set(key))

                //Remove - from bt names array
                if(key.indexOf("-") != -1)
                    key.splice(key.indexOf("-"), 1)
            
            }
            key.push('Custom')
            this.btNameList = ConfigUiUtility.createListWithKeyValue(key, key);
            this.currentInsId = id;
            this.currentInsType = type;
            this.currentInstanceName = name;
            this.autoInstrDto.appName = sessionStorage.getItem("selectedApplicationName");
            //Getting data of settings from database if user has already saved this instance settings
            let instanceName = this.splitTierServInsName(this.currentInstanceName);
            this.insName = this.createTierServInsName(this.currentInstanceName);
            this.autoInstrDto.sessionName = instanceName;
            this.autoInstrDto.instanceId = this.currentInsId;
            this.autoInstrDto.type = this.currentInsType;

            if (this.DDOrAIGUI == "ND ConfigUI")
                this.ddAIData.sessionName = this.tierName + "_" + "ALL";
            else
                this.ddAIData.sessionName = this.tierName + "_" + this.passAIDDSettings[7];

            this.ddAIData.agentType = type;
            this.configTopologyService.getAutoInstr(this.autoInstrDto.appName, instanceName, this.sessionName).subscribe(data => {

                //Get settings from data if not null else create a new object
                if (data['_body'] != "")
                    this.splitSettings(data['_body']);
                // this.showInstr = true;
                this.configKeywordsService.getTopoName(this.testRunNo, this.passAIDDSettings[0]).subscribe(data => {
                    let arr = data["_body"].split("#");
                    this.topoName = arr[0];
                    this.instanceFileId = arr[1];
                    if(this.DDOrAIGUI == "DDR"){
                        this.currentInsId = +this.instanceFileId;
                        this.autoInstrDto.instanceId = this.currentInsId;
                } 
                })
            })
        })
    }

    /** To split the settings and assign to dialog
  * enableAutoInstrSession=1;minStackDepthAutoInstrSession=10;autoInstrTraceLevel=1;autoInstrSampleThreshold=120;
  * autoInstrPct=60;autoDeInstrPct=80;autoInstrMapSize=100000;autoInstrMaxAvgDuration=2;autoInstrClassWeight=10;
  * autoInstrSessionDuration=1800;autoInstrRetainChanges=0;blackListForDebugSession=NA;
  */
    splitSettings(data) {
        let arr = data.split("=");
        if (arr.length > 12) {
            //For enableAutoInstrSession
            if (arr[1].substring(0, arr[1].lastIndexOf(";")) == 1)
                this.autoInstrObj.enableAutoInstrSession = true;
            else
                this.autoInstrObj.enableAutoInstrSession = false;

            //For minStackDepthAutoInstrSession
            this.autoInstrObj.minStackDepthAutoInstrSession = arr[2].substring(0, arr[2].lastIndexOf(";"))

            //For autoInstrTraceLevel
            this.autoInstrObj.autoInstrTraceLevel = arr[3].substring(0, arr[3].lastIndexOf(";"))

            //For autoInstrSampleThreshold
            this.autoInstrObj.autoInstrSampleThreshold = arr[4].substring(0, arr[4].lastIndexOf(";"))

            //For autoInstrPct
            this.autoInstrObj.autoInstrPct = arr[5].substring(0, arr[5].lastIndexOf(";"))

            //For autoDeInstrPct
            this.autoInstrObj.autoDeInstrPct = arr[6].substring(0, arr[6].lastIndexOf(";"))

            //For autoInstrMapSize
            this.autoInstrObj.autoInstrMapSize = arr[7].substring(0, arr[7].lastIndexOf(";"))

            //For autoInstrMaxAvgDuration
            this.autoInstrObj.autoInstrMaxAvgDuration = arr[8].substring(0, arr[8].lastIndexOf(";"))

            //For autoInstrClassWeight
            this.autoInstrObj.autoInstrClassWeight = arr[9].substring(0, arr[9].lastIndexOf(";"))

            //For autoInstrSessionDuration
            this.autoInstrObj.autoInstrSessionDuration = arr[10].substring(0, arr[10].lastIndexOf(";"));

            //For autoInstrRetainChanges
            if (arr[11].substring(0, arr[11].lastIndexOf(";")) == 1)
                this.autoInstrObj.autoInstrRetainChanges = false;
            else
                this.autoInstrObj.autoInstrRetainChanges = true;

            //For blackListForDebugSession
            if (arr[12] == "Path")
                this.autoInstrObj.blackListForDebugSession = true;
            else
                this.autoInstrObj.blackListForDebugSession = false;

        }

    }

    //To apply auto instrumentation
    applyAutoInstr() {
        //Setting Tier>Server>Instane in instance name
        this.autoInstrDto.instanceName = this.createTierServInsName(this.currentInstanceName)

        //Merging all the settings in the format( K1=Val1;K2=Val2;K3=Val3... )
        this.autoInstrDto.configuration = this.createSettings(this.autoInstrObj);

        this.autoInstrDto.appName = sessionStorage.getItem("selectedApplicationName");
        this.sessionName = this.autoInstrDto.sessionName

        this.autoInstrDto.duration = this.autoInstrObj.autoInstrSessionDuration.toString()

        //Send Runtime Changes
        this.startAutoInstrumentation(this.autoInstrObj, this.autoInstrDto, "AI");

    }

    //When test is running the send RTC 
    startAutoInstrumentation(data, autoInstrDto, type) {
        let that = this
        console.log(this.className, "constructor", "this.configHomeService.trData.switch", this.configHomeService.trData);
        console.log(this.className, "constructor", "this.configProfileService.nodeData", this.configProfileService.nodeData);

        //if test is offline mode, return (no run time changes)
        if (this.trStatus.toLowerCase() != 'running') {
            console.log(this.className, "constructor", "No NO RUN TIme Changes");
            return;
        }
        else {
            //Getting keywords data whose values are different from default values
            let strSetting = this.getSettingForRTC(data);
            console.log(this.className, "constructor", "MAKING RUNTIME CHANGES this.nodeData", this.configProfileService.nodeData);
            const url = `${URL.RUNTIME_CHANGE_AUTO_INSTR}`;

            //Merging configuration and instance name with #
            strSetting = strSetting + "#" + this.insName;

            if (type == "AI") {
                //Saving settings in database
                let success = this.configTopologyService.sendRTCAutoInstr(url, strSetting, autoInstrDto, function (success) {
                    //Check for successful RTC connection
                    if (success == "success") {
                        that.configTopologyService.updateAIEnable(that.currentInsId, true, "AI", that.topoName).subscribe(data => {
                            that.configTopologyService.getInstanceDetail(that.serverId, that.serverEntity).subscribe(data => {
                                that.topologyData.emit(data);
                            });
                            that.configHomeService.getAIStartStopOperationValue(true);
                        })
                    }
                })
            }
            else {
                this.configTopologyService.applyDDAI(data, this.currentInsId).subscribe(res => {
                    //Check for successful RTC connection
                    if (res["_body"].includes("result=Ok")) {
                        this.configUtilityService.infoMessage("Auto Instrumentation started");
                        this.resultAfterStart.emit("Auto Instrumentation started");
                        that.configTopologyService.updateAIEnable(that.currentInsId, true, "DD", this.topoName).subscribe(data => {
                            that.configTopologyService.getInstanceDetail(that.serverId, that.serverEntity).subscribe(data => {
                                that.topologyData.emit(data);
                            });
                            that.configHomeService.getAIStartStopOperationValue(true);
                        })
                    }
                    else {
                        var msg = res["_body"].toString();
                        this.resultAfterStart.emit("Could not start:" + msg.substring(msg.lastIndexOf('Error') + 5, msg.length));
                        this.configUtilityService.errorMessage("Could not start:" + msg.substring(msg.lastIndexOf('Error') + 5, msg.length))
                        this.closeAIDDGui.emit(false);
                        return
                    }
                })
            }
        }
    }

    applyDDAI() {

        // this.ddAIData.sessionName = this.splitTierServInsName(this.currentInstanceName)

        //Assigning - to cinfiguration as there is no need to add these settings in database
        this.autoInstrDto.configuration = "-"
        this.ddAIData.tier = this.tierName
        this.ddAIData.server = this.serverName
        this.ddAIData.instance = this.currentInstanceName
        this.ddAIData.testRun = +sessionStorage.getItem("isTrNumber");
        this.autoInstrDto.appName = sessionStorage.getItem("selectedApplicationName");
        this.sessionName = this.autoInstrDto.sessionName
        if (this.ddAIData.bt == 'Custom') {
            this.ddAIData.bt = this.other
        }
        if (this.retainchanges == true)
            this.ddAIData.retainchanges = 0
        else
            this.ddAIData.retainchanges = 1

        if (this.saveChanges == true)
            this.ddAIData.saveAppliedChanges = 1
        else
            this.ddAIData.saveAppliedChanges = 0

        if (this.deleteFromServer == true)
            this.ddAIData.deleteFromServer = 1
        else
            this.ddAIData.deleteFromServer = 0

        this.autoInstrDto.duration = this.ddAIData.duration.toString()

        //Send Runtime Changes
        this.startAutoInstrumentation(this.ddAIData, this.autoInstrDto, "DD")
    }

    //Reset the values of auto instrumentation settings to default
    resetToDefault() {
        this.autoInstrObj = new AutoInstrSettings();
        this.autoInstrDto = new AutoIntrDTO();
        this.ddAIData = new DDAIInfo();
        this.autoInstrDto.sessionName = this.t_s_i_name;
        
        if (this.DDOrAIGUI != "ND ConfigUI")
        {
         this.ddAIData.bt = this.passAIDDSettings[7];
         this.ddAIData.sessionName = this.tierName + "_" + this.passAIDDSettings[7];
        }
        else
          this.ddAIData.sessionName = this.tierName + "_" + this.ddAIData.bt;
    }

    // Create Tier_Server_Instance name
    splitTierServInsName(instanceName) {
        this.t_s_i_name = this.tierName + "_" + this.serverName + "_" + instanceName
        this.sessionName = this.t_s_i_name
        return this.t_s_i_name;
    }

    // Create Tier>Server>Instance name
    createTierServInsName(instanceName) {
        let name = this.tierName + ">" + this.serverName + ">" + instanceName
        return name;
    }


    //Create auto instrumentation settings by merging them
    createSettings(data) {
        let setting;
        if (data.autoInstrRetainChanges == true) {
            if (data.blackListForDebugSession == true)
                setting = "enableAutoInstrSession=1;minStackDepthAutoInstrSession=" + data.minStackDepthAutoInstrSession
                    + ";autoInstrTraceLevel=" + data.autoInstrTraceLevel + ";autoInstrSampleThreshold=" + data.autoInstrSampleThreshold
                    + ";autoInstrPct=" + data.autoInstrPct + ";autoDeInstrPct=" + data.autoDeInstrPct + ";autoInstrMapSize=" + data.autoInstrMapSize
                    + ";autoInstrMaxAvgDuration=" + data.autoInstrMaxAvgDuration + ";autoInstrClassWeight=" + data.autoInstrClassWeight
                    + ";autoInstrSessionDuration=" + data.autoInstrSessionDuration + ";autoInstrRetainChanges=0;blackListForDebugSession=Path";
            else
                setting = "enableAutoInstrSession=1;minStackDepthAutoInstrSession=" + data.minStackDepthAutoInstrSession
                    + ";autoInstrTraceLevel=" + data.autoInstrTraceLevel + ";autoInstrSampleThreshold=" + data.autoInstrSampleThreshold
                    + ";autoInstrPct=" + data.autoInstrPct + ";autoDeInstrPct=" + data.autoDeInstrPct + ";autoInstrMapSize=" + data.autoInstrMapSize
                    + ";autoInstrMaxAvgDuration=" + data.autoInstrMaxAvgDuration + ";autoInstrClassWeight=" + data.autoInstrClassWeight
                    + ";autoInstrSessionDuration=" + data.autoInstrSessionDuration + ";autoInstrRetainChanges=0";
        }
        else {
            if (data.blackListForDebugSession == true)
                setting = "enableAutoInstrSession=1;minStackDepthAutoInstrSession=" + data.minStackDepthAutoInstrSession
                    + ";autoInstrTraceLevel=" + data.autoInstrTraceLevel + ";autoInstrSampleThreshold=" + data.autoInstrSampleThreshold
                    + ";autoInstrPct=" + data.autoInstrPct + ";autoDeInstrPct=" + data.autoDeInstrPct + ";autoInstrMapSize=" + data.autoInstrMapSize
                    + ";autoInstrMaxAvgDuration=" + data.autoInstrMaxAvgDuration + ";autoInstrClassWeight=" + data.autoInstrClassWeight
                    + ";autoInstrSessionDuration=" + data.autoInstrSessionDuration + ";autoInstrRetainChanges=1;blackListForDebugSession=Path";
            else
                setting = "enableAutoInstrSession=1;minStackDepthAutoInstrSession=" + data.minStackDepthAutoInstrSession
                    + ";autoInstrTraceLevel=" + data.autoInstrTraceLevel + ";autoInstrSampleThreshold=" + data.autoInstrSampleThreshold
                    + ";autoInstrPct=" + data.autoInstrPct + ";autoDeInstrPct=" + data.autoDeInstrPct + ";autoInstrMapSize=" + data.autoInstrMapSize
                    + ";autoInstrMaxAvgDuration=" + data.autoInstrMaxAvgDuration + ";autoInstrClassWeight=" + data.autoInstrClassWeight
                    + ";autoInstrSessionDuration=" + data.autoInstrSessionDuration + ";autoInstrRetainChanges=1";

        }
        return setting;

    }



    //Getting the settings value which are different from default values
    getSettingForRTC(data) {
        let strSetting = "";
        //Storing enableAutoInstrSession keyword value as it will always be different from default value i.e., 0
        strSetting = "enableAutoInstrSession=1%20" + this.sessionName;

        //Comparing all the setting's value with their default value, if they dont match then append in strSetting variable
        if (data.minStackDepthAutoInstrSession != 10)
            strSetting = strSetting + ";minStackDepthAutoInstrSession=" + data.minStackDepthAutoInstrSession

        if (data.autoInstrTraceLevel != 1)
            strSetting = strSetting + ";autoInstrTraceLevel=" + data.autoInstrTraceLevel

        if (data.autoInstrSampleThreshold != 120)
            strSetting = strSetting + ";autoInstrSampleThreshold=" + data.autoInstrSampleThreshold

        if (data.autoInstrPct != 60)
            strSetting = strSetting + ";autoInstrPct=" + data.autoInstrPct

        if (data.autoDeInstrPct != 80)
            strSetting = strSetting + ";autoDeInstrPct=" + data.autoDeInstrPct

        if (data.autoInstrMapSize != 100000)
            strSetting = strSetting + ";autoInstrMapSize=" + data.autoInstrMapSize

        if (data.autoInstrMaxAvgDuration != 2)
            strSetting = strSetting + ";autoInstrMaxAvgDuration=" + data.autoInstrMaxAvgDuration

        if (data.autoInstrClassWeight != 10)
            strSetting = strSetting + ";autoInstrClassWeight=" + data.autoInstrClassWeight

        if (data.autoInstrSessionDuration != 1800)
            strSetting = strSetting + ";autoInstrSessionDuration=" + data.autoInstrSessionDuration

        if (data.autoInstrRetainChanges != true)
            strSetting = strSetting + ";autoInstrRetainChanges=1"

        if (data.blackListForDebugSession == true)
            strSetting = strSetting + ";blackListForDebugSession=Path"

        // else
        //   strSetting = strSetting + ";blackListForDebugSession=NA"

        return strSetting;

    }

    createSessionName(bt) {
        if (bt != 'Custom') {
            this.ddAIData.sessionName = this.tierName + "_" + bt
        }
        else
            this.ddAIData.sessionName = this.tierName + "_" + this.other
    }

    //Close AI and DD Dialog 
    closeAutoInstrDDDialog() {
        this.closeAIDDGui.emit(false);
    }

    onTabOpen(e) {
        if (e.index == 0)
            this.accordionTab = 1;
    }
    onTabClose(e) {
        if (e.index == 0)
            this.accordionTab = 0;
    }

}
export interface ServerInfo {
    serverId: number;
    serverFileId: number;
    serverDesc: string;
    serverDisplayName: string;
    serverName: string;
    profileId: number;
    profileName: string;
}
