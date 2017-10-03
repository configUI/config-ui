import { Component, OnInit, OnChanges } from '@angular/core';
import { ConfigKeywordsService } from '../../services/config-keywords.service';
import { ConfigUiUtility } from '../../utils/config-utility';
import { ConfigUtilityService } from '../../services/config-utility.service';
import { Messages } from '../../constants/config-constant';

/**Added for XML Edit feature */
import { TreeNode, MenuItem } from 'primeng/primeng';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';

@Component({
  selector: 'app-config-import-instr-profile',
  templateUrl: './config-import-instr-profile.component.html',
  styleUrls: ['./config-import-instr-profile.component.css']
})

export class ConfigImportInstrProfileComponent implements OnInit {

  constructor(private _configKeywordsService: ConfigKeywordsService, private _configUtilityService: ConfigUtilityService, private confirmationService: ConfirmationService) { }

  xmlFormat: any;
  profileXMLFileList: any[];
  selectedXMLFile: string;
  isMakeXMLFile: boolean;
  openFileExplorerDialog: boolean = false;
  userName = sessionStorage.getItem("sesLoginName") == null ? "netstorm" : sessionStorage.getItem("sesLoginName");

  //Edit XML Tree Node
  editXMLFile: boolean = false;
  parsedXMLData: TreeNode[];
  selectedNode: TreeNode;
  xmlTreeMenu: MenuItem[];      //Add ContextMenuModule in app.module
  addNodeDialog: boolean = false;
  nodeLabel: string = '';
  nodeObj: Object = {};
  nodeTitle: string = '';
  addDialogHeader: string = '';

  //Create XML Tree Node
  createXMLData: TreeNode[] = [];
  saveXMLFileName: string = '';

  ngOnInit() {

    /* create Dropdown for xml files */
    this.createDropDown("filename", () => {});
    this.xmlFormat = "No file selected";

    this._configKeywordsService.fileListProvider.subscribe(data => {
      this.getFileList(data);
    });

  }

  createDropDown(filename, callback) {
    this._configKeywordsService.getInstrumentationProfileXMLFileList().subscribe(data => {
      this.profileXMLFileList = ConfigUiUtility.createDropdown(data);
      if (filename !== "filename")
        this.selectedXMLFile = filename;
      callback();
    });
  }

  /**used to open file manager */
  isFromXML: boolean = true;
  openFileManager() {
    this.openFileExplorerDialog = true;
    this.isMakeXMLFile = true;
    this.isFromXML = true;
  }

  /* this method is used for get xml data  on selected a text file from file manager*/
  getFileList(path) {
    if (path.includes(";")) {
      this._configUtilityService.errorMessage("Multiple files cannot be imported");
      return;
    }
    if(this.isFromXML) {
      if (!path.includes(".txt")) {
        this._configUtilityService.errorMessage("File extension not matched (i.e .txt)");
        return;
      }
    }
    if (this.isMakeXMLFile == true) {
      this.isMakeXMLFile = false;
      let filename = path.substring(path.lastIndexOf("/") + 1, path.lastIndexOf("."))
      filename = filename + ".xml";
      path = path + "@" + this.userName;
      this._configKeywordsService.getInstrumentationProfileXMLData(path).subscribe(data => {
        // const xml = beautify(data._body);
        this.xmlFormat = data._body;
        if (this.xmlFormat == "")
          this._configUtilityService.errorMessage("File contains no data or invalid data");
        else
          this._configUtilityService.successMessage("File imported successfully");
        this.createDropDown(filename, () => {});
      });
    }

    this.openFileExplorerDialog = false;
  }

  /* this method is used for get xml data  on selected a xml file from dropdown*/
  showSelectedXmlFileData() {
    if (this.selectedXMLFile === undefined || this.selectedXMLFile === "") {
      this._configUtilityService.errorMessage("Select a file to View");
      return;
    }
    this.xmlFormat = [];
    this._configKeywordsService.getXMLDataFromSelectedXMLFile(this.selectedXMLFile).subscribe(data => {
      // const xml = beautify(data._body);
      this.xmlFormat = data._body;
    });
    this.editXMLFile = false;
    this.createXMLInstrumentation = false;
  }

  /**
   * This function is responsible for reading and then converting XML file into tree node
   */
  editSelectedXMLFile() {
    if (this.selectedXMLFile === undefined || this.selectedXMLFile === "") {
      this._configUtilityService.errorMessage("Select a file to Edit");
      return;
    }
    this.parsedXMLData  = [];
    this._configKeywordsService.editXMLDataFromSelectedXMLFile(this.selectedXMLFile).subscribe(data => {
      this.parsedXMLData = data['backendDetailList'];
    });

    this.editXMLFile = true;
    this.createXMLInstrumentation = false;
  }

  /**
   * THis function is responsible for filling Context Menu on basis of node type
   */
  nodeSelect(event, flag) {

    let type = event['node']['type'];
    let parentClassNode = event['node']['parentClassNode'];
    let parentPackageNode = event['node']['parentPackageNode'];

    // Filling menu on basis of type
    if (type === 'All') {
      this.xmlTreeMenu = [
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
            this.nodeObj['isCreate'] = flag;
          }
        }
      ];
    } else if (type === 'package') {

      let contextMenuEvent = event;
      this.xmlTreeMenu = [
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
            this.nodeObj['isCreate'] = flag;
          }
        },
        {
          label: 'Delete Package',
          icon: 'fa-trash',
          'command': (event) => {
            this.confirmationService.confirm({
              message: 'Are you sure that you want to perform this action?',
	      header: 'Confirmation',
	      icon: 'fa fa-question-circle',
              accept: () => {
                this.deleteNodeFromTree(type, contextMenuEvent['node']['label'], contextMenuEvent);
              }
            });
          }
        }
      ];

    } else if (type === 'class') {
      let contextMenuEvent = event;
      this.xmlTreeMenu = [
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
            this.nodeObj['isCreate'] = flag;
          }
        },
        {
          label: 'Delete Class',
          icon: 'fa-trash',
          'command': (event) => {
            this.confirmationService.confirm({
              message: 'Are you sure that you want to perform this action?',
	      header: 'Confirmation',
	      icon: 'fa fa-question-circle',
              accept: () => {
                this.deleteNodeFromTree(type, contextMenuEvent['node']['label'], contextMenuEvent);
              }
            });
          }
        }
      ];

    } else if (type === 'method') {
      let contextMenuEvent = event;
      this.xmlTreeMenu = [
        {
          label: 'Delete Method',
          icon: 'fa-trash',
          'command': (event) => {
            this.confirmationService.confirm({
              message: 'Are you sure that you want to perform this action?',
	      header: 'Confirmation',
	      icon: 'fa fa-question-circle',
              accept: () => {
                this.deleteNodeFromTree(type, contextMenuEvent['node']['label'], contextMenuEvent);
              }
            });
          }
        }
      ];
    }

  }

  /**Add node to tree */
  addNodeToTree(type, label) {
    try {

      let xmlDataArr = [];
      if (this.nodeObj['isCreate']) {
        xmlDataArr = this.createXMLData;
      } else {
        xmlDataArr = this.parsedXMLData
      }

      // Adding Package
      if (type === 'All') {
	if (this.checkForDuplicacy('All', label, null, null, xmlDataArr)) {
          this._configUtilityService.errorMessage("Duplicate Package Entry is not allowed");
          return;
        }
        let obj = {
          'label': label,
          'type': 'package',
          'parentPackageNode': label,
          'parentClassNode': null,
          'selected': false,
          'leaf': false,
          'children': []
        };
        xmlDataArr[0]['children'].push(obj);
      } else if (type === 'package') {  // Add class
	if (this.checkForDuplicacy('package', this.nodeObj['parentPackageNode'], label, null, xmlDataArr)) {
          this._configUtilityService.errorMessage("Duplicate Class Entry is not allowed");
          return;
        }
        let obj = {
          'label': this.toTitleCase(label),
          'type': 'class',
          'parentPackageNode': this.nodeObj['parentPackageNode'],
          'parentClassNode': this.toTitleCase(label),
          'selected': false,
          'leaf': false,
          'children': []
        };

        let index = 0;
        for (let i = 0; i < xmlDataArr[0]['children'].length; i++) {
          // If Package found, add class
          if (this.nodeObj['parentPackageNode'] === xmlDataArr[0]['children'][i]['label']) {
            index = i;
            break;
          }
        }
        xmlDataArr[0]['children'][index]['children'].push(obj);
      } else if (type === 'class') {  // Add Method
	
        let packageName = this.nodeObj['parentPackageNode'];
        let className = this.nodeObj['parentClassNode'];

	if (this.checkForDuplicacy('class', packageName, className, label, xmlDataArr)) {
          this._configUtilityService.errorMessage("Duplicate Method Entry is not allowed");
          return;
        }

        let obj = {
          'label': label,
          'type': 'method',
          'parentPackageNode': this.nodeObj['parentPackageNode'],
          'parentClassNode': this.nodeObj['parentClassNode'],
          'selected': false,
          'leaf': false,
          'children': []
        };

        let packgIndex;
        let classIndex;

        for (let i = 0; i < xmlDataArr[0]['children'].length; i++) {
          // If Package found, add class
          if (packageName === xmlDataArr[0]['children'][i]['label']) {
            packgIndex = i;
            for (let j = 0; j < xmlDataArr[0]['children'][i]['children'].length; j++) {
              if (className === xmlDataArr[0]['children'][i]['children'][j]['label']) {
                classIndex = j;
                break;
              }
            }
          }
        }
        xmlDataArr[0]['children'][packgIndex]['children'][classIndex].children.push(obj);
      }

      // Checking if XML Creation or Edition is being done
      if (this.nodeObj['isCreate']) {
        this.createXMLData = xmlDataArr;
      } else {
        this.parsedXMLData = xmlDataArr;
      }

    } catch (err) {
      console.error(err);
    }
  }

  /**delete node from tree */
  deleteNodeFromTree(type, label, contextMenuEvent) {
    try {
      
      let xmlDataArr = [];
      if (this.nodeObj['isCreate']) {
        xmlDataArr = this.createXMLData;
      } else {
        xmlDataArr = this.parsedXMLData
      }  

      const mainXMLData = xmlDataArr[0]['children'];

      // Slicing Packing from main tree
      if (type === 'package') {
        for (let index = 0; index < mainXMLData.length; index++) {
          if (label === mainXMLData[index].label) {
            xmlDataArr[0]['children'].splice(index, 1);
            break;
          }
        }
      } else if (type === 'class') {    // Slicing Classes
        for (let index = 0; index < mainXMLData.length; index++) {
          if (contextMenuEvent['node']['parentPackageNode'] === mainXMLData[index]['parentPackageNode']) {
            for (let j = 0; j < mainXMLData[index]['children'].length; j++) {
              if (label === mainXMLData[index]['children'][j].label) {
                xmlDataArr[0]['children'][index]['children'].splice(j, 1);
                break;
              }
            }
          }
        }
      } else if (type === 'method') {    // Slicing Method
        for (let index = 0; index < mainXMLData.length; index++) {
          if (contextMenuEvent['node']['parentPackageNode'] === mainXMLData[index]['parentPackageNode']) {
            for (let j = 0; j < mainXMLData[index]['children'].length; j++) {
              if (contextMenuEvent['node']['parentClassNode'] === mainXMLData[index]['children'][j]['parentClassNode']) {
                for (let k = 0; k < mainXMLData[index]['children'][j]['children'].length; k++) {
                  if (label === mainXMLData[index]['children'][j]['children'][k]['label']) {
                    xmlDataArr[0]['children'][index]['children'][j]['children'].splice(k, 1);
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
        this.createXMLData = xmlDataArr;
      } else {
        this.parsedXMLData = xmlDataArr;
      }
    } catch (err) {
      console.error(err);
    }
  }

  /**This method is responsible for creating XML Nodes */
  createXMLInstrumentation: boolean = false;
  createXMLInstrumentationFile() {

    // Removing Selected XML file, if any
    this.selectedXMLFile = '';

    this.saveXMLFileName = '';
    this.createXMLData = [];
    let rootObj = {
      'label': 'All',
      'type': 'All',
      'parentPackageNode': null,
      'parentClassNode': null,
      'selected': false,
      'leaf': false,
      'children': []
    };

    // Adding  Root Node
    this.createXMLData.push(rootObj);
    this.createXMLInstrumentation = true;
  }

  /**
   * XML Adding Node Menu
   * Context Menu Item Click operation 
   * */
  onNodeMenuItemClick(title) {
    this.nodeTitle = title;
    this.addDialogHeader = `Add ${this.nodeTitle.split(' ')[0]}`;
    this.addNodeDialog = true;
  }
  cancelAddingNode() {
    this.nodeLabel = '';
    this.addNodeDialog = false;
  }

  /** Dialog OK operation function */
  addXMLNodeToTree() {

     if (this.nodeObj['type'] === 'All') {
      if (this.nodeLabel.split('.').length == 0 || (this.nodeLabel.split('.')[1] == "" || this.nodeLabel.split('.')[0] == "") ) {
        this._configUtilityService.errorMessage('Package Name should be like [xyz.abc]');
        return;
      }
      var regex = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?]/g;
      if (regex.test(this.nodeLabel)) {
        this._configUtilityService.errorMessage('Package Name should not special character except `.` ');
        return;
      }
    } else if (this.nodeObj['type'] === 'package' ) {
      var regex = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g;
      if (regex.test(this.nodeLabel)) {
        this._configUtilityService.errorMessage('Class Name should not contain ');
        return;
      }
    } else if (this.nodeObj['type'] === 'class') {
      var regex = /[ !@#$%^&*_+\-=\[\]{};':"\\|,.<>\/?]/g;
      if (regex.test(this.nodeLabel)) {
        this._configUtilityService.errorMessage('Method Name should be like [methodName(xyz) or methodName()]');
        return;
      }

      if (this.nodeLabel.indexOf("(") === -1 || this.nodeLabel.indexOf(")") === -1 || this.nodeLabel.substring(this.nodeLabel.length -1, this.nodeLabel.length) !== ')') {
        this._configUtilityService.errorMessage('Method Name should be like [methodName(xyz) or methodName()]');
        return;
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

  /**Saving XML Node to XML File */
  saveModifiedXMLNodes(flag) {

    let dataToBeUploaded = [];
    let fileName = '';

    // Is from Create
    if (flag) {

      if (this.createXMLData[0]['children'].length === 0) {
        this._configUtilityService.errorMessage("Add atleast one package before Saving");
        return;
      }
      if (this.saveXMLFileName === '') {
        this._configUtilityService.errorMessage("Enter File Name before Saving");
        return;
      }

      if (this.saveXMLFileName.split(" ").length > 1) {
        this._configUtilityService.errorMessage("No spaces allowed in File Name");
        return;
      }

      dataToBeUploaded = this.createXMLData[0]['children'];
      fileName = this.saveXMLFileName.split('.')[0];
    } else {  // from Edit Screen

      if (this.parsedXMLData[0]['children'].length === 0) {
        this._configUtilityService.errorMessage("Add atleast one package before Saving");
        return;
      }

      if (this.saveXMLFileName.split(" ").length > 1) {
        this._configUtilityService.errorMessage("No spaces allowed in File Name");
        return;
      }

      dataToBeUploaded = this.parsedXMLData[0]['children'];
      fileName = this.selectedXMLFile.split('.')[0];
    }

    this.confirmationService.confirm({
      message: 'Are you sure that you want to save the changes?',
      header: 'Confirmation',
      icon: 'fa fa-question-circle',
      accept: () => {
        let uploadArray = [];

        // Convert Tree Nodes to P.C.M or P.C or P array format so to save in hidden file
        for (let i = 0; i < dataToBeUploaded.length; i++) {
          let packageName = dataToBeUploaded[i].label;
          if (dataToBeUploaded[i].children.length === 0) {
            uploadArray.push(packageName);
          } else {
            for (let j = 0; j < dataToBeUploaded[i].children.length; j++) {
              let className = dataToBeUploaded[i].children[j].label;
              if (dataToBeUploaded[i].children[j].children.length === 0) {
                uploadArray.push(`${packageName}.${className}`);
              } else {
                let methodList = dataToBeUploaded[i].children[j].children;
                for (let k = 0; k < methodList.length; k++) {
                  let methodName = methodList[k].label;
                  uploadArray.push(`${packageName}.${className}.${methodName}`);
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
        this._configKeywordsService.saveInstrumentedDataInXMLFile(obj).subscribe(data => {
          if (data['status'] === 'ok') {
            this._configUtilityService.successMessage('File Saved Successfully');

            // Filling Drop Down with newly created file
            this.createDropDown(fileName, () => {
		this.clearWindow();
	        this.saveXMLFileName = '';
		this.selectedXMLFile = "";
	    });
          }
        });

      }
    });
  }

  /**
   * This method is responsible for deleting Selected XML file
   */
  deleteSelectedXMLFile() {
    
    //If no file selected
    if( this.selectedXMLFile == '' || this.selectedXMLFile == undefined) {
      this._configUtilityService.errorMessage("No File Selected");
      return;
    }

    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete the selected File?',
      header: 'Confirmation',
      icon: 'fa fa-question-circle',
      accept: () => {
        let fileName = this.selectedXMLFile.split('.')[0];
        this._configKeywordsService.deleteXMLFile(fileName).subscribe(data => {
          if (data['status'] === 'OK') {
            this._configUtilityService.successMessage('File Deleted Successfully');
             // Filling Drop Down with newly created file
            this.createDropDown("filename", () => {
	    	this.clearWindow();
	    });
          }
        });
      }
    });
  }

  /** Handling Expand and collapse of tree Nodes */
  expandAll(flag) {
    if (flag) {
      this.createXMLData.forEach(node => {
        this.expandRecursive(node, true);
      });
    } else {
      this.parsedXMLData.forEach(node => {
        this.expandRecursive(node, true);
      });
    }
  }
  collapseAll(flag) {
    if (flag) {
      this.createXMLData.forEach(node => {
        this.expandRecursive(node, false);
      });
    } else {
      this.parsedXMLData.forEach(node => {
        this.expandRecursive(node, false);
      });
    }
  }

  /** Expand/Collapse Tree Node */
  private expandRecursive(node: TreeNode, isExpand: boolean) {
    node.expanded = isExpand;
    if (node.children) {
      node.children.forEach(childNode => {
        this.expandRecursive(childNode, isExpand);
      });
    }
  }

  /* this method is used for remove xml data from gui*/
  clearWindow() {
    this.xmlFormat = "";
    this.xmlFormat = "No file selected";
    this.selectedXMLFile = "";
    this.editXMLFile = false;
    this.createXMLInstrumentation = false;
  }

  toTitleCase(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  /** Check for duplicate entry while adding nodes */
  checkForDuplicacy(type , pckgName, className, methodName, arrToIterate) {
    let arr = arrToIterate[0]['children'];
    if (type === 'All') {
      for (let i = 0 ; i < arr.length ; i++) {
        if (pckgName.toLowerCase() === arr[i].label.toLowerCase()) {
          return true;
        }
      }
    } else if (type === 'package') {
      for (let i = 0 ; i < arr.length ; i++) {
        if (pckgName.toLowerCase() === arr[i].label.toLowerCase()) {
	  if(arr[i].children.length == 0)
	    return false;
          for (let j = 0 ; j < arr[i].children.length ; j++) {
            if (className.toLowerCase() === arr[i].children[j].label.toLowerCase()) {
              return true;
            }
          }
        }
      }
    } else if (type === 'class') {
      for (let i = 0 ; i < arr.length ; i++) {
        if (pckgName.toLowerCase() === arr[i].label.toLowerCase()) {
          for (let j = 0 ; j < arr[i].children.length ; j++) {
            if (className.toLowerCase() === arr[i].children[j].label.toLowerCase()) {
   	      if(arr[i].children[j].children.length == 0)
		return false;
              for (let k = 0 ; k < arr[i].children[j].children.length ; k++) {
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
}
