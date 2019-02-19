import { Component, OnInit, OnChanges } from '@angular/core';
import { ConfigKeywordsService } from '../../services/config-keywords.service';
import { ConfigUiUtility } from '../../utils/config-utility';
import { ConfigUtilityService } from '../../services/config-utility.service';
import { Messages } from '../../constants/config-constant';
import { ConfigHomeService } from '../../services/config-home.service';

import { InstrumentationProfileForNodeJS } from '../../containers/instrumentation-data';

/**Added for Edit feature */
import { TreeNode, MenuItem } from 'primeng/primeng';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';

declare var Prism;

@Component({
  selector: 'app-config-import-instr-profile',
  templateUrl: './config-import-instr-profile.component.html',
  styleUrls: ['./config-import-instr-profile.component.css']
})

export class ConfigImportInstrProfileComponent implements OnInit {

  constructor(private _configKeywordsService: ConfigKeywordsService, private _configUtilityService: ConfigUtilityService, private confirmationService: ConfirmationService, private configHomeService: ConfigHomeService) { }

  xmlFormat: any;
  profileList: any[];

  selectedFile: string = "";
  isMakeXMLFile: boolean;
  openFileExplorerDialog: boolean = false;
  userName = sessionStorage.getItem("sesLoginName") == null ? "netstorm" : sessionStorage.getItem("sesLoginName");
  agent: any[];
  selectedAgent: string = "";
  isInstrPerm: boolean;
  details = []

  //Object for NodeJS
  instrprofdata: InstrumentationProfileForNodeJS[] = [];
  instrDialogDetail: InstrumentationProfileForNodeJS;

  //Previous Module name before editting
  prevModuleStr = '';

  //Previous instrument before editing
  isPrevInstrument : boolean = false;

  //This flag is checking whether edit or create operation.
  isEditModuleInfo : boolean = false;

  //This flag keeps the dialog open if there is duplicate module entry
  isDuplicateModuleDialog : boolean;

  //Edit Tree Node
  editFile: boolean = false;
  parsedData: TreeNode[];
  selectedNode: TreeNode;
  TreeMenu: MenuItem[];      //Add ContextMenuModule in app.module
  addNodeDialog: boolean = false;
  openNodeJSDialog: boolean = false;
  nodeLabel: string = '';
  instrmntn: boolean;
  nodeObj: Object = {};
  nodeTitle: string = '';
  addDialogHeader: string = '';
  openDetailsDialog: boolean = false;
  openRTCInfoDialog: boolean = false;
  rtcMsg = [];

  //Create Tree Node
  createData: TreeNode[] = [];
  saveFileName: string = '';
  isConferMationAgentSelected: boolean;
  viewInstrumentation: boolean;
  saveEditedFileAs: string = '';
  isSaveAsEditedFile: boolean = false;

  //To open RTC Dialog & apply RTC 
  isApplyRTC: boolean = false;
  ngOnInit() {
    this.isInstrPerm = +sessionStorage.getItem("InstrProfAccess") == 4 ? true : false;

    /* create Dropdown for files */
    this.xmlFormat = "No file selected";

    this._configKeywordsService.fileListProvider.subscribe(data => {
      this.getFileList(data);
    });
    let agentVal = ['Dot Net', 'Java', 'NodeJS'];
    this.agent = ConfigUiUtility.createDropdown(agentVal);
    this.viewInstrumentation = false
  }


  createDropDown(filename, callback) {
    this._configKeywordsService.getInstrumentationProfileXMLFileList(this.selectedAgent).subscribe(data => {
      this.profileList = ConfigUiUtility.createInstrProfileDropdown(data);
      if (filename !== "filename")
        this.selectedFile = filename;
      callback();
    });
  }

  getAgentSpecificFiles(val) {
    if (val != "Java") {
      this.createInstrumentation = false;
      this.editFile = false;
    }
    this.clearWindow();
    this.viewInstrumentation = false;
    this.createDropDown("filename", () => { });
  }

  /**used to open file manager */
  isFromXML: boolean = true;
  openFileManager() {
    if (this.selectedAgent == "") {
      this.isConferMationAgentSelected = true;
    }
    else
      this.openFileExplorerDialog = true;
    this.isMakeXMLFile = true;
    this.isFromXML = true;
  }

  /* this method is used for get xml data  on selected a text file from file manager*/
  getFileList(path) {
    if (this.isMakeXMLFile == true) {
      this.isMakeXMLFile = false;
      if (path.includes(";")) {
        this._configUtilityService.errorMessage("Multiple files cannot be imported");
        return;
      }
      if (this.isFromXML) {
        if (!path.includes(".txt")) {
          this._configUtilityService.errorMessage("File extension not matched (i.e .txt)");
          return;
        }
      }
      let filename = path.substring(path.lastIndexOf("/") + 1, path.lastIndexOf("."))
      filename = filename + ".xml";
      path = path + "@" + this.userName;
      this._configKeywordsService.getInstrumentationProfileXMLData(path).subscribe(data => {
        // const xml = beautify(data._body);
        this.xmlFormat = data._body;
        this.xmlFormat = Prism.highlight(data._body, Prism.languages.markup);
        if (this.xmlFormat == "") {
          this._configUtilityService.errorMessage("Files contains no data or invalid data");
          return;
        }
        else
          this._configUtilityService.successMessage("File imported successfully");
        this.createDropDown(filename, () => { });
      });
    }

    this.openFileExplorerDialog = false;
  }

  /* this method is used for get data on selected a file from dropdown*/
  showSelectedFileData() {
    // this.instrprofdata = [];
    this.viewInstrumentation = true;
    this.xmlFormat = '';
    if (this.selectedFile == undefined || this.selectedFile == "") {
      this._configUtilityService.errorMessage("Select a file to view");
      return;
    }
    this._configKeywordsService.getXMLDataFromSelectedXMLFile(this.selectedFile).subscribe(data => {
      // const xml = beautify(data._body);
      this.xmlFormat = data._body;
      this.xmlFormat = Prism.highlight(data._body, Prism.languages.markup);
    });
    this.editFile = false;
    this.createInstrumentation = false;
  }

  /**
   * This function is responsible for reading and then converting file into tree node
   */
  editSelectedFile() {
    if (this.selectedFile === undefined || this.selectedFile === "") {
      this._configUtilityService.errorMessage("Select a file to Edit");
      return;
    }
    this.parsedData = [];
    this.nodeObj['isCreate'] = false;

    if (this.selectedAgent == 'Java') {
      this._configKeywordsService.editXMLDataFromSelectedXMLFile(this.selectedFile).subscribe(data => {
        this.parsedData = data['backendDetailList'];
      });
    }
    else if (this.selectedAgent == 'NodeJS') {
      this._configKeywordsService.editJSONDataFromSelectedJSONFile(this.selectedFile).subscribe(data => {
        this.instrprofdata = [];
        let dataToBeUploaded = [];

        this.parsedData = data['backendDetailList'];
        dataToBeUploaded = this.parsedData[0]['children'];

        // Extracting Module name and instrument from dataToBeUploaded into object
        for (let key in dataToBeUploaded) {
          this.instrDialogDetail = new InstrumentationProfileForNodeJS();
          for (let subKey in dataToBeUploaded[key]) {
            if (subKey == 'label') {
              this.instrDialogDetail.moduleName = dataToBeUploaded[key]['label'];
            }
            else if (subKey == 'instrument') {
              this.instrDialogDetail.isInstrument = dataToBeUploaded[key]['instrument'];
            }
          }
          this.instrprofdata.push(this.instrDialogDetail);
        }
      });
    }

    this.editFile = true;
    this.createInstrumentation = false;
  }

  /**
   * THis function is responsible for filling Context Menu on basis of node type
   */
  nodeSelect(event, flag) {
    let type = event['node']['type'];
    let parentClassNode = event['node']['parentClassNode'];
    let parentPackageNode = event['node']['parentPackageNode'];
    let parentInterfaceNode = event['node']['parentInterfaceNode'];

    // Filling menu on basis of type
    if (this.selectedAgent == 'Java') {
      if (type === 'All') {
        this.TreeMenu = [
          {
            label: 'Add Package',
            icon: 'fa-plus',
            'command': (event) => {
              this.onNodeMenuItemClick('Package Name');
              this.nodeObj = [];
              this.nodeObj['type'] = 'All';
              this.nodeObj['label'] = 'All';
              this.nodeObj['parentClassNode'] = parentClassNode;
              this.nodeObj['parentPackageNode'] = parentPackageNode;
              this.nodeObj['parentInterfaceNode'] = parentInterfaceNode;
              this.nodeObj['isCreate'] = flag;
            }
          }
        ];
      } else if (type === 'package') {
        let contextMenuEvent = event;
        this.TreeMenu = [
          {
            label: 'Add Class',
            icon: 'fa-plus',
            'command': (event) => {

              this.onNodeMenuItemClick('Class Name');
              this.nodeObj = [];
              this.nodeObj['type'] = 'package';
              this.nodeObj['label'] = contextMenuEvent['node']['label'];
              this.nodeObj['parentClassNode'] = parentClassNode;
              this.nodeObj['parentPackageNode'] = parentPackageNode;
              this.nodeObj['parentInterfaceNode'] = parentInterfaceNode;
              this.nodeObj['isCreate'] = flag;
            }
          },
          {
            label: 'Add Interface',
            icon: 'fa-plus',
            'command': (event) => {

              this.onNodeMenuItemClick('Interface Name');
              this.nodeObj = [];
              this.nodeObj['type'] = 'package';
              this.nodeObj['label'] = contextMenuEvent['node']['label'];
              this.nodeObj['parentClassNode'] = parentClassNode;
              this.nodeObj['parentPackageNode'] = parentPackageNode;
              this.nodeObj['parentInterfaceNode'] = parentInterfaceNode;
              this.nodeObj['isCreate'] = flag;
            }
          },
          {
            label: 'Delete Package',
            icon: 'fa-trash',
            'command': (event) => {
              this.confirmationService.confirm({
                message: 'Do you want to perform this action?',
                header: 'Confirmation',
                accept: () => {
                  this.deleteNodeFromTree(type, contextMenuEvent['node']['label'], contextMenuEvent);
                }
              });
            }
          }
        ];

      } else if (type === 'class') {

        let contextMenuEvent = event;
        this.TreeMenu = [
          {
            label: 'Add Method',
            icon: 'fa-plus',
            'command': (event) => {
              this.onNodeMenuItemClick('Method Name');
              this.nodeObj = [];
              this.nodeObj['type'] = 'class';
              this.nodeObj['label'] = contextMenuEvent['node']['label'];
              this.nodeObj['parentClassNode'] = parentClassNode;
              this.nodeObj['parentPackageNode'] = parentPackageNode;
              this.nodeObj['parentInterfaceNode'] = parentInterfaceNode;
              this.nodeObj['isCreate'] = flag;
            }
          },
          {
            label: 'Delete Class',
            icon: 'fa-trash',
            'command': (event) => {
              this.confirmationService.confirm({
                message: 'Do you want to perform this action?',
                header: 'Confirmation',
                accept: () => {
                  this.deleteNodeFromTree(type, contextMenuEvent['node']['label'], contextMenuEvent);
                }
              });
            }
          }
        ];

      } else if (type === 'interface') {
        let contextMenuEvent = event;
        this.TreeMenu = [
          {
            label: 'Add Method',
            icon: 'fa-plus',
            'command': (event) => {
              this.onNodeMenuItemClick('Method Name');
              this.nodeObj = [];
              this.nodeObj['type'] = 'interface';
              this.nodeObj['label'] = contextMenuEvent['node']['label'];
              this.nodeObj['parentClassNode'] = parentClassNode;
              this.nodeObj['parentPackageNode'] = parentPackageNode;
              this.nodeObj['parentInterfaceNode'] = parentInterfaceNode;
              this.nodeObj['isCreate'] = flag;
            }
          },
          {
            label: 'Delete Interface',
            icon: 'fa-trash',
            'command': (event) => {
              this.confirmationService.confirm({
                message: 'Do you want to perform this action?',
                header: 'Confirmation',
                accept: () => {
                  this.deleteNodeFromTree(type, contextMenuEvent['node']['label'], contextMenuEvent);
                }
              });
            }
          }
        ];

      } else if (type === 'method') {
        let contextMenuEvent = event;
        this.TreeMenu = [
          {
            label: 'Delete Method',
            icon: 'fa-trash',
            'command': (event) => {
              this.confirmationService.confirm({
                message: 'Do you want to perform this action?',
                header: 'Confirmation',
                accept: () => {
                  this.deleteNodeFromTree(type, contextMenuEvent['node']['label'], contextMenuEvent);
                }
              });
            }
          }
        ];
      }
    }

    // Filling Menu on basis of type.
    if (this.selectedAgent == 'NodeJS') {
      if (type === 'All') {
      this.isEditModuleInfo = false;
        this.TreeMenu = [
          {
            label: 'Add Module',
            icon: 'fa-plus',
            'command': (event) => {
              this.onNodeMenuItemClick('Module Name');
              this.nodeObj = [];
              this.nodeObj['type'] = 'All';
              this.nodeObj['label'] = 'All';
              this.nodeObj['isCreate'] = flag;
            }
          }
        ];
      }
      //To delete selected Module
      else if (type === 'module') {
        let contextMenuEvent = event;
        this.TreeMenu = [
          {
            //For Edit Module Dialog
            label: 'Edit Module',
            icon: 'fa-pencil',
            'command': (event) => {
              for (let i = 0; i < this.instrprofdata.length; i++) {
                this.instrDialogDetail = new InstrumentationProfileForNodeJS();
                if (this.instrprofdata[i].moduleName == contextMenuEvent['node']['label']) {
                  this.prevModuleStr = this.instrprofdata[i].moduleName;
                  this.isPrevInstrument = this.instrprofdata[i].isInstrument;
                  this.isEditModuleInfo = true;

                  //put instrument and module into dialog to show  
                  this.instrDialogDetail.moduleName = this.instrprofdata[i].moduleName;
                  this.instrDialogDetail.isInstrument = this.instrprofdata[i].isInstrument;
                  this.nodeObj['type'] = 'All';

                  //Open dialog box
                  this.openNodeJSDialog = true;
                  break;
                }
              }
            }
          },
          {
            label: 'Delete Module',
            icon: 'fa-trash',
            'command': (event) => {
              this.confirmationService.confirm({
                message: 'Do you want to perform this action?',
                header: 'Confirmation',
                accept: () => {
                  this.deleteModuleFromTreeAndObject(type, contextMenuEvent['node']['label'], contextMenuEvent);
                }
              });
            }
          }
        ];
      }
    }
  }

  /**Add node to tree */
  addNodeToTree(type, label) {
    try {

      let DataArr = [];
      if (this.nodeObj['isCreate']) {
        DataArr = this.createData;
      } else {
        DataArr = this.parsedData
      }

      // Adding Package
      if (this.selectedAgent == 'Java') {
        if (type === 'All') {
          if (this.checkForDuplicacy('All', label, null, null, DataArr)) {
            this._configUtilityService.errorMessage("Duplicate package entry is not allowed");
            return;
          }
          let obj = {
            'label': label,
            'type': 'package',
            'parentPackageNode': label,
            'parentClassNode': null,
            'parentInterfaceNode': null,
            'selected': false,
            'leaf': false,
            'expanded': true,
            'children': [],
          };
          DataArr[0]['children'].push(obj);
        } else if (type === 'package') {  // Add class

          if (this.checkForDuplicacy('package', this.nodeObj['parentPackageNode'], label, null, DataArr)) {
            this._configUtilityService.errorMessage("Duplicate class entry is not allowed");
            return;
          }
          let obj;
          if (this.nodeTitle == 'Interface Name') {
            obj = {
              'label': this.toTitleCase(label),
              'type': 'interface',
              'parentPackageNode': this.nodeObj['parentPackageNode'],
              'parentClassNode': null,
              'parentInterfaceNode': this.toTitleCase(label),
              'selected': false,
              'leaf': false,
              'expanded': true,
              'children': [],
              'icon': "instrumentation-profile ndegui-interface"
            };
          }

          else {
            obj = {
              'label': this.toTitleCase(label),
              'type': 'class',
              'parentPackageNode': this.nodeObj['parentPackageNode'],
              'parentClassNode': this.toTitleCase(label),
              'parentInterfaceNode': null,
              'selected': false,
              'leaf': false,
              'expanded': true,
              'children': [],
              'icon': "instrumentation-profile ndegui-class2-1"
            };
          }

          let index = 0;
          for (let i = 0; i < DataArr[0]['children'].length; i++) {
            // If Package found, add class
            if (this.nodeObj['parentPackageNode'] === DataArr[0]['children'][i]['label']) {
              index = i;
              break;
            }
          }
          DataArr[0]['children'][index]['children'].push(obj);
        } else if (type === 'class') { // Add Method

          let packageName = this.nodeObj['parentPackageNode'];
          let className = this.nodeObj['parentClassNode'];

          if (this.checkForDuplicacy('class', packageName, className, label, DataArr)) {
            this._configUtilityService.errorMessage("Duplicate method entry is not allowed");
            return;
          }

          let obj = {
            'label': label,
            'type': 'method',
            'parentPackageNode': this.nodeObj['parentPackageNode'],
            'parentClassNode': this.nodeObj['parentClassNode'],
            'selected': false,
            // 'leaf': false,
            'expanded': true,
            'children': []
          };

          let packgIndex;
          let classIndex;

          for (let i = 0; i < DataArr[0]['children'].length; i++) {
            // If Package found, add class
            if (packageName === DataArr[0]['children'][i]['label']) {
              packgIndex = i;
              for (let j = 0; j < DataArr[0]['children'][i]['children'].length; j++) {
                if (className === DataArr[0]['children'][i]['children'][j]['label']) {
                  classIndex = j;
                  break;
                }
              }
            }
          }
          DataArr[0]['children'][packgIndex]['children'][classIndex].children.push(obj);
        } else if (type === 'interface') { // Add Method

          let packageName = this.nodeObj['parentPackageNode'];
          let interfaceName = this.nodeObj['parentInterfaceNode'];

          if (this.checkForDuplicacy('interface', packageName, interfaceName, label, DataArr)) {
            this._configUtilityService.errorMessage("Duplicate method entry is not allowed");
            return;
          }

          let obj = {
            'label': label,
            'type': 'method',
            'parentPackageNode': this.nodeObj['parentPackageNode'],
            'parentInterfaceNode': this.nodeObj['parentInterfaceNode'],
            'selected': false,
            // 'leaf': false,
            'expanded': true,
            'children': []
          };

          let packgIndex;
          let interfaceIndex;

          for (let i = 0; i < DataArr[0]['children'].length; i++) {
            // If Package found, add class
            if (packageName === DataArr[0]['children'][i]['label']) {
              packgIndex = i;
              for (let j = 0; j < DataArr[0]['children'][i]['children'].length; j++) {
                if (interfaceName === DataArr[0]['children'][i]['children'][j]['label']) {
                  interfaceIndex = j;
                  break;
                }
              }
            }
          }
          DataArr[0]['children'][packgIndex]['children'][interfaceIndex].children.push(obj);
        }
      }

      if (this.selectedAgent == 'NodeJS') {
        if (type === 'All') { // Add Module if there is no duplicate entry 
          //If Add Module operation is being performed
          if(this.isEditModuleInfo == false)
          {
            if (this.checkForDuplicacyOfModule('All', label, DataArr)) {
              this._configUtilityService.errorMessage("Duplicate module entry is not allowed");
	      this.isDuplicateModuleDialog = true;
              return;
            }
          }
          //If Edit Module operation is being performed
          else
          {
            if(this.prevModuleStr == this.instrDialogDetail.moduleName && this.isPrevInstrument == this.instrDialogDetail.isInstrument)
            {
              this.isDuplicateModuleDialog = false;
              return;
            }
            else if(this.prevModuleStr != this.instrDialogDetail.moduleName && (this.isPrevInstrument == this.instrDialogDetail.isInstrument || this.isPrevInstrument != this.instrDialogDetail.isInstrument))
            {
              if(this.checkForDuplicacyOfModule('All', label, DataArr))
              {
                this.isDuplicateModuleDialog = true;
                this._configUtilityService.errorMessage("Duplicate module entry is not allowed");
                return;
              }
            }
          }

          // Handling Icon appearance
          let obj;
          if (this.instrDialogDetail.isInstrument === true) {
            obj = {
              'label': label,
              'type': 'module',
              'icon': "fa fa-info",
            };
          }
          else {
            obj = {
              'label': label,
              'type': 'module',
            };
          }

          //If Edit Module operation is being performed
          if(this.isEditModuleInfo)
          {
            for (let i = 0; i < DataArr[0]['children'].length; i++) {
              if (this.prevModuleStr == DataArr[0]['children'][i]['label']) {
                // Editting Tree node Module at same index
                DataArr[0]['children'].splice(i,1,obj);
                break;
              }
            }

            for (let i = 0; i < this.instrprofdata.length; i++) {
              if (this.instrprofdata[i].moduleName == this.prevModuleStr) {
                // Editting Module or/and Instrument at same index
                this.instrprofdata.splice(i,1,this.instrDialogDetail);
                break;
              }
            }
            this.isDuplicateModuleDialog = false; 
          }

          //If Create Module operation is being performed
          else
          {
            DataArr[0]['children'].push(obj);
            this.instrprofdata.push(this.instrDialogDetail);
            this.isDuplicateModuleDialog = false;
          }     
        }
        this.isEditModuleInfo = false;
      }
      // Checking if Creation or Edition is being done
      if (this.nodeObj['isCreate']) {
        this.createData = DataArr;
      } else {
        this.parsedData = DataArr;
      }

    } catch (err) {
      console.error(err);
    }
  }

  //Slicing module name and corresponding object data from node 
  deleteModuleFromTreeAndObject(type, label, contextMenuEvent) {
    try {

      let DataArr = [];
      if (this.nodeObj['isCreate']) {
        DataArr = this.createData;
      } else {
        DataArr = this.parsedData
      }

      const mainData = DataArr[0]['children'];

      // Slicing module from main tree
      if (type === 'module') {
        for (let i = 0; i < this.instrprofdata.length; i++) {
          if (this.instrprofdata[i].moduleName === label) {
            this.instrprofdata.splice(i, 1);
          }
        }
        // Slicing Module information from Object
        for (let index = 0; index < mainData.length; index++) {
          if (label === mainData[index].label) {
            DataArr[0]['children'].splice(index, 1);
            break;
          }
        }
      }
    }
    catch (err) {
      console.error(err);
    }
  }

  /**delete node from tree */
  deleteNodeFromTree(type, label, contextMenuEvent) {
    try {

      let DataArr = [];
      if (this.nodeObj['isCreate']) {
        DataArr = this.createData;
      } else {
        DataArr = this.parsedData
      }

      const mainData = DataArr[0]['children'];

      // Slicing Packing from main tree
      if (type === 'package') {
        for (let index = 0; index < mainData.length; index++) {
          if (label === mainData[index].label) {
            DataArr[0]['children'].splice(index, 1);
            break;
          }
        }
      } else if (type === 'class' || type === 'interface') {    // Slicing Classes
        for (let index = 0; index < mainData.length; index++) {
          if (contextMenuEvent['node']['parentPackageNode'] === mainData[index]['parentPackageNode']) {
            for (let j = 0; j < mainData[index]['children'].length; j++) {
              if (label === mainData[index]['children'][j].label) {
                DataArr[0]['children'][index]['children'].splice(j, 1);
                break;
              }
            }
          }
        }
      } else if (type === 'method') {    // Slicing Method
        for (let index = 0; index < mainData.length; index++) {
          if (contextMenuEvent['node']['parentPackageNode'] === mainData[index]['parentPackageNode']) {
            for (let j = 0; j < mainData[index]['children'].length; j++) {
              if (contextMenuEvent['node']['parentClassNode'] === mainData[index]['children'][j]['parentClassNode']) {
                for (let k = 0; k < mainData[index]['children'][j]['children'].length; k++) {
                  if (label === mainData[index]['children'][j]['children'][k]['label']) {
                    DataArr[0]['children'][index]['children'][j]['children'].splice(k, 1);
                    break;
                  }
                }
              }
            }
          }
        }
      }

      // Checking if XML Creation or Edition is being done
      if (this.nodeObj['isCreate']) {
        this.createData = DataArr;
      } else {
        this.parsedData = DataArr;
      }

    } catch (err) {
      console.error(err);
    }
  }

  createInstrumentation: boolean = false;

  /**This method is responsible for creating Nodes */
  createInstrumentationFile() {
    // Removing Selected file, if any
    this.selectedFile = '';
    this.saveFileName = '';
    this.createData = [];
    this.instrprofdata = [];
    this.isEditModuleInfo = false;

    if (this.selectedAgent == 'Java') {
      let rootObj = {
        'label': 'All',
        'type': 'All',
        'parentPackageNode': null,
        'parentClassNode': null,
        'parentInterfaceNode': null,
        'selected': false,
        'leaf': false,
        'expanded': true,
        'children': []
      };
      // Adding  Root Node
      this.createData.push(rootObj);
    }

    else if (this.selectedAgent == 'NodeJS') {
      let rootObj = {
        'label': 'All',
        'type': 'All',
        'leaf': false,
        'expanded': true,
        'children': []
      };
      // Adding  Root Node
      this.createData.push(rootObj);
    }

    this.createInstrumentation = true;
  }

  /**
   * Adding Node Menu
   * Context Menu Item Click operation 
   * */
  onNodeMenuItemClick(title) {
    this.nodeTitle = title;
    this.addDialogHeader = `Add ${this.nodeTitle.split(' ')[0]}`;
    if (this.selectedAgent == 'Java')
      this.addNodeDialog = true;
    else if (this.selectedAgent == 'NodeJS') {
      this.instrDialogDetail = new InstrumentationProfileForNodeJS();
      this.openNodeJSDialog = true;
    }
  }

  //To close node menu Dialog Box
  cancelAddingNode() {
    this.nodeLabel = '';
    if (this.selectedAgent == 'Java')
      this.addNodeDialog = false;
    else if (this.selectedAgent == 'NodeJS')
      this.openNodeJSDialog = false;
  }

  /** Dialog OK operation function */
  addNodeToTreeForUI() {
    if (this.selectedAgent == 'Java') {
      if (this.nodeObj['type'] === 'All') {
        if (this.nodeLabel.split('.').length == 0 || (this.nodeLabel.split('.')[1] == "" || this.nodeLabel.split('.')[0] == "")) {
          this._configUtilityService.errorMessage('Package name should be like [xyz.abc]');
          return;
        }
        var regex = /[ !@%^&*()+\-=\[\]{};':"\\|,<>\/?]/g;
        if (regex.test(this.nodeLabel)) {
          this._configUtilityService.errorMessage('Package name should not contain special character except `.`,`_` and `$`');
          return;
        }
      } else if (this.nodeObj['type'] === 'package') {
        var regex = /[ !@#%^&*()+\-=\[\]{};':"\\|,.<>\/?]/g;
        if (regex.test(this.nodeLabel)) {
          this._configUtilityService.errorMessage('Class/Interface name should not contain special characters except `_` and `$`');
          return;
        }
      } else if (this.nodeObj['type'] === 'class' || this.nodeObj['type'] === 'interface') {
        var regex = /[.<>]/g;
        if (regex.test(this.nodeLabel)) {
          this._configUtilityService.errorMessage('Method name should not contain dot(.) or angular braces(<>)');
          return;
        }
        if (this.nodeLabel.includes("&lt;init&gt;")) {
          this._configUtilityService.errorMessage('Invalid method name');
          return;
        }
        else {
          if (this.nodeLabel.indexOf('(') != -1 && this.nodeLabel.indexOf(')') == -1) {
            this._configUtilityService.errorMessage('Method name should either contain both brackets or it should be without brackets ');
            return;
          }
          else if (this.nodeLabel.indexOf('(') == -1 && this.nodeLabel.indexOf(')') != -1) {
            this._configUtilityService.errorMessage('Method name should either contain both brackets or it should be without brackets ');
            return;
          }
          else {
            this.nodeLabel = this.nodeLabel.replace(/\./g, '/');
          }
        }
      }

      if (this.nodeLabel.split(' ').length > 1) {
        this._configUtilityService.errorMessage('Space is not allowed');
        return;
      }

      if (this.nodeLabel === '') {
        this._configUtilityService.errorMessage('Fill blank Field');
        return;
      }
      this.addNodeToTree(this.nodeObj['type'], this.nodeLabel);
      this.addNodeDialog = false;

      this.nodeLabel = '';
    }

    // Adding entered dialog box data into NodeTree and object
    if (this.selectedAgent == 'NodeJS') {
      if (this.nodeObj['type'] === 'All') {
        if (this.instrDialogDetail.moduleName == null || this.instrDialogDetail.moduleName=='') {
          this._configUtilityService.errorMessage('Enter module name');
          return;
        }
        //For Space Validation to Module Name 
        var regex = /[ ]/g;
        if (regex.test(this.instrDialogDetail.moduleName)) {
          this._configUtilityService.errorMessage('Module name should not contain space');
          return;
        }
      }
      this.addNodeToTree(this.nodeObj['type'], this.instrDialogDetail.moduleName);
      if(!this.isDuplicateModuleDialog)
      {
        this.openNodeJSDialog = false;
      }
    }
  }

  /**Saving XML Node to XML File */
  saveModifiedXMLNodes(flag) {
    let dataToBeUploaded = [];
    let fileName = '';

    this.isApplyRTC = false;

    // Is from Create
    if (flag) {

      if (this.createData[0]['children'].length === 0) {
        this._configUtilityService.errorMessage("Add atleast one package before Saving");
        return;
      }
      if (this.saveFileName === '') {
        this._configUtilityService.errorMessage("File name is empty");
        return;
      }

      if (this.saveFileName.split(" ").length > 1) {
        this._configUtilityService.errorMessage("No spaces allowed in file name");
        return;
      }

      dataToBeUploaded = this.createData[0]['children'];
      fileName = this.saveFileName.split('.')[0];
    } else {  // from Edit Screen

      if (this.parsedData[0]['children'].length === 0) {
        this._configUtilityService.errorMessage("Add atleast one package before saving");
        return;
      }

      if (this.saveFileName.split(" ").length > 1) {
        this._configUtilityService.errorMessage("No spaces allowed in file name");
        return;
      }

      dataToBeUploaded = this.parsedData[0]['children'];
      // The below conditional check have been put to handle the Save As case
      if (this.saveEditedFileAs != '') {
        fileName = this.saveFileName.split('.')[0];
      }
      else {
        fileName = this.selectedFile.split('.')[0];
      }
    }

    var trMsg = ""
    if (sessionStorage.getItem("isTrNumber") == "null") {
      trMsg = "TRNotRunning"
    }
    else {
      trMsg = sessionStorage.getItem("isTrNumber")
    }
    if (this.selectedFile == "")
      this.selectedFile = " "
    //Send "RTC" msg to show the only those levels of topology which is applied at the time of test run
    this._configKeywordsService.getSelectedProfileDetails(this.selectedFile, trMsg).subscribe(data => {
      this.details = data["_body"];
      var msg = this.details.toString().substring(0, this.details.toString().length - 1);
      let confirmMsg = ""
      if (msg != "" && !this.isSaveAsEditedFile) {
        //To apply RTC only for save button
        this.isApplyRTC = true;
        confirmMsg = "<div>Selected instrumentation profile is used in topology. Click on 'Details' for more information<br></div>"
          + "<br>Do you want to save changes?"
      }
      else {
        confirmMsg = "Do you want to save changes?"
      }
      this.confirmationService.confirm({
        message: confirmMsg + '',
        header: 'Confirmation',
        accept: () => {
          let uploadArray = [];

          // Convert Tree Nodes to P.C.M or P.C or P array format so to save in hidden file
          for (let i = 0; i < dataToBeUploaded.length; i++) {
            let packageName = dataToBeUploaded[i].label;
            if (dataToBeUploaded[i].children.length === 0) {
              uploadArray.push(packageName);
            } else {
              for (let j = 0; j < dataToBeUploaded[i].children.length; j++) {
                if (dataToBeUploaded[i].children[j].label == dataToBeUploaded[i].children[j].parentInterfaceNode) {
                  let interfaceName = dataToBeUploaded[i].children[j].label;
                  if (dataToBeUploaded[i].children[j].children.length === 0) {
                    uploadArray.push(`${packageName}^${interfaceName}#`);
                  } else {
                    let methodList = dataToBeUploaded[i].children[j].children;
                    for (let k = 0; k < methodList.length; k++) {
                      let methodName = methodList[k].label;
                      uploadArray.push(`${packageName}^${interfaceName}^${methodName}#`);
                    }
                  }
                }
                else {
                  let className = dataToBeUploaded[i].children[j].label;
                  if (dataToBeUploaded[i].children[j].children.length === 0) {
                    uploadArray.push(`${packageName}^${className}`);
                  } else {
                    let methodList = dataToBeUploaded[i].children[j].children;
                    for (let k = 0; k < methodList.length; k++) {
                      let methodName = methodList[k].label;
                      uploadArray.push(`${packageName}^${className}^${methodName}`);
                    }
                  }
                }
              }
            }
          }

          // Creating Obj to be send to server
          let obj = {};
          obj['fileName'] = fileName;
          obj['data'] = uploadArray;
          obj['isCreate'] = flag;
          obj['userName'] = sessionStorage.getItem('sesLoginName');
          let that = this
          this._configKeywordsService.saveInstrumentedDataInXMLFile(obj).subscribe(data1 => {
            if (this.isApplyRTC) {
              //if test is online mode, return (run time changes)
              if (this.configHomeService.trData.switch == true && this.configHomeService.trData.status != null) {

                this._configKeywordsService.rtcInstrProfile(this.details + "%" + this.selectedFile, sessionStorage.getItem("sesLoginName")).subscribe(data => {
                  this.rtcMsg = [];
                  let commaSeparate = [];

                  if (data1['status'] === 'ok') {
                    this._configUtilityService.successMessage("File saved successfully")

                    if (data.length > 0) {
                      for (let i = 0; i < data.length; i++) {
                        commaSeparate = data[i].split(";");

                        //Result=Ok case
                        if (data[i].includes("Ok")) {

                          /** data[i] = nd_control_rep:action=modify;result=Ok;NDTomcat26:cavisson-ProLiant-ML110-G6:nsecom1=710;Nsecom:CAV-QA-30-29:Instance1=10335;
                          * 2nd index is the message to be displayed
                          * Same for OK and PartialError Case
                          */
                          for (let i = 2; i < commaSeparate.length - 1; i++) {
                            this.rtcMsg.push(commaSeparate[i])
                          }

                        }
                        //PartialError case
                        else if (data[i].includes("PartialError")) {
                          for (let i = 2; i < commaSeparate.length - 1; i++) {
                            this.rtcMsg.push(commaSeparate[i])
                          }
                        }

                        // Error case
                        else if (data[i].includes("Error")) {
                          if (commaSeparate.length > 2) {
                            for (let i = 2; i < commaSeparate.length - 1; i++) {
                              this.rtcMsg.push(commaSeparate[i])
                            }
                          }
                          //[nd_control_rep:action=modify;result=Error: There is no running test run] 
                          else {
                            let tempCommaSeparate: string;
                            tempCommaSeparate = commaSeparate[1];
                            let collonSeparate = tempCommaSeparate.split(":");
                            let value = collonSeparate[1].substring(0, collonSeparate[1].length - 1);
                            this.rtcMsg.push(value);
                          }
                        }

                      }
                      if (this.isApplyRTC) {
                        this.openRTCInfoDialog = true;
                      }
                    }
                    // Filling Drop Down with newly created file
                    this.createDropDown(fileName, () => {
                      this.saveFileName = '';
                      this.saveFileName = '';
                      this.clearWindow();
                    });
                  }
                })
              }
            }
            else {
              if (data1['status'] === 'ok') {
                this._configUtilityService.successMessage('File saved successfully');

                // Filling Drop Down with newly created file
                this.createDropDown(fileName, () => {
                  this.saveFileName = '';
                  this.saveFileName = '';
                  this.clearWindow();
                });
              }
            }
          });

        }
      });
      this.saveEditedFileAs = '';
      this.isSaveAsEditedFile = false;
    })
  }

  /**Saving NodeJS Node Data to NodeJS File */
  saveModifiedNodeJSNodes(flag) {
    let fileName = '';

    this.isApplyRTC = false;

    // Is from Create
    if (flag) {
      if (this.createData[0]['children'].length === 0) {
        this._configUtilityService.errorMessage("Add atleast one module before saving");
        return;
      }
      if (this.saveFileName === '') {
        this._configUtilityService.errorMessage("File name is empty");
        return;
      }

      if (this.saveFileName.split(" ").length > 1) {
        this._configUtilityService.errorMessage("No spaces allowed in file name");
        return;
      }

      fileName = this.saveFileName.split('.')[0];
    }
    else {
      if (this.parsedData[0]['children'].length === 0) {
        this._configUtilityService.errorMessage("Add atleast one module before saving");
        return;
      }

      if (this.saveFileName.split(" ").length > 1) {
        this._configUtilityService.errorMessage("No spaces allowed in file name");
        return;
      }

      // The below conditional check have been put to handle the Save As case
      if (this.saveEditedFileAs != '') {
        fileName = this.saveFileName.split('.')[0];
      }
      else {
        fileName = this.selectedFile.split('.')[0];
      }
    }

    var trMsg = ""
    if (sessionStorage.getItem("isTrNumber") == "null") {
      trMsg = "TRNotRunning"
    }
    else {
      trMsg = sessionStorage.getItem("isTrNumber")
    }
    if (this.selectedFile == "")
      this.selectedFile = " "

    //Send "RTC" msg to show the only those levels of topology which is applied at the time of test run
    this._configKeywordsService.getSelectedProfileDetails(this.selectedFile, trMsg).subscribe(data => {
      this.details = data["_body"];
      var msg = this.details.toString().substring(0, this.details.toString().length - 1);
      let confirmMsg = ""
      if (msg != "" && !this.isSaveAsEditedFile) {
        //To apply RTC only for save button
        this.isApplyRTC = true;
        confirmMsg = "<div>Selected instrumentation profile is used in topology. Click on 'Details' for more information<br></div>"
          + "<br>Do you want to save changes?"
      }
      else {
        confirmMsg = "Do you want to save changes?"
      }
      this.confirmationService.confirm({
        message: confirmMsg + '',
        header: 'Confirmation',
        accept: () => {
          // Creating Obj to be send to server
          let obj = {};
          obj['fileName'] = fileName;
          obj['objData'] = JSON.stringify(this.instrprofdata)
          obj['isCreate'] = flag;
          obj['userName'] = sessionStorage.getItem('sesLoginName');

          //To empty object
          this.instrprofdata = [];

          this._configKeywordsService.saveInstrumentedDataInJSONFile(obj).subscribe(data1 => {
            if (this.isApplyRTC) {
              //if test is online mode, return (run time changes)
              if (this.configHomeService.trData.switch == true && this.configHomeService.trData.status != null) {

                this._configKeywordsService.rtcInstrProfile(this.details + "%" + this.selectedFile, sessionStorage.getItem("sesLoginName")).subscribe(data => {
                  this.rtcMsg = [];
                  let commaSeparate = [];

                  if (data1['status'] === 'ok') {
                    this._configUtilityService.successMessage("File saved successfully")

                    if (data.length > 0) {
                      for (let i = 0; i < data.length; i++) {
                        commaSeparate = data[i].split(";");

                        //Result=Ok case
                        if (data[i].includes("Ok")) {

                          /** data[i] = nd_control_rep:action=modify;result=Ok;NDTomcat26:cavisson-ProLiant-ML110-G6:nsecom1=710;Nsecom:CAV-QA-30-29:Instance1=10335;
                          * 2nd index is the message to be displayed
                          * Same for OK and PartialError Case
                          */
                          for (let i = 2; i < commaSeparate.length - 1; i++) {
                            this.rtcMsg.push(commaSeparate[i])
                          }

                        }
                        //PartialError case
                        else if (data[i].includes("PartialError")) {
                          for (let i = 2; i < commaSeparate.length - 1; i++) {
                            this.rtcMsg.push(commaSeparate[i])
                          }
                        }
                        // Error case
                        else if (data[i].includes("Error")) {
                          if (commaSeparate.length > 2) {
                            for (let i = 2; i < commaSeparate.length - 1; i++) {
                              this.rtcMsg.push(commaSeparate[i])
                            }
                          }
                          //[nd_control_rep:action=modify;result=Error: There is no running test run] 
                          else {
                            let tempCommaSeparate: string;
                            tempCommaSeparate = commaSeparate[1];
                            let collonSeparate = tempCommaSeparate.split(":");
                            let value = collonSeparate[1].substring(0, collonSeparate[1].length - 1);
                            this.rtcMsg.push(value);
                          }
                        }

                      }
                      if (this.isApplyRTC) {
                        this.openRTCInfoDialog = true;
                      }
                    }
                    // Filling Drop Down with newly created file
                    this.createDropDown(fileName, () => {
                      this.saveFileName = '';
                      this.saveFileName = '';
                      this.clearWindow();
                    });
                  }
                })
              }
            }
            else {
              if (data1['status'] === 'ok') {
                this._configUtilityService.successMessage('File saved successfully');

                // Filling Drop Down with newly created file
                this.createDropDown(fileName, () => {
                  this.saveFileName = '';
                  this.saveFileName = '';
                  this.clearWindow();
                });
              }
            }
          });
        }
      });
      this.saveEditedFileAs = '';
      this.isSaveAsEditedFile = false;
    })
  }


  /**
   * This method is responsible for deleting Selected file
   */
  deleteSelectedFile() {
    //If no file selected
    if (this.selectedFile == '' || this.selectedFile == undefined) {
      this._configUtilityService.errorMessage("No file selected");
      return;
    }

    //Checking if selected file is applied to any profile or not
    this._configKeywordsService.getSelectedProfileDetails(this.selectedFile, "TRNotRunning").subscribe(data => {
      this.details = data["_body"];
      if (this.details.toString() != "") {
        this._configUtilityService.errorMessage("Could not delete. Selected instrumentation profile is used in topology. Click on 'Details' for more information")
      }
      else {
        // To delete selected file
        this.confirmationService.confirm({
          message: 'Do you want to delete the selected file?',
          header: 'Confirmation',
          accept: () => {
            //   let fileName = this.selectedXMLFile.split('.')[0];
            this._configKeywordsService.deleteFile(this.selectedFile).subscribe(data => {
              if (data['status'] === 'OK') {
                this._configUtilityService.successMessage('File deleted successfully');
                // Filling Drop Down with newly created file
                this.createDropDown("filename", () => {
                  this.clearWindow();
                });
              }
            });
          }
        });
      }
    })
  }

  /** Handling Expand of tree Nodes */
  expandAll(flag) {
    if (flag) {
      this.createData.forEach(node => {
        this.expandRecursive(node, true);
        this._configUtilityService.progressBarEmit({ flag: false, color: 'primary' });
      });
    } else {
      this.parsedData.forEach(node => {
        this.expandRecursive(node, true);
        this._configUtilityService.progressBarEmit({ flag: false, color: 'primary' });
      });
    }
  }

  /** Handling Collapse of tree Nodes */
  collapseAll(flag) {
    if (flag) {
      this.createData.forEach(node => {
        this.expandRecursive(node, false);
        this._configUtilityService.progressBarEmit({ flag: false, color: 'primary' });
      });
    } else {
      this.parsedData.forEach(node => {
        this.expandRecursive(node, false);
        this._configUtilityService.progressBarEmit({ flag: false, color: 'primary' });
      });
    }
  }

  /** Expand/Collapse Tree Node */
  private expandRecursive(node: TreeNode, isExpand: boolean) {
    this._configUtilityService.progressBarEmit({ flag: true, color: 'primary' });
    node.expanded = isExpand;
    if (node.children) {
      node.children.forEach(childNode => {
        this.expandRecursive(childNode, isExpand);
      });
    }
  }

  /* this method is used for remove data from gui*/
  clearWindow() {
    this.xmlFormat = "";
    this.xmlFormat = "No file selected";
    this.selectedFile = "";
    this.instrprofdata = [];
    this.editFile = false;
    this.createInstrumentation = false;
  }

  toTitleCase(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  /** Check for duplicate module entry while adding nodes */
  checkForDuplicacyOfModule(type, moduleName, arrToIterate) {
    let arr = arrToIterate[0]['children'];
    if (type === 'All') {
      for (let i = 0; i < arr.length; i++) {
        if (moduleName.toLowerCase() === arr[i].label.toLowerCase()) {
          return true;
        }
      }
    }
  }

  /** Check for duplicate entry while adding nodes */
  checkForDuplicacy(type, pckgName, classOrInterfaceName, methodName, arrToIterate) {
    let arr = arrToIterate[0]['children'];
    if (type === 'All') {
      for (let i = 0; i < arr.length; i++) {
        if (pckgName.toLowerCase() === arr[i].label.toLowerCase()) {
          return true;
        }
      }
    } else if (type === 'package') {
      for (let i = 0; i < arr.length; i++) {
        if (pckgName.toLowerCase() === arr[i].label.toLowerCase()) {
          if (arr[i].children.length == 0)
            return false;
          for (let j = 0; j < arr[i].children.length; j++) {
            if (classOrInterfaceName.toLowerCase() === arr[i].children[j].label.toLowerCase()) {
              return true;
            }
          }
        }
      }
    } else if (type === 'class' || type === 'interface') {
      for (let i = 0; i < arr.length; i++) {
        if (pckgName.toLowerCase() === arr[i].label.toLowerCase()) {
          for (let j = 0; j < arr[i].children.length; j++) {
            if (classOrInterfaceName.toLowerCase() === arr[i].children[j].label.toLowerCase()) {
              if (arr[i].children[j].children.length == 0)
                return false;
              for (let k = 0; k < arr[i].children[j].children.length; k++) {
                if (methodName.toLowerCase() === arr[i].children[j].children[k].label.toLowerCase()) {
                  return true;
                }
              }
            }
          }
        }
      }
    }
    return false;
  }

  //To show the dialog which contains details of instr profile that where is it applied
  openDetails() {
    if (this.selectedFile === undefined || this.selectedFile === "") {
      this._configUtilityService.errorMessage("Select a file to view its details");
      return;
    }

    //Send "TRNotRunning" message to get the details of everywhere where selected file is applied
    this._configKeywordsService.getSelectedProfileDetails(this.selectedFile, "TRNotRunning").subscribe(data => {
      if (data["_body"] != "") {
        this.details = data["_body"].split("&")
        this.details.pop()
      }
      else {
        this.details = ["Selected instrumentation profile is not applied anywhere"]
      }
      this.openDetailsDialog = true;
    })
  }
  /**
  * Purpose : To invoke the service responsible to open Help Notification Dialog 
  * related to the current component.
  */
  sendHelpNotification() {
    this._configKeywordsService.getHelpContent("Left Panel", "Instrumentation Profile Maker", "");
  }

  // This method will be called when user clicks on Save As button
  saveEditedFileNameAs() {

    if (this.saveEditedFileAs === '') {
      this._configUtilityService.errorMessage("File name is empty");
      return;
    }

    if (this.saveEditedFileAs.split(" ").length > 1) {
      this._configUtilityService.errorMessage("No spaces allowed in file name");
      return;
    }

    this.saveFileName = this.saveEditedFileAs;
    // The below flag has just been used to show the changes in confirmation message for Save As case 
    this.isSaveAsEditedFile = true;

    if (this.selectedAgent == 'Java') {
      this.saveModifiedXMLNodes(false);
    }
    else if (this.selectedAgent == 'NodeJS') {
      this.saveModifiedNodeJSNodes(false);
    }
  }

  ngOnDestroy() {
    this.isMakeXMLFile = false;
  }
}
