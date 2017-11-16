import { Component, OnInit } from '@angular/core';

import { CavMenuNavigatorService } from '../../services/cav-menu-navigator.service';
import {AlertConfigService} from '../../services/alert-config-service';

import {CavConfigService} from '../../services/cav-config.service';
import { TimerService } from '../../services/timer.service';

import { AuthenticationService } from '../../services/authentication.service';
import { CavTopPanelNavigationService } from '../../services/cav-top-panel-navigation.service';

import { MenuItem } from 'primeng/primeng';
import { Router } from '@angular/router';
import * as moment from 'moment';
import * as jQuery from 'jquery';
import 'moment-timezone';
import { Http, Response } from '@angular/http';

@Component({
  selector: 'app-config-header-top-nav-bar',
  templateUrl: './config-header-top-nav-bar.html',
  styleUrls: ['./config-header-top-nav-bar.scss']
})
export class ConfigTopHeaderNavBarComponent implements OnInit {
  
    topNavMenu = [];
    username = 'netstorm';
    date: string;
    timeZoneId: string;
    timeZone: string;
    items: MenuItem[];
    displaySettingGui: boolean;
    visible: boolean = true;
    oldPasswordText: string = "";
    newPasswordText: string = "";
    confirmPasswordText: string = "";
    displayRefreshIntervalGui: boolean = false;
    testRunRefreshInterval: string;
    alertRefreshInterval: string;
    heapRefreshInterval: string;
    cpuUtiliRefreshInterval: string;
    overAllRefreshInterval: string;
    diskSpaceRefreshInterval: string;
    checkedConfigValue: boolean = false;
    /*Toggle Icons.*/
    toggleIcon = "keyboard_arrow_right";
    mainNavLinks: Array<any> = [];
    productType: String = "NS";
    runningTestRunNumber: number = -1;
    alertRefreshIntervals: number;
    isShowCapacity: boolean;
    isShowBehavior: boolean;
    cpCriticalCount: string;
    cpMajorCount: string;
    cpMinorCount: string;
    bhCriticalCount: string;
    bhMajorCount: string;
    bhMinorCount: string; 
    isHpd = true;
    checkNO = '';
  
    private timeSubscription = null;
    arrThemeNames = [[{text: 1, isActive: false, color: '#EDEDED'}, {text: 2, isActive: true, color: '#6C9DD1'}, 
    {text: 3, isActive: false, color: '#494949'}],
    [{text: 4, isActive: false, color: '#307565'}, {text: 5, isActive: false, color: '#E6CB91'} 
    ,{text: 6, isActive: false, color: '#c9c9c9'}/* [{text: 7, isActive: false, color: '#00ff7f'},
                     {text: 8, isActive: false, color: '#ccc0b7'}, {text: 9, isActive: false, color: '#e152d4'}*/]];
  
    dcList:MenuItem[];
    dcArr: any[] = [];
    isMultiDCEnable: string = sessionStorage.getItem('isMultiDCMode');
    private testInfoRefreshIntervalUrl = '';
    constructor(private _http: Http, 
                private cavMenuNavigatorService: CavMenuNavigatorService, 
                private authenticationService: AuthenticationService, 
                private router: Router,
                public _navService: CavTopPanelNavigationService,
                private _config: CavConfigService,
                private _timerService: TimerService,
                private _alertConfig: AlertConfigService
               ) {
  
      this.username = _config.$userName;
      /*Setting the theme */
      if (window['theme'] === undefined || window['theme'] === null) {
        this.onChangeTheme(null, localStorage.getItem('ProductTheme'));
      } else {
        this.activateTheme();
      }
      this.testInfoRefreshIntervalUrl = _config.$appPath + "/productSummary/SummaryWebService/getRefreshIntervalTime/";
  
      // default value of of header 
       this.items = [{ label: 'Logout', icon: 'fa-sign-out', command: () => { this.actionPerformed(); } },
      { label: 'Change Password', icon: 'fa-cog', command: () => { this.changePasswordGUI(); } },
      { label: 'Refresh Interval Time', icon: 'fa-cog', command: () => { this.changeRefreshInterval(); } }];
  
      /* Getting navigation links. */
      this.mainNavLinks = _navService.getNavigationLinks();
  
  _navService.tabServiceProvider$.subscribe(
    tab => {
      if (tab === 'home') {
        this.items = [{ label: 'Logout', icon: 'fa-sign-out', command: () => { this.actionPerformed(); } },
      { label: 'Change Password', icon: 'fa-cog', command: () => { this.changePasswordGUI(); } },
      { label: 'Refresh Interval Time', icon: 'fa-cog', command: () => { this.changeRefreshInterval(); } },
      { label: 'Help', icon: 'fa fa-question-circle', command: () => { this.pageHelp(); } }];
      } else {
        this.items = [{ label: 'Logout', icon: 'fa-sign-out', command: () => { this.actionPerformed(); } },
      { label: 'Change Password', icon: 'fa-cog', command: () => { this.changePasswordGUI(); } },
      { label: 'Help', icon: 'fa fa-question-circle', command: () => { this.pageHelp(); } }];
      }
    }
  );
  
  }
    showFilteredAlertType(alertType:string, severity:string)
    {
      if (alertType == 'Capacity' || alertType == 'Behavior')
      {
        sessionStorage.setItem("moduleName", "active");
        this._alertConfig.$activeAlertType = alertType;
        this._alertConfig.$activeSeverityType = severity;
        this._alertConfig.$moduleName = "active";
        this._alertConfig.$runningTestRunNum = this.runningTestRunNumber;
        this._alertConfig.setAlertCounterValue(alertType,severity);
        this._navService.addNewNaviationLink("alert");
        this._navService.addDCNameForScreen("alert", this._config.getActiveDC());
        this.router.navigate(['/home/alert/active'])
      }
    }
  
    initializeTimerForServerTime() {
      //Displaying current date and time
      this.timeZoneId = sessionStorage.getItem('timeZoneId');
      this.timeZone = sessionStorage.getItem('timeZone');
      //incremented 3 milisecond
     // this.date = moment().tz(this.timeZoneId);
    }
    updateAlertCounter()
    {
      setInterval(() =>
      {
        var activeDC = '';
        if(this._config.getINSAggrPrefix().indexOf('node') != -1 || this._config.getINSAggrPrefix().indexOf('tomcat') != -1)
          activeDC = this._config.getActiveDC();
  
        this._http.get(this._config.getINSAggrPrefix () + activeDC + '/DashboardServer/web/AlertDataService/alertCounter').map(res => res.json()).subscribe(res =>
        {
          this.cpCriticalCount = res.cpCriticalCount;
          this.cpMajorCount = res.cpMajorCount;
          this.cpMinorCount = res.cpMinorCount;
          this.bhCriticalCount = res.bhCriticalCount;
          this.bhMajorCount = res.bhMajorCount;
          this.bhMinorCount = res.bhMinorCount;
        });
      },this.alertRefreshIntervals);
    }
    ngOnInit() {
      try {
        this.username = sessionStorage.getItem("sesLoginName");
        this.initializeTimerForServerTime();
        this.productType = sessionStorage.getItem("sessServerTitle");
        this.getTestRunInfo();
        this.timeSubscription = this._timerService.getTimerSubscription().subscribe(
          value =>  { //this.date = moment().tz(this.timeZoneId).format('MM/DD/YYYY HH:mm:ss');
         }
  
        );
  
        if(this.isMultiDCEnable == "true")
          this.dcList = this.getDCList();
          this.checkNO = sessionStorage.getItem("sessServerCheck");
         } catch (e) {
        console.error(e);
      }
    }
    getTestRunInfo()
    {
      var activeDC = '';
      if(this._config.getINSAggrPrefix().indexOf('node') != -1 || this._config.getINSAggrPrefix().indexOf('tomcat') != -1)
        activeDC = this._config.getActiveDC();
  
      let url = this._config.getINSAggrPrefix() + activeDC + '/DashboardServer/web/AlertDataService/alertCounter';
  
      console.log('Alert URL = ', url);
      // this._http.get("url").map(res => res.json()).subscribe(res =>
      // {
      //   this.cpCriticalCount = res.cpCriticalCount;
      //   this.cpMajorCount = res.cpMajorCount;
      //   this.cpMinorCount = res.cpMinorCount;
      //   this.bhCriticalCount = res.bhCriticalCount;
      //   this.bhMajorCount = res.bhMajorCount;
      //   this.bhMinorCount = res.bhMinorCount;
      // });
    //   this._http.get(this._config.$appPath + '/productSummary/SummaryWebService/getRunningTestRunInfo').map(res => res.json()).subscribe(res =>
    //   {
    //     if(res != undefined && res != "") 
    //     {
    //       this.runningTestRunNumber = Number.parseInt(res);
    // this._alertConfig.$runningTestRunNum = this.runningTestRunNumber;
          
    // if(this.runningTestRunNumber > 0)
    //       {
    //         if(sessionStorage.getItem("strServerType") == "NC" || sessionStorage.getItem("strServerType") == "NS" || sessionStorage.getItem("strServerType") == "NS>NO")
    //           this.isShowCapacity = true;
    //         else
    //         {
    //           this.isShowCapacity = true;
    //           this.isShowBehavior = true;
    //         }
    //       }
    //     }
    //     this._http.get(this._config.$appPath + '/productSummary/SummaryWebService/getAlertRefInterval?trNum=' + this.runningTestRunNumber).map(res => res.json()).subscribe(res =>
    //     {
    //       this.alertRefreshIntervals = Number.parseInt(res);
    //       this.updateAlertCounter();
    //     });
    //   }); 
    } 
    selectedDC: string = 'ALL';
    dcInfoMap: any[] = [];
    getDCList() {
      var dcObj = [];
      this._http.get(this._config.$serverIP + 'node/ALL/dcinfo').map(res => res.json()).subscribe(
        res =>
        {
           this.dcInfoMap = res;
  
           for(var dc in this.dcInfoMap) {
             this.dcArr.push(this.dcInfoMap[dc]['dc']);
           }
     
     this.dcArr.unshift('ALL');
           for(var i = 0 ; i < this.dcArr.length ; i++) {
             dcObj.push({
               label: this.dcArr[i],
               command : (event) => {
            if(event.target !== undefined)
                          this.changeDataCenter(event.target.innerText);
                        else
                          this.changeDataCenter(event.item.label);
                      }
               });
           }
          this._config.setDCInfoObj(this.dcInfoMap);
        }
      );
      return dcObj;  
  }
  
    /*Firing Event.*/
    onToggleMenuNavigation() {
      this.cavMenuNavigatorService.toggleNavMenuAction("toggle");
    }
  
   /** This method is called when tab is changed by clicking on it. */
    onNavTabChange(tab) {
     try {
        this._navService.activateNavigationLink(tab.name);
        /*Getting navigation links again. */
        this.mainNavLinks = this._navService.getNavigationLinks();
        this._navService.tabBroadcaster.next(tab.name);
     } catch (e) {
       console.error(e);
     }
    }
  
    changeDataCenter(dcName) {
        try{
       this.selectedDC = dcName;
            this._config.$appPath = `//${this._config.$host}:${this._config.$port}/tomcat/${dcName}/ProductUI`;
      sessionStorage.setItem('appPathForDC', `//${this._config.$host}:${this._config.$port}/tomcat/${dcName}/ProductUI`);
  
            //var returnToHome = this._navService.closeDCTabsOtherThanActive(dcName);
  
            // Setting Current DC
            this._config.setActiveDC(dcName);
      sessionStorage.setItem('activeDC', dcName);
  
            var currentPg = window.location.hash;
            currentPg = (currentPg.indexOf('?') == -1) ? currentPg.substring(1, currentPg.length) : (currentPg.substring(1, currentPg.length)).substring(0, currentPg.indexOf('?') - 1);
  
            this.router.navigateByUrl('/home/editScenario', true);
      
      let addDCFlag = this.addDCNamePerScreen(currentPg, dcName);		//Adds dc name to tab in nav obj 
  
      if(!addDCFlag)
        return;
  
            setTimeout(() => {
    //          if(returnToHome && !currentPg.startsWith('/home/dashboard'))
      //          this.router.navigate(['/home/panel/widget']);
        //      else
                this.router.navigate([currentPg]);
            },30);
  
            this.getTestRunInfo();	//Gets alert counter
  
        } catch(e) {
      console.log('In method changeDataCenter. Exception:',e);
        }
    }
  
    /** Add DC Name accoring to tab*/
    addDCNamePerScreen(currentPg, dcName) {
      if(currentPg.indexOf('/home/scenario') != -1){
    this._navService.removeNavigationLink('scenariogui');
    this._navService.addDCNameForScreen('scenario', dcName);
    this.router.navigate(["/home/openTotalScenario"]);
    return false;
      }
      else if(currentPg.indexOf('/home/dashboard') != -1) {
        this._navService.addDCNameForScreen('dashboard', dcName);
      }
      else if(currentPg.indexOf('/home/openSessionGrid') != -1) {
        this._navService.addDCNameForScreen('session', dcName);
      }
      else if(currentPg.indexOf('/home/openTotalScenario') != -1) {
        this._navService.addDCNameForScreen('scenario', dcName);
      }
      else if(currentPg.indexOf('/home/alert') != -1) {
        this._navService.addDCNameForScreen('alert', dcName);
      }
      else if(currentPg.indexOf('/home/openTestRunGrid') != -1) {
        this._navService.addDCNameForScreen('testrun', dcName);
      }
      else if(currentPg.indexOf('/home/openScenarioProfile') != -1) {
        this._navService.addDCNameForScreen('scenario', dcName);
      }
      else if (currentPg.indexOf('/home/openTestRunTimeSlot') != -1) {
        this._navService.addDCNameForScreen('timeSlot', dcName);
      }
      else if (currentPg.indexOf('/home/config') != -1) {
        this._navService.addDCNameForScreen('ndConfig', dcName); 
      }
      else if (currentPg.indexOf('/home/ndAgent') != -1) {
        this._navService.addDCNameForScreen('ndAgent', dcName);
      }
      else if (currentPg.indexOf('/home/transaction-detail') != -1) {
        this._navService.addDCNameForScreen('transaction-detail', dcName);
      }
      else if (currentPg.indexOf('/home/sqlQuery') != -1) {
        this._navService.addDCNameForScreen('sqlQuery', dcName);
      }
      else if (currentPg.indexOf('/home/accesslog') != -1) {
        this._navService.addDCNameForScreen('accesslog', dcName);
      }
      else if (currentPg.indexOf('/home/ddr/main') != -1) {
        this._navService.addDCNameForScreen('weblogic', dcName);
      }
      else if (currentPg.indexOf('/home/ddr/view') != -1) {
        this._navService.addDCNameForScreen('viewThreadDump', dcName);
      }
      else if (currentPg.indexOf('/home/ddr/flowpath') != -1) {
        this._navService.addDCNameForScreen('flowpath', dcName);
      }
      else if (currentPg.indexOf('/home/ddr/query') != -1) {
        this._navService.addDCNameForScreen('dbQuery', dcName);
      }
      else if (currentPg.indexOf('/home/ddr/exception') != -1) {
        this._navService.addDCNameForScreen('exception', dcName);
      }
      else if (currentPg.indexOf('/home/ddr/methodtiming') != -1) {
        this._navService.addDCNameForScreen('methodtiming', dcName);
      }
      else if (currentPg.indexOf('/home/ddr/servicemethodtiming') != -1) {
        this._navService.addDCNameForScreen('servicemethodtiming', dcName);
      }
      else if (currentPg.indexOf('/home/threadhotspot') != -1) {
        this._navService.addDCNameForScreen('threadhotspot', dcName);
      }
      else if (currentPg.indexOf('/home/addServices') != -1) {
        this._navService.addDCNameForScreen('Add', dcName);
      }
      else if (currentPg.indexOf('/home/recordServices') != -1) {
        this._navService.addDCNameForScreen('Record', dcName);
      }
      else if (currentPg.indexOf('/home/indexDataSource') != -1) {
        this._navService.addDCNameForScreen('indexDataSource', dcName);
      }
      else if (currentPg.indexOf('/home/globalHttpMain/globalHttpSettings') != -1) {
        this._navService.addDCNameForScreen('configuration', dcName);
      }
      else if (currentPg.indexOf('/home/requestTrace') != -1) {
        this._navService.addDCNameForScreen('Request Trace', dcName);
      }
      else if (currentPg.indexOf('/home/sslManagement') != -1) {
        this._navService.addDCNameForScreen('SSl Management', dcName);
      }
      else if (currentPg.indexOf('/home/dataProcessor') != -1) {
        this._navService.addDCNameForScreen('Data Processor', dcName);
      }
      else if (currentPg.indexOf('/home/dataManager') != -1) {
        this._navService.addDCNameForScreen('Data Manager', dcName);
      }
      else if (currentPg.indexOf('/home/manageServices') != -1) {
        this._navService.addDCNameForScreen('Manage', dcName);
      }
      else if (currentPg.indexOf('/home/indexDataSource') != -1) {
        this._navService.addDCNameForScreen('indexDataSource', dcName);
      }
      else if (currentPg.indexOf('/home/requestTrace') != -1) {
        this._navService.addDCNameForScreen('Request Trace', dcName);
      }
      else if (currentPg.indexOf('/home/sslManagement') != -1) {
        this._navService.addDCNameForScreen('SSl Management', dcName);
      }
      else if (currentPg.indexOf('/home/dataProcessor') != -1) {
        this._navService.addDCNameForScreen('Data Processor', dcName);
      }
      else if (currentPg.indexOf('/home/dataManager') != -1) {
        this._navService.addDCNameForScreen('Data Manager', dcName);
      }
  
      return true;
    }
  
    /* for Open Change Password Gui*/
    changePasswordGUI() {
      this.oldPasswordText = "";
      this.confirmPasswordText = "";
      this.newPasswordText = "";
      this.displaySettingGui = true;
    }
  
    changePassword() {
   
      if (this.oldPasswordText != "")  // Old pwd is entered
      {
        if ((this.newPasswordText == "") && (this.confirmPasswordText == "")) {
          alert("To change password, please enter new and confirm password");
          return false;
        }
        else if ((this.newPasswordText != "") && (this.confirmPasswordText == "")) {
          alert("To change password, please enter confirm password");
          return false;
        }
        else if ((this.newPasswordText == "") && (this.confirmPasswordText != "")) {
          alert("To change password, please enter new password");
          return false;
        }
      }
      else if (this.oldPasswordText == "") // Old Pwd is not entered
      {
        if ((this.newPasswordText != "") && (this.confirmPasswordText == "")) {
          alert("To change password, please enter old and confirm password");
          return false;
        }
  
        else if ((this.newPasswordText == "") && (this.confirmPasswordText != "")) {
          alert("To change password, please enter old and new password");
          return false;
        }
        else if ((this.newPasswordText != "") && (this.confirmPasswordText != "")) {
          alert("To change password, please enter old password");
          return false;
        }
        else if ((this.newPasswordText == "") && (this.confirmPasswordText == "")) {
          alert("To change password, please enter all fields");
          return false;
        }
      }
  
      if ((this.oldPasswordText != "") && (this.newPasswordText != "") && (this.confirmPasswordText != "")) {
        // All three are entered
        if (this.validatePassword(this.newPasswordText) == false)
          return false;
  
        if (this.validatePassword(this.confirmPasswordText) == false)
          return false;
  
        if (this.newPasswordText != this.confirmPasswordText) {
          alert("New password and confirm password should be same");
          return false;
        }
      }
      
      var Url = this._config.$serverIP + 'DashboardServer/acl/user/changePassword?userName=' + this._config.$userName + '&passWord=' + this.newPasswordText + "&oldpassWord=" + this.oldPasswordText
              
       this._http.get(Url).map(res => res.json()).subscribe(res => (this.confirmGui(res)));
  
    }
  
    validatePassword(password) {
  
  
      if (password == "") {
        alert("Please enter password.\n");
        return false;
      }
      else if (password.length <5||password.length > 30) {
        alert("Please use between 5 and 30 Alphanumeric characters and special character For Password \n");
        return false;
      }
       
      return true;
    }
  
    confirmGui(res: any) {
     
      if (res.errorCode == 0) {
        this.displaySettingGui = false;
        alert("Password changed successfully for user : " + sessionStorage.getItem("sesLoginName"));
        window.location.href = window.location.protocol + '//' + window.location.host;    
  }
      else {
        try {
          if(res.errorCode == 114){
            alert("Old Password does not Matched . Please enter valid password.")
          }
          else if(res.errorCode == 113) {
            alert ("Error in changing password from server");
          }
  
        }
        catch (e) {
          console.log(e);
        }
      }
    }
  
    /* for display Refresh interval Gui*/
    changeRefreshInterval() {
      this.displayRefreshIntervalGui = true;
      this.testRunRefreshInterval = sessionStorage.getItem("testRunRefreshInterval");
      this.alertRefreshInterval = sessionStorage.getItem("alertRefreshInterval");
      this.cpuUtiliRefreshInterval = sessionStorage.getItem("cpuRefreshInterval");
      this.heapRefreshInterval = sessionStorage.getItem("heapMemoryRefreshInterval");
      this.overAllRefreshInterval = sessionStorage.getItem("overAllMemoryRefreshInterval");
      this.diskSpaceRefreshInterval = sessionStorage.getItem("diskSpaceRefreshInterval");
    }
  
    /* for update Refresh interval time */
    UpdateRefreshIntervalTime() {
      var pattern = /^[0-9]*$/;   
       if (!this.testRunRefreshInterval.match(pattern) || !this.alertRefreshInterval.match(pattern) ||
           !this.cpuUtiliRefreshInterval.match(pattern) || !this.heapRefreshInterval.match(pattern) || 
           !this.overAllRefreshInterval.match(pattern) || !this.diskSpaceRefreshInterval.match(pattern)) {
             alert("Enter only numbers");
               return;
         }else if(this.testRunRefreshInterval == '' || this.alertRefreshInterval == '' || this.cpuUtiliRefreshInterval == ''
                  || this.heapRefreshInterval == '' || this.overAllRefreshInterval == '' || this.diskSpaceRefreshInterval == '' ) {
              alert('Enter all mandatory values');
              return;
  
        }
      sessionStorage.setItem('testRunRefreshInterval', this.testRunRefreshInterval);
      sessionStorage.setItem('alertRefreshInterval', this.alertRefreshInterval);
      sessionStorage.setItem('cpuRefreshInterval', this.cpuUtiliRefreshInterval);
      sessionStorage.setItem('heapMemoryRefreshInterval', this.heapRefreshInterval);
      sessionStorage.setItem('overAllMemoryRefreshInterval', this.overAllRefreshInterval);
      sessionStorage.setItem('diskSpaceRefreshInterval', this.diskSpaceRefreshInterval);
   
      if (this.checkedConfigValue == true) {
        var url = this._config.$appPath + "/productSummary/SummaryWebService/updateConfigRefreshIntervalTime?testRunRefreshInterval=" + sessionStorage.getItem("testRunRefreshInterval") + "&alertRefreshInterval=" + sessionStorage.getItem("alertRefreshInterval") +
          "&cpuRefreshInterval=" + sessionStorage.getItem("cpuRefreshInterval") + "&heapMemoryRefreshInterval=" + sessionStorage.getItem("heapMemoryRefreshInterval") +
          "&overAllMemoryRefreshInterval=" + sessionStorage.getItem("overAllMemoryRefreshInterval") + "&diskSpaceRefreshInterval=" + sessionStorage.getItem("diskSpaceRefreshInterval");
        this._http.get(url).map((res: Response) => res.json()).subscribe(res => console.log("Success"));
      }
      this.displayRefreshIntervalGui = false;
    }
  
    ResetRefreshIntervalTime() {
      this._http.get(this.testInfoRefreshIntervalUrl).map((res: Response) => res.json()).subscribe(res => this.resetIntervelTime(res));
    }
  
    resetIntervelTime(res) {
      sessionStorage.setItem('testRunRefreshInterval', res["testRunRefreshInterval"]);
      sessionStorage.setItem('alertRefreshInterval', res["alertRefreshInterval"]);
      sessionStorage.setItem('cpuRefreshInterval', res["cpuRefreshInterval"]);
      sessionStorage.setItem('heapMemoryRefreshInterval', res["heapMemoryRefreshInterval"]);
      sessionStorage.setItem('overAllMemoryRefreshInterval', res["overAllMemoryRefreshInterval"]);
      sessionStorage.setItem('diskSpaceRefreshInterval', res["diskSpaceRefreshInterval"]);
  
      this.testRunRefreshInterval = sessionStorage.getItem("testRunRefreshInterval");
      this.alertRefreshInterval = sessionStorage.getItem("alertRefreshInterval");
      this.cpuUtiliRefreshInterval = sessionStorage.getItem("cpuRefreshInterval");
      this.heapRefreshInterval = sessionStorage.getItem("heapMemoryRefreshInterval");
      this.overAllRefreshInterval = sessionStorage.getItem("overAllMemoryRefreshInterval");
      this.diskSpaceRefreshInterval = sessionStorage.getItem("diskSpaceRefreshInterval");
    }
  
    onClickPersonButton() {
      this.cavMenuNavigatorService.toggleClickPerson("Rajesh kumar jyotish");
    }
  
    //Actions performed while clicking on options under setting icon
    actionPerformed() {
      this.authenticationService.$canDeactivatelogoutFlag = true;
      sessionStorage.removeItem("sessUserName");		// Removing User Name
      sessionStorage.removeItem("sessUserPass");		// Removing user Password
      let url = this._config.$serverIP + "/" + sessionStorage.getItem('productType') + "/analyze/productUIRedirect.jsp?strOprName=logout";
      this.authenticationService.createJspSession(url);
      sessionStorage.clear();
      console.log("comiher e==============");
      this.router.navigate(['/login']);			//Navigating to Login Page
    }
  
    clickHome() {
      this.router.navigate(['/home/panel/widget']);
    }
  
    //Fullscreen mode
    fillScreenMode() {
      if (this.visible)
        this.visible = false;
      else
        this.visible = true;
    }
  
    /*Closing Tab on click of cross icon of tab. */
    onCloseNavTab($event, navTab) {
      try {
       $event.stopPropagation();
       $event.preventDefault();
  
       console.info('Closing tab =', navTab);
       this._navService.removeNavigationLink(navTab.name);
      } catch (e) {
        console.error(e);
      }
    }
  
  /*Function to link to the page help */
    pageHelp(){
      try {
        let serialNumber =sessionStorage.getItem('serialNumber');
        let productname = this._config.$productName.toLowerCase();
        let machineIP = this._config.$host;
        let machineInfo = {'serialNumber':serialNumber, 'productName':productname, 'machineIP':machineIP};
        this.post('http://www.cavisson.com/product-help',machineInfo,'post')
  
      } catch (error) {
  
      }
    }
    post(path, params, method) {
      method = method || "post"; // Set method to post by default if not specified.
      var form = document.createElement("form");
    // Set attributes to specify the form properties.
      form.setAttribute("method", method);
      form.setAttribute("action", path);
      form.setAttribute("target", "_blank");
  
  
      for(var key in params) {
          if(params.hasOwnProperty(key)) {
              var hiddenField = document.createElement("input");
              hiddenField.setAttribute("type", "hidden");
              hiddenField.setAttribute("name", key);
              hiddenField.setAttribute("value", params[key]);
  
              form.appendChild(hiddenField);
          }
      }
  
      document.body.appendChild(form);
      form.submit();
    }
  
  
    /*Method is used for applying theme. */
    onChangeTheme(event, theme) {
      try {
  
           if (theme === undefined || theme === null) {
             localStorage.setItem('ProductTheme', '2');
             theme = '2';
           }
  
           console.info('Changing theme to ' + theme + '.');
  
           /*Loading Theme CSS. */
           let themeLink: HTMLLinkElement = <HTMLLinkElement> document.getElementById('theme-css');
  
           if (themeLink === undefined || themeLink === null) {
              let themeLinkElement = jQuery('<link>');
              themeLinkElement.attr({
                  type: 'text/css',
                  rel: 'stylesheet',
                  id: 'theme-css',
                  href: 'resources/themes/theme' + theme + '/theme.css'
              }).appendTo('body');
  
              themeLink = <HTMLLinkElement> document.getElementById('theme-css');
           }
  
           themeLink.href = 'resources/themes/theme' + theme + '/theme.css';
           let hThemeLink = 'resources/themes/theme' + theme + '/highchart-colors.js';
  
           /*Loading Highchart theme. */
           jQuery.getScript(hThemeLink)
            .done(function(script, textStatus) {
              console.info('Highchart Theme Loaded successfully.', hThemeLink);
             
            })
            .fail(function(jqxhr, settings, exception) {
              console.error('Error while loading highchart theme.', hThemeLink, exception);
            });
  
          /*Setting Theme here. */
          localStorage.setItem('ProductTheme', theme);
  
          /*Setting the theme */
           this.activateTheme();
  
           if (event !== null) {
             event.preventDefault();
           }
         } catch (e) {
           console.error(e);
      }
    }
  
    /**Activating theme */
    activateTheme() {
      try {
  
        if (localStorage.getItem('ProductTheme') === undefined || localStorage.getItem('ProductTheme') === null) {
          console.info('User default theme not available. Going to default theme 1.');
          localStorage.setItem('ProductTheme', '1');
        }
  
        let theme = parseInt(localStorage.getItem('ProductTheme'), 10);
        for (let i = 0; i < this.arrThemeNames.length; i++) {
          let arrThemes = this.arrThemeNames[i];
          for (let k = 0; k < arrThemes.length; k++) {
            if (arrThemes[k].text == theme) {
              arrThemes[k].isActive = true;
            } else {
              arrThemes[k].isActive = false;
            }
          }
        }
      } catch (e) {
        console.error('Error while activating theme.', e);
      }
    }
  
   
  
}
