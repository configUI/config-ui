import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/primeng';

import { NDAgentInfo } from '../../interfaces/nd-agent-info';
import { ConfigUiUtility } from '../../utils/config-utility';
import { ViewAdvanceSettings, InputFields } from '../../interfaces/bci-log';
import { ConfigNdAgentService } from '../../services/config-nd-agent.service';
import { ConfigUtilityService } from '../../services/config-utility.service';

declare var Prism;

@Component({
    selector: 'app-config-bci-logs',
    templateUrl: './config-bci-logs.component.html',
    styleUrls: ['./config-bci-logs.component.css']
})
export class ConfigBCILogsComponent implements OnInit {

    /**Getting nd agent status data */
    ndAgentStatusData: NDAgentInfo[];

    /**List of connected tiers/server/instances */
    tierList: SelectItem[];
    serverList: SelectItem[];
    instanceList: SelectItem[];

    /** File type list */
    fileTypeList: SelectItem[];

    /** to store tier/server/instance list connected by ## symbol */
    tierSerInsList: any[]

    /** To store tier/server/instance name after selecting from drop down */
    selectedTier: string = "";
    selectedServer: string = "";
    selectedInstance: string = "";

    /** Agent type List */
    agentList: SelectItem[];

    /** Advance settings for view */
    viewAdvanceSetting: ViewAdvanceSettings;

    /** To store selected fileTye */
    selectedFileType: string = "";

    /** To store list of files recieved from BCI */
    fileListArr: any[] = [];

    /** File selected on radio button click */
    selectedFile: string = "";

    /** To show download file dialog */
    downloadDialog: boolean = false;

    /** To store the file content */
    fileContent: string = "";

    /** flag to show the content area of the file */
    showContentBox: boolean = false;

    /** To search the file */
    searchText: string = "";

    /**Object for InputFields class */
    messageFields: InputFields

    /** To show header of text area with selected file name from the radio button */
    fileNameHeader: string = "";

    /** To search the text from the file content */
    searchFileText: string = "";

    /**to set file label name */
    fileNameOnClick: string = "";

    /**To check if goBack is clicked */
    isGoBack: boolean = false;


    constructor(private configNdAgentService: ConfigNdAgentService,
        private configUtilityService: ConfigUtilityService) {
    }

    ngOnInit() {

        //Initializing file content as no files selected 
        this.fileContent = "No files selected"

        this.messageFields = new InputFields();

        //Creating instance of view
        this.viewAdvanceSetting = new ViewAdvanceSettings();

        /** Get connected agents list by executing get_bci_agents_info shell */
        this.configNdAgentService.getNDAgentStatusData().subscribe(data => {
            // data = [{"nst":"1546408316788","at":"Java","st":"Active","pid":"26104","si":"10.10.30.6","cpath":"-","ai":1,"tier":"AppServer_6","server":"netstorm-ProLiant-ML110-G7","instance":"Instance1","iD":"/opt/cavisson/netdiagnostics","ver":"4.1.13 BUILD 29","brs":"01/02/19 11:20:56"},{"nst":"1546406580654","at":"Java","st":"Active","pid":"28434","si":"10.10.30.54","cpath":"-","ai":2,"tier":"Cmon54","server":"cavisson-ProLiant-ML10-v2","instance":"Instance1","iD":"/home/cavisson/netdiagnostics","ver":"4.1.13 BUILD 31","brs":"12/28/18 15:49:50"},{"nst":"1546406580543","at":"Java","st":"Active","pid":"13002","si":"10.10.30.29","cpath":"-","ai":3,"tier":"Appserver_29","server":"CAV-QA-30-29","instance":"Instance1","iD":"/opt/cavisson/netdiagnostics","ver":"4.1.13 BUILD 32","brs":"12/31/18 13:00:53"},{"nst":"1546406584023","at":"Java","st":"Active","pid":"49529","si":"10.10.30.48","cpath":"-","ai":4,"tier":"AtgTier","server":"netstorm-ProLiant-ML10-v2","instance":"Instance1","iD":"/opt/cavisson/netdiagnostics","ver":"4.1.13 BUILD 32","brs":"12/31/18 16:02:50"}]

            this.ndAgentStatusData = data;

            //Create tierList dropdown
            this.createTierList(data);
            this.createFileType();
            this.createAgentList();
        });

    }

    /** Method to get tier list from nd agent status data  */
    createTierList(data: NDAgentInfo[]) {
        this.tierList = [];
        this.tierSerInsList = [];
        for (var res of data) {

            //If the object is connected or in Active state( Do not add if instance is disconnected)
            if (res.st != '-') {
                // Creating tier dropdown
                this.tierList.push({ label: res.tier, value: res.tier });

                //It will store tier/server/instance in format: tier1##server1##instance1
                this.tierSerInsList.push(res.tier + "##" + res.server + "##" + res.instance)
            }
        }

    }

    /** Create dropdown for file type */
    createFileType() {
        this.fileTypeList = [];
        let label = ["Logs", "Scripts", "Custom"]
        let val = ["logs", "scripts", "Custom"]
        this.fileTypeList = ConfigUiUtility.createListWithKeyValue(label, val);
    }

    /** Create agent list */
    createAgentList() {
        this.agentList = [];
        let agent = ["Java"];
        this.agentList = ConfigUiUtility.createDropdown(agent);
    }

    /** Fetch server(s) when a tier is selected from the dropdown */
    fetchServer(selectedTier: any) {
        this.serverList = []
        this.instanceList = []
        this.selectedServer = "";
        this.selectedInstance = "";

        //List to store the values of the server
        let tempList = []

        //Iterating tier##server##instance list
        for (let obj in this.tierSerInsList) {

            //Getting the first index of ## character
            let firstIndex = this.tierSerInsList[obj].indexOf("##");

            //Getting the last index of ## character
            let lastIndex = this.tierSerInsList[obj].lastIndexOf("##")

            // populating temPlist with those servers whose tier name is equal to the selected tier name
            if (this.tierSerInsList[obj].includes(selectedTier + "##")) {
                tempList.push(this.tierSerInsList[obj].substring(firstIndex + 2, lastIndex))
            }

            //To remove duplicate elements
            let tempNewList = this.removeDuplicateElements(tempList);

            // Creating dropdown of server list for selected tier
            this.serverList = ConfigUiUtility.createDropdown(tempNewList)
        }
    }

    /** Fetch instance(s) when a server is selected from the dropdown */
    fetchInstance(selectedServer: any) {
        this.instanceList = []
        this.selectedInstance = "";

        //List to store the values of the instance
        let tempList = []

        //Iterating tier##server##instance list
        for (let obj in this.tierSerInsList) {

            // populating temPlist with those instance whose server name is equal to the selected server name
            if (this.tierSerInsList[obj].includes("##" + selectedServer + "##")) {
                tempList.push(this.tierSerInsList[obj].substring(this.tierSerInsList[obj].lastIndexOf("##") + 2))
            }

            //To remove duplicate elements
            let tempNewList = this.removeDuplicateElements(tempList);

            // Creating dropdown of instance list for selected server
            this.instanceList = ConfigUiUtility.createDropdown(tempNewList)
        }

    }

    /** To remove duplicate elements from the list */
    private removeDuplicateElements(tempList: any[]) {
        return Array.from(new Set(tempList));
    }

    //To identify the OS type of the selected instance
    identifyOSType() {
        for (let obj of this.ndAgentStatusData) {
            if (this.selectedTier == obj.tier && this.selectedServer == obj.server && this.selectedInstance == obj.instance) {
                this.viewAdvanceSetting.osType = obj.os;
                this.viewAdvanceSetting.installationDir = obj.iD;
                break;
            }
        }
    }

    /** Show Agent files located at the selected source path(FileType) */
    showFiles() {

        let message: string = "";
        //to construct list file message
        message = this.constructMessage();


        // Sending message to NDC to get the list of files from the specified directory
        this.configNdAgentService.listFiles(message).subscribe(data => {
            if (!data[0].includes("Error")) {
                //response array will contain last element as - ;] , so remove this element from array
                this.fileListArr = data.slice(0, -1);
                //Assigning selected tier/server/instance to the tier/server/instance variables that are used to send the message to the NDC
                this.createMessageFieldsOnShowClick();
            }
            else if (data[0].includes("Not a directory") || data[0].includes("No such file or directory")) {
                this.configUtilityService.errorMessage("Not a directory")

            }
            else {
                this.configUtilityService.errorMessage("Error in listing files <br> Source Path might be invalid")
                this.fileListArr = [];
                this.showContentBox = false;
                this.messageFields = new InputFields();
            }

            this.fileNameOnClick = "";

        })

        this.selectedFile = "";
    }

    /** To initialize the message  input fields when user clicks on show files button */
    private createMessageFieldsOnShowClick() {
        this.messageFields.tier = this.selectedTier;
        this.messageFields.server = this.selectedServer;
        this.messageFields.instance = this.selectedInstance;
        this.messageFields.agentMode = this.viewAdvanceSetting.agentMode;
        this.messageFields.compressedMode = this.viewAdvanceSetting.compressedMode;
        this.messageFields.executeForcefully = this.viewAdvanceSetting.executeForcefully;
        this.messageFields.fileType = this.selectedFileType;
        this.messageFields.sourcePath = this.viewAdvanceSetting.sourcePath;
        this.messageFields.timeout = this.viewAdvanceSetting.timeout;

    }

    //Method to create message to send to NDC to list files of the specified directory
    constructMessage() {

        /**AgentType=Java;Arguments= ls ../logs/;DownloadFile=0;
         * Tier=T1;Server=S1;Instance=A1;TestRun=1;Path=;TimeOut=60;ExecuteForceFully=0;CompressMode=0;'*/

        let argument = "";
        let trNo = this.getTRNo();

        //If connected machine is linux
        if (this.viewAdvanceSetting.osType == "LinuxEx") {

            //If selected file type is not custom
            if (this.selectedFileType != 'Custom') {
                if (this.fileNameOnClick != "")
                    argument = "ls -p " + this.viewAdvanceSetting.installationDir + "/" + this.selectedFileType + "/" + this.fileNameOnClick + "/"
                else {
                    argument = "ls -p " + this.viewAdvanceSetting.installationDir + "/" + this.selectedFileType + "/"
                }
            }
            else {
                if (this.fileNameOnClick != "")
                    this.viewAdvanceSetting.sourcePath = this.viewAdvanceSetting.sourcePath + "/" + this.fileNameOnClick

                argument = "ls -p " + "/" + this.viewAdvanceSetting.sourcePath

            }
        }

        return "AgentType=" + this.viewAdvanceSetting.agentMode + ";Arguments=" + argument + ";DownloadFile=0;Tier="
            + this.selectedTier + ";Server=" + this.selectedServer + ";Instance=" + this.selectedInstance
            + ";TestRun=" + trNo + ";Path=/tmp;Timeout=" + this.viewAdvanceSetting.timeout + ";ExecuteForceFully="
            + this.viewAdvanceSetting.executeForcefully + ";CompressMode=" + this.viewAdvanceSetting.compressedMode + ";"

    }


    /** To get TRNo if test is running */
    private getTRNo() {
        let trNo = "";
        if (sessionStorage.getItem("isTrNumber") != "null" && sessionStorage.getItem("isTrNumber") != null) {
            trNo = sessionStorage.getItem("isTrNumber"); // When test is running
        }
        else {
            trNo = "1"; // When test is not running
        }
        return trNo;
    }

    /** To open a dialog to ask the user for destination path to download the file */
    openDownloadFileDialog() {

        /**Check if any file(radio button) is selected or not */
        if (this.selectedFile == "") {
            this.configUtilityService.errorMessage("Choose a file to download");
            return;
        }
        this.downloadDialog = true;

        //Assigning with default path
        this.viewAdvanceSetting.destPath = "/tmp";
    }

    /** To download selected file */
    downloadFile() {

        /** Download message format will be: 
         * ndi_communicate_with_ndc 10.10.40.12 7892 'download_file_req:AgentType=java;FileName=nd_bci_9_debug.log0;
         * Tier=T1;Server=S1;Instance=A1;TestRun=1;FileType=logs;Path=/tmp;TimeOut=10;DeleteFile=0;
         */

        let fileType = "";

        if (this.messageFields.fileType != 'Custom') {
            fileType = this.messageFields.fileType;
        }
        else {
            fileType = this.messageFields.sourcePath; // If filetype is custom
        }

        let trNo = this.getTRNo();

        this.searchFileText = "";

        let message = "AgentType=" + this.messageFields.agentMode + ";FileName=" + this.selectedFile + ";Tier="
            + this.messageFields.tier + ";Server=" + this.messageFields.server + ";Instance=" + this.messageFields.instance
            + ";TestRun=" + trNo + ";FileType=" + fileType + ";Path=" + this.viewAdvanceSetting.destPath
            + ";TimeOut=" + this.messageFields.timeout + ";DeleteFile=0;"


        this.configNdAgentService.downloadAgentFile(message).subscribe(data => {

            if (data["_body"] != "Error in downloading files") {
                this.configUtilityService.successMessage("File download successfully at path : " + this.viewAdvanceSetting.destPath);
                this.fileContent = data['_body'];
                this.fileContent = Prism.highlight(data._body, Prism.languages.markup);
                this.showContentBox = true;
                //Setting file header name over textarea
                this.fileNameHeader = this.selectedFile;
            }
            else {
                this.configUtilityService.errorMessage("Error in downloading selected file");
            }

        })

        this.downloadDialog = false;

    }

    /** Get files list on clicking the directory(if any) */
    doubleClick(_file) {

        //On clicking any directory it should open its respective files
        this.fileNameOnClick = _file;

        //show files of the selected directory on click of label
        this.showFiles();

    }

    /** To go back from the current folder */
    goBack() {

        //Custom case
        if (this.viewAdvanceSetting.sourcePath != "") {

            //if path ends with / i.e. /root/weblogic/coherence/
            if (this.viewAdvanceSetting.sourcePath.endsWith("/")) {

                this.viewAdvanceSetting.sourcePath = this.viewAdvanceSetting.sourcePath.substring(0, this.viewAdvanceSetting.sourcePath.lastIndexOf("/"))
            }

            // Removing last element from the path i.e. /root/weblogic/coherence will be /root/weblogic/
            this.viewAdvanceSetting.sourcePath = this.viewAdvanceSetting.sourcePath.substring(0, this.viewAdvanceSetting.sourcePath.lastIndexOf("/"))

        }
        this.showFiles()
    }


}